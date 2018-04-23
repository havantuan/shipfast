import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../../request';
import apiUrl from '../../config/apiUrl';
import {defaultPagination} from '../../config';
import {successMessage} from "../../request/utils";
import meStore from "../meStore";
import {message} from 'antd';
import {checkExist} from "../../helpers/utility";

export class ReceivePickingListStore {

  @observable fetching = false;
  @observable dataSource = [];
  @observable currentRow = undefined;
  @observable isFetchingCurrentRow = false;
  @observable isFetchingOrder = false;
  @observable isFetchingRowID = 0;
  @observable pagination = defaultPagination;
  @observable order = [];
  @observable isConfirming = false;
  @observable isReporting = false;
  @observable pickingListCode = null;
  @observable codes = [];
  @observable dataTable = [];
  @observable receiveCodes = [];

  @action
  onFilter = (code) => {
    this.clear();
    this.codes = [];
    this.dataTable = [];
    this.receiveCodes = [];
    this.pickingListCode = code;
    this.pagination = defaultPagination;
    this.getMultiData();
  };

  @action
  getMultiData = () => {
    this.fetch({PickingListCode: this.pickingListCode, StatusCodes: [354, 374], HubID: meStore.getCurrentHub()});
    this.fetchPickingListByCode(this.pickingListCode);
  };

  @action
  fetch = (filter) => {
    let query = `
      query Orders($PickingListCode: String, $StatusCodes: [Int], $HubID: Int) {
        Orders(PickinglistCode: $PickingListCode, StatusCodes: $StatusCodes, HubID: $HubID) {
          Items {
            Code
          }
        }
      }
    `;

    let variables = {};

    if (filter) {
      let {PickingListCode, StatusCodes, HubID} = filter;
      variables.PickingListCode = PickingListCode || null;
      variables.StatusCodse = StatusCodes || null;
      variables.HubID = HubID || null;
    }

    this.fetching = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        let key = result.data.Orders;
        this.dataSource = key.Items;
        this.codes = this.dataSource.map(val => val.Code);
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  fetchPickingListByCode = (Code) => {
    let query = `
      query PickingList($Code: String!) {
          PickingList(Code: $Code) {
              Code
              CreatedAt {
                Pretty
              }
              DestinationHub {
                DisplayName
              }
              SourceHub {
                DisplayName
              }
              Status {
                Code
                Color
                Name
              }
              Weight
          }
      }
    `;
    let variables = {Code};

    this.isFetchingCurrentRow = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        this.currentRow = result.data.PickingList;
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isFetchingCurrentRow = false;
      }));
  };

  @action
  fetchOrderByCode = (Code) => {
    let query = `
        query Order($Code: String!) {
          Order(Code: $Code) {
            Cod
            Code
            Name
            NetWeight
            PaymentType {
              Name
            }
            Quantity
            ServiceType {
              Name
            }
            StatusCode {
              Color
              Name
            }
            Sender {
              Hub {
                DisplayName
              }
            }
            Receiver {
              Hub {
                DisplayName
              }
              AccountReceivable
            }
            TotalCost
          }
        }
        `;

    let variables = {Code};

    this.isFetchingOrder = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        let key = result.data.Order;
        this.dataTable.push(key);
        this.receiveCodes.push(Code);
        this.codes = this.codes.filter(val => val !== Code.toUpperCase());
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isFetchingOrder = false;
      }));
  };

  @action
  confirmPickingListOrders = () => {
    let code = this.pickingListCode;
    let data = {
      OrderCodes: this.receiveCodes
    };
    this.isConfirming = true;
    return authRequest
      .put(apiUrl.CONFIRM_PICKING_LIST_ORDERS_URL.replace(':code', code), data).then(action((result) => {
        let results = result.data;
        if (results && Object.keys(results).length > 0) {
          let {orderResults, pickingList} = results;
          if (orderResults && orderResults.length > 0) {
            orderResults.forEach(val => {
              let type = val.result.toLowerCase();
              if (!checkExist(['success', 'error', 'info', 'warning'], type)) {
                type = 'info';
              }
              message[type](val.message);
            });
          }
          if (pickingList) {
            let type = pickingList.result.toLowerCase();
            if (!checkExist(['success', 'error', 'info', 'warning'], type)) {
              type = 'info';
            }
            message[type](pickingList.message);
          }
          this.dataTable = [];
          this.receiveCodes = [];
          this.getMultiData();
        }
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isConfirming = false;
      }));
  };

  @action
  reportLostPickingListOrders = (data) => {
    let code = this.pickingListCode;
    this.isReporting = true;
    return authRequest
      .put(apiUrl.REPORT_LOST_PICKING_LIST_ORDERS_URL.replace(':code', code), data).then(action((result) => {
        successMessage('Báo thất lạc đơn hàng thành công');
        this.fetch({PickingListCode: this.pickingListCode, StatusCode: 354, HubID: meStore.getCurrentHub()});
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isReporting = false;
      }));
  };

  @action
  clear = () => {
    this.dataSource = [];
    this.currentRow = undefined;
    this.pickingListCode = null;
  };

  @action
  setPickingListCode = (code) => {
    this.pickingListCode = code;
    this.getMultiData();
  };

  @action
  receive = (code) => {
    code = code.toUpperCase();
    if (this.receiveCodes.length > 0 && checkExist(this.receiveCodes, code)) {
      message.info(`Đơn hàng ${code} đã được quét`);
      return;
    }
    this.fetchOrderByCode(code);
  };

  @action
  remove = (code) => {
    code = code.toUpperCase();
    this.dataTable = this.dataTable.filter(val => val.Code.toUpperCase() !== code);
    this.receiveCodes = this.receiveCodes.filter(val => val !== code);
    this.codes.push(code);
  };

}

export default new ReceivePickingListStore();