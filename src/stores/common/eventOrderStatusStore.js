import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";
import memoize from 'memoizee';

export class EventOrderStatusStore {

  @observable dataSource = {};
  @observable fetching = false;
  @observable reasonValue = {};
  @observable isOther = false;
  @observable textOther = null;

  @action
  onChangeText = (value) => {
    this.textOther = value;
  };

  @action
  onChange = (value, index, otherKey = 'other') => {
    let tmp = {...this.reasonValue};
    tmp[index] = value;
    this.reasonValue = tmp;
    this.isOther = (value === otherKey);
  };

  @action
  getDataSource = (Code) => {
    this.cacheFetch(Code).then(action((result) => {
      this.dataSource = result.data.EventOrderStatus;
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
        query EventOrderStatus($Code: Int!) {
            EventOrderStatus(Code: $Code) {
                Name
                Code
                AcceptStatuses {
                  Name
                  Code
                }
                Statuses {
                  Name
                  Code
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

export default new EventOrderStatusStore();