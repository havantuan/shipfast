import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../../request';
import apiUrl from '../../config/apiUrl';
import {paginationConfig} from '../../config';
import {checkExist} from '../../helpers/utility';
import {successMessage} from "../../request/utils";

export class CreatePickingListStore {

  @observable fetching = false;
  @observable dataSource = [];
  @observable currentRow = {};
  @observable isFetchingCurrentRow = false;
  @observable isFetchingRowID = 0;
  @observable filter = {};
  @observable pagination = {
    current: paginationConfig.page,
    pageSize: paginationConfig.perPage,
    total: 0
  };
  @observable order = [];
  @observable keys = [{
    id: 0,
    Type: {value: 'InternalService'}
  }];
  @observable uuid = 1;
  @observable isCreating = false;

  @action
  fetchOrderByCode = (code) => {
    let query = `
        query Order($code: String!) {
          Order(Code: $code) {
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
    let variables = {code};

    this.isFetchingCurrentRow = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        this.currentRow = result.data.Order;
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isFetchingCurrentRow = false;
      }));
  };

  @action
  removeListItem = (index) => {
    if (this.keys.length === 1) {
      return;
    }
    this.keys = this.keys.filter(key => key.id !== index);
  };

  @action
  addListItem = () => {
    let id = this.uuid;
    this.keys.push({
      id,
      Type: {value: 'InternalService'}
    });
    this.uuid = id + 1;
  };

  @action
  handleFormChange = (index, changedFields) => {
    let tmpIndex = this.keys.findIndex(val => val.id === index);
    this.keys[tmpIndex] = {
      ...this.keys[tmpIndex],
      ...changedFields
    };
  };

  @action
  addOrder = (index, code) => {
    code = code.toUpperCase();
    let tmp = this.keys.find(val => val.id === index);
    if (tmp === undefined) return;
    if (tmp.ordersCode && checkExist(tmp.ordersCode, code)) return;
    let {ordersCode} = tmp;
    this.fetchOrderByCode(code).then(result => {
      let tmpIndex = this.keys.findIndex(val => val.id === index);
      this.keys[tmpIndex] = {
        ...tmp,
        OrderCode: {},
        dataSource: tmp.dataSource ? tmp.dataSource.concat(result.data.Order) : [result.data.Order],
        ordersCode: ordersCode ? ordersCode.concat(code) : [code]
      };
    });
  };

  @action
  removeOrder = (index, code) => {
    code = code.toUpperCase();
    let tmp = this.keys.find(val => val.id === index);
    if (tmp && tmp.ordersCode) {
      let tmpIndex = this.keys.findIndex(val => val.id === index);
      this.keys[tmpIndex] = {
        ...tmp,
        OrderCode: {},
        dataSource: tmp.dataSource.filter(val => val.Code.toUpperCase() !== code),
        ordersCode: tmp.ordersCode.filter(val => val !== code)
      };
    }
  };

  @action
  create = (data) => {
    this.isCreating = true;
    return authRequest
      .post(apiUrl.CREATE_PICKING_LIST_URL, data).then(action((result) => {
        successMessage('Tạo bảng kê thành công');
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isCreating = false;
      }));
  };

}

export default new CreatePickingListStore();