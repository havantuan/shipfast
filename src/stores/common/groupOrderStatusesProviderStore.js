import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";
import memoize from 'memoizee';

export class GroupOrderStatusesProviderStore {

  @observable dataSource = [];
  @observable fetching = false;

  @action
  getDataSource = (HiddenAllStatus = true) => {
    return this.cacheFetch(HiddenAllStatus).then(action((result) => {
      this.dataSource = result.data.GroupOrderStatuses;
      return result;
    })).catch(action(e => {
      errorMessage(e);
      throw e;
    })).finally(action(() => {
      this.fetching = false;
    }));
  };

  @action
  cacheFetch = memoize((HiddenAllStatus) => {
    let query = `
        query GroupOrderStatuses($HiddenAllStatus: Boolean) {
          GroupOrderStatuses(HiddenAllStatus: $HiddenAllStatus) {
              Name
              Code
              Statuses {
                Name
                Code
              }
          }
        }
    `;
    this.fetching = true;
    let variables = {HiddenAllStatus};

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      });
  }, {length: 5, promise: true})

}

export default new GroupOrderStatusesProviderStore();