import {action, computed, observable} from "mobx";
import {authRequest, errorMessage} from '../../request';
import apiUrl from '../../config/apiUrl';
import {defaultPagination} from '../../config';
import ObjectPath from 'object-path';
import {convertToPagination, convertToSorter, filterDateTime} from '../../helpers/utility';
import moment from "moment";

export class OrderingOrderStore {

  @observable fetching = false;
  @observable isRejecting = false;
  @observable isUpdating = false;
  @observable isShowModal = false;
  @observable dataSource = [];
  @observable currentRow = undefined;
  @observable isFetchingCurrentRow = false;
  @observable isFetchingRowID = 0;
  @observable items = undefined;
  @observable filter = {};
  @observable pagination = defaultPagination;
  @observable order = [];
  @observable assignValue = {};
  @observable rejectValue = {};
  @observable expandSearch = false;

  @computed
  get timeSelected() {
    let {CreatedFrom, CreatedTo} = this.filter;
    if (CreatedFrom && CreatedTo) {
      return [CreatedFrom, CreatedTo];
    }
  }

  @action
  onToggleExpandSearch = () => {
    this.expandSearch = !this.expandSearch;
  };

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
    this.filter = filter;
    this.pagination = defaultPagination;
    return this.reload();
  };

  @action
  fetch = (filter, pagination, order = []) => {
    let query = `
    query OrdersFilter($Page: Int, $Limit: Int, $Order: [Sort], $SenderQuery: String, $ReceiverQuery: String, $HubID: Int, $StaffID: Int, $SenderCityID: Int, $SenderDistrictID: Int, $SenderWardID: Int, $ReceiverCityID: Int, $ReceiverDistrictID: Int, $ReceiverWardID: Int, $GroupStatusCode: Int, $CreatedTo: DateTime${filterDateTime(filter.CreatedTo)}, $CreatedFrom: DateTime${filterDateTime(filter.CreatedFrom)}, $UpdatedTo: DateTime${filterDateTime(filter.UpdatedTo)}, $UpdatedFrom: DateTime${filterDateTime(filter.UpdatedFrom)}, $StatusCode: Int, $Codes: [String]) {
      Orders(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, SenderQuery: $SenderQuery, ReceiverQuery: $ReceiverQuery, HubID: $HubID, StaffID: $StaffID, SenderCityID: $SenderCityID, SenderDistrictID: $SenderDistrictID, SenderWardID: $SenderWardID, ReceiverCityID: $ReceiverCityID, ReceiverDistrictID: $ReceiverDistrictID, ReceiverWardID: $ReceiverWardID, GroupStatusCode: $GroupStatusCode, CreatedTo: $CreatedTo, CreatedFrom :$CreatedFrom, UpdatedFrom: $UpdatedFrom, UpdatedTo: $UpdatedTo, StatusCode: $StatusCode, Codes: $Codes) {
         Items {            
            Code
            CreatedAt {
              Pretty
            }
            DeliveryNote
            DeliveryTime {
              Pretty
            }
            Name
            NetWeight
            PaymentType {
              Name
            }
            ServiceType {     
              Name
            }
            Sender {
              Address
              Email
              Name
              Phone
              Hub {
                ID
              }
            }
            Staff {
              Name
              Phone
            }
            StatusCode {
              Name
              Code
              Color
            }               
            Receiver {
              Address
              Email
              Name
              Phone
              Hub {
                ID
              }
            }
            UpdatedAt {
              Pretty
            }
         }
        Pager{
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
        SenderQuery, ReceiverQuery, HubID, StaffID, SenderCityID, SenderDistrictID, SenderWardID,
        ReceiverCityID, ReceiverDistrictID, ReceiverWardID, GroupStatusCode, Codes
      } = filter;
      variables.SenderQuery = SenderQuery || null;
      variables.ReceiverQuery = ReceiverQuery || null;
      variables.HubID = HubID || null;
      variables.StaffID = StaffID || null;
      variables.SenderCityID = SenderCityID || null;
      variables.SenderDistrictID = SenderDistrictID || null;
      variables.SenderWardID = SenderWardID || null;
      variables.ReceiverCityID = ReceiverCityID || null;
      variables.ReceiverDistrictID = ReceiverDistrictID || null;
      variables.ReceiverWardID = ReceiverWardID || null;
      variables.GroupStatusCode = GroupStatusCode || null;
      variables.StatusCode = 100;
      variables.Codes = Codes || null;
    }

    this.fetching = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Orders;
        this.dataSource = data.Items;
        this.pagination = {
          ...pagination,
          total: ObjectPath.get(data, 'Pager.TotalOfItems', 0)
        };
        this.order = order;
        //------------
        let value = this.dataSource.filter(val => {
          return ObjectPath.has(val, 'Sender.Hub.ID') || ObjectPath.has(val, 'Receiver.Hub.ID')
        });
        if (value && value.length > 0) {
          let assignValue = {};
          value.forEach(val => {
            assignValue[val.Code] = {
              SenderHubID: ObjectPath.get(val, "Sender.Hub.ID", null),
              ReceiverHubID: ObjectPath.get(val, "Receiver.Hub.ID", null)
            };
          });
          this.assignValue = assignValue;
        }
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  assignOrderToHub = (code, data) => {
    this.isUpdating = true;
    return authRequest
      .put(apiUrl.ASSIGN_ORDER_TO_HUBS_URL.replace(':code', code), data).then(action((result) => {
        this.reload();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isUpdating = false;
      }));
  };

  @action
  handleReject = () => {
    let code = ObjectPath.get(this.rejectValue, 'OrderCode');
    let note = ObjectPath.get(this.rejectValue, "Note", null);
    this.rejectOrder(code, {Note: note});
  };

  @action
  rejectOrder = (code, data) => {
    this.isRejecting = true;
    return authRequest
      .put(apiUrl.REJECT_ORDER_URL.replace(':code', code), data).then(action((result) => {
        this.reload();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isRejecting = false;
        this.rejectValue = {};
        this.isShowModal = false;
      }));
  };

  @action
  onCancelModal = () => {
    this.isShowModal = false;
    this.rejectValue = {};
  };

  @action
  showModal = (orderCode) => {
    this.currentRow = undefined;
    this.isShowModal = true;
    this.rejectValue = {
      OrderCode: orderCode
    };
  };

  @action
  onChangeRejectReason = (value) => {
    this.rejectValue = {
      ...this.rejectValue,
      Note: value
    }
  };

  @action
  onChangeAssignValue = (value) => {
    this.assignValue = value;
  };

  @action
  clear = () => {
    this.dataSource = [];
    this.filter = {};
    this.currentRow = undefined;
    this.assignValue = {};
    this.rejectValue = {};
    this.pagination = defaultPagination;
  };

}

export default new OrderingOrderStore()