import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";
import memoize from 'memoizee';

export class OrderStatusesProviderStore {

  @observable dataSource = [];
  @observable fetching = false;
  @observable valuesSelected = [];

  @action
  onChange = (values) => {
    this.valuesSelected = values;
  };

  @action
  clear = () => {
    this.dataSource = [];
  };

  @action
  getDataSource = (filter = null) => {
    let {GroupOrderStatus, EventOrderStatus} = filter;
    if ((!Array.isArray(GroupOrderStatus) || GroupOrderStatus.length === 0)
      && (!Array.isArray(EventOrderStatus) || EventOrderStatus.length === 0)) {
      this.dataSource = [];
      this.valuesSelected = [];
      return;
    }
    // fetch data
    this.cacheFetch(filter).then(action((result) => {
      let data = result.data.OrderStatuses;
      this.dataSource = data;
      let codes = data.map(val => `${val.Code}`);
      this.valuesSelected = this.valuesSelected.filter(val => codes.indexOf(val) !== -1);
    })).catch(action(e => {
      errorMessage(e);
      throw e;
    })).finally(action(() => {
      this.fetching = false;
    }));
  };

  @action
  cacheFetch = memoize((filter) => {
    let query = `
        query OrderStatuses($GroupOrderStatus: [Int], $EventOrderStatus: [Int]) {
          OrderStatuses(GroupOrderStatus: $GroupOrderStatus, EventOrderStatus: $EventOrderStatus) {
            Code
            Name
          }
        }
    `;

    let variables = {};
    if (filter) {
      variables.GroupOrderStatus = filter.GroupOrderStatus || null;
      variables.EventOrderStatus = filter.EventOrderStatus || null;
    }

    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      });
  }, {length: 5, promise: true})

}

export default new OrderStatusesProviderStore();