import {action, computed, observable} from "mobx";
import {authRequest, errorMessage} from '../../request';
import apiUrl from '../../config/apiUrl';
import {defaultPagination} from '../../config';
import ObjectPath from 'object-path';
import {convertToPagination, convertToSorter, filterDateTime} from '../../helpers/utility';
import {successMessage} from "../../request/utils";
import {message} from 'antd';
import eventStatusStatisticStore from "../statistics/eventStatusStatisticStore";
import moment from "moment";
import meStore from "../meStore";

export class ReProcessOrderStore {

  @observable fetching = false;
  @observable dataSource = [];
  @observable isShowModal = false;
  @observable currentRow = undefined;
  @observable isFetchingCurrentRow = false;
  @observable isFetchingRowID = 0;
  @observable filter = {
    // ...setDefaultDate('CreatedFrom', 'CreatedTo')
  };
  @observable pagination = defaultPagination;
  @observable order = [];
  @observable ordersChecked = [];
  @observable isUpdating = false;
  @observable isUpdatingReceiver = false;
  @observable isPerformingReturn = false;
  @observable isPerformingOverWeight = false;
  @observable isConfirming = false;
  @observable reason = [];
  @observable ordersWeight = [];
  @observable expandSearch = false;

  @computed
  get timeSelected() {
    let {CreatedFrom, CreatedTo} = this.filter;
    if (CreatedFrom && CreatedTo) {
      return [CreatedFrom, CreatedTo];
    }
  }

  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order)
  };

  @action
  handleTableChange = (pagination, filters, sort) => {
    this.pagination = convertToPagination(pagination, this.pagination);
    this.order = convertToSorter(sort);
    this.reload();
  };

  @action
  onFilter = (filter) => {
    this.filter = {
      ...this.filter,
      ...filter,
    };
    this.pagination = defaultPagination;
    return this.reload();
  };

  @action
  fetch = (filter, pagination, order = []) => {
    let query = `
    query OrdersFilter($Page: Int, $Limit: Int, $Order: [Sort], $SenderQuery: String, $ReceiverQuery: String, $CreatedFrom: DateTime${filterDateTime(filter.CreatedFrom)}, $CreatedTo: DateTime${filterDateTime(filter.CreatedTo)}, $HubID: Int, $SenderCityID: Int, $SenderDistrictID: Int, $SenderWardID: Int, $ReceiverCityID: Int, $ReceiverDistrictID: Int, $ReceiverWardID: Int, $Codes: [String], $EventStatusCode: Int, $StatusCodes: [Int], $ServiceTypeID: Int) {
      Orders(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, SenderQuery: $SenderQuery, ReceiverQuery: $ReceiverQuery, CreatedFrom: $CreatedFrom, CreatedTo: $CreatedTo, HubID: $HubID, SenderCityID: $SenderCityID, SenderDistrictID: $SenderDistrictID, SenderWardID: $SenderWardID, ReceiverCityID: $ReceiverCityID, ReceiverDistrictID: $ReceiverDistrictID, ReceiverWardID: $ReceiverWardID, Codes: $Codes, EventStatusCode: $EventStatusCode, StatusCodes: $StatusCodes, ServiceTypeID: $ServiceTypeID) {
        Items {
          Code
          CreatedAt {
            Pretty
          }
          Customer {
            Name
            Phone
          }
          NetWeight
          DeliveryNote
          Receiver {
            ToBeModifiedAddress
            Address
            Name
            Phone
            City {
              ID
            }
            District {
              ID
            }
            Ward {
              ID
            }
          }
          Sender {
            Address
            Name
            Phone
          }
          ServiceType {
            Name
          }
          Staff {
            Name
            Phone
          }
          StatusCode {
            Code
            Color
            Name
          }
          UpdatedAt {
            Pretty
          }
          IsProvincialShipping
          ReturningCost
          TotalCost
        }
        Pager {
          Limit
          NumberOfPages
          Page
          TotalOfItems
        }
      }
    }
    `;
    let {pageSize, current} = pagination;
    let variables = {
      Page: current || null,
      Limit: pageSize || null,
      Order: order || null,
    };
    if (filter) {
      let {
        SenderQuery, ReceiverQuery, SenderCityID, SenderDistrictID,
        SenderWardID, ReceiverCityID, ReceiverDistrictID, ReceiverWardID, Codes, EventStatusCode, StatusCodes, ServiceTypeID
      } = filter;
      variables.SenderQuery = SenderQuery || null;
      variables.ReceiverQuery = ReceiverQuery || null;
      variables.HubID = meStore.getCurrentHub();
      variables.SenderCityID = SenderCityID || null;
      variables.SenderDistrictID = SenderDistrictID || null;
      variables.SenderWardID = SenderWardID || null;
      variables.ReceiverCityID = ReceiverCityID || null;
      variables.ReceiverDistrictID = ReceiverDistrictID || null;
      variables.ReceiverWardID = ReceiverWardID || null;
      variables.Codes = Codes || null;
      variables.EventStatusCode = EventStatusCode || null;
      variables.StatusCodes = StatusCodes || null;
      variables.ServiceTypeID = ServiceTypeID || null;
    }

    this.fetching = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const key = result.data.Orders;
        this.dataSource = key.Items;
        this.pagination = {
          ...pagination,
          total: ObjectPath.get(key, 'Pager.TotalOfItems', 0)
        };
        this.order = order;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  updateStatus = (code, data) => {
    this.isUpdating = true;
    return authRequest
      .put(apiUrl.UPDATE_ORDER_STATUS_URL.replace(':code', code), data).then(action((result) => {
        successMessage('Cập nhật trạng thái đơn hàng thành công');
        this.reload();
        this.reloadStatistic();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isUpdating = false;
      }));
  };

  @action
  checkedChange = (orderCode, index) => {
    let data = this.ordersChecked.find(val => val.id === index);
    if (data) {
      this.ordersChecked = this.ordersChecked.filter(val => val.id !== index);
    }
    else {
      this.ordersChecked.push({
        id: index,
        code: orderCode
      });
    }
  };

  @action
  handleUpdate = (rowKey, statusCode) => {
    let data = this.ordersChecked.find(val => val.id === rowKey);
    if (!data) {
      message.error('Chưa có đơn hàng nào được chọn');
      return;
    }
    if (statusCode && data && data.code) {
      this.updateStatus(data.code, {StatusCode: +statusCode}).finally(action(() => {
        this.ordersChecked = this.ordersChecked.filter(val => val.id !== rowKey);
      }));
    }
  };

  @action
  clear = () => {
    this.dataSource = [];
    this.filter = {
      // ...setDefaultDate('CreatedFrom', 'CreatedTo')
    };
    this.ordersChecked = [];
    this.reason = {};
    this.currentRow = undefined;
    this.pagination = defaultPagination;
  };

  @action
  updateReceiver = (code, data) => {
    this.isUpdatingReceiver = true;
    return authRequest
      .put(apiUrl.UPDATE_RECEIVER_URL.replace(':code', code), data).then(action((result) => {
        this.cancelModal();
        this.reload();
        this.reloadStatistic();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isUpdatingReceiver = false;
      }));
  };

  @action
  performReturn = (code, data) => {
    this.isPerformingReturn = true;
    return authRequest
      .put(apiUrl.PERFORM_RETURN_ORDER_URL.replace(':code', code), data).then(action((result) => {
        this.reload();
        this.reloadStatistic();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isPerformingReturn = false;
      }));
  };

  @action
  showModal = (data) => {
    this.isShowModal = true;
    this.currentRow = data;
    this.isFetchingRowID = data.Code
  };

  @action
  cancelModal = () => {
    this.isShowModal = false;
    this.currentRow = undefined;
  };

  @action
  handlePerformReturn = (rowKey, statusCode) => {
    let data = this.ordersChecked.find(val => val.id === rowKey);
    if (!data) {
      message.error('Chưa có đơn hàng nào được chọn');
      return;
    }
    if (statusCode && data && data.code) {
      this.performReturn(data.code, {NextStatusCode: +statusCode});
      this.ordersChecked = this.ordersChecked.filter(val => val.id !== rowKey);
    }
  };

  @action
  confirmReturn = (code, data) => {
    this.isConfirming = true;
    return authRequest
      .put(apiUrl.CONFIRM_RETURN_ORDER_URL.replace(':code', code), data).then(action((result) => {
        successMessage('Cập nhật trạng thái đơn hàng thành công');
        this.reload();
        this.reloadStatistic();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isConfirming = false;
      }));
  };

  @action
  handleConfirmInWaitingReturn = (code) => {
    let data = this.reason.find(val => val.code === code);
    if (code) {
      this.confirmReturn(code, {
        NextStatusCode: 501,
        Note: data ? data.note : null
      });
    }
  };

  @action
  handlePerformInWaitingReturn = (code) => {
    let data = this.reason.find(val => val.code === code);
    if (code) {
      this.confirmReturn(code, {
        NextStatusCode: 451,
        Note: data ? data.note : null
      });
    }
  };

  @action
  changeReason = (value, code) => {
    let data = this.reason.find(val => val.code === code);
    let tmpIndex = this.reason.findIndex(val => val.code === code);
    if (data) {
      this.reason[tmpIndex] = {
        ...data,
        note: value
      }
    }
    else {
      this.reason.push({
        code,
        note: value
      })
    }
  };

  @action
  performOrderOverWeight = (code, data) => {
    this.isPerformingOverWeight = true;
    return authRequest
      .put(apiUrl.PERFORM_OVER_WEIGHT_URL.replace(':code', code), data).then(action((result) => {
        successMessage('Cập nhật trạng thái đơn hàng thành công');
        this.reload();
        this.reloadStatistic();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isPerformingOverWeight = false;
      }));
  };

  @action
  onChangeWeight = (value, code) => {
    if (isNaN(value)) {
      return;
    }
    let data = this.ordersWeight.find(val => val.code === code);
    let tmpIndex = this.ordersWeight.findIndex(val => val.code === code);
    if (data) {
      this.ordersWeight[tmpIndex] = {
        ...data,
        value: value ? +value : null
      }
    }
    else {
      this.ordersWeight.push({
        code,
        value
      })
    }
  };

  @action
  handlePerformOverWeight = (code) => {
    let data = this.ordersWeight.find(val => val.code === code);
    if (data && data.value) {
      this.performOrderOverWeight(code, {NetWeight: data.value});
    }
  };

  reloadStatistic = () => {
    eventStatusStatisticStore.fetch();
  };

  @action
  onToggleExpandSearch = () => {
    this.expandSearch = !this.expandSearch;
  };

}

export default new ReProcessOrderStore();