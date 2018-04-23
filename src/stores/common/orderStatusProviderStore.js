import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";
import memoize from 'memoizee';

export class OrderStatusProviderStore {

  @observable dataSource = {};
  @observable fetching = false;
  @observable reasonValue = {};

  @action
  onChange = (value, index) => {
    let tmp = {...this.reasonValue};
    tmp[index] = value;
    this.reasonValue = tmp;
  };

  @action
  getDataSource = (Code) => {
    this.cacheFetch(Code).then(action((result) => {
      this.dataSource = result.data.OrderStatus;
    })).catch(action(e => {
      errorMessage(e);
      throw e;
    })).finally(action(() => {
      this.fetching = false;
    }));
  };

  @action
  cacheFetch = memoize((Code) => {
    let query = `
        query OrderStatus($Code: Int!) {
          OrderStatus(Code: $Code) {
            Code
            Color
            Name
            NextCodes {
              Code
              Color
              Name
            }
          }
        }
    `;

    let variables = {Code};

    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      });
  }, {length: 5, promise: true})

}

export default new OrderStatusProviderStore();