import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";
import memoize from 'memoizee';

export class GroupTaskOrderStatusesProviderStore {

  @observable dataSource = [];
  @observable fetching = false;

  @action
  getDataSource = () => {
    return this.cacheFetch().then(action((result) => {
      this.dataSource = result.data.TasksOrdersGroupStatuses;
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
        query TasksOrdersGroupStatuses {
          TasksOrdersGroupStatuses {
               Name
              Code
              Statuses {
                Code
                Color
                Name
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

export default new GroupTaskOrderStatusesProviderStore();