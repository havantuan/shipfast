import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";
import memoize from 'memoizee';

export class TaskStatusProviderStore {

  @observable dataSource = [];
  @observable fetching = false;

  @action
  getDataSource = () => {
    this.cacheFetch().then(action((result) => {
      this.dataSource = result.data.TaskStatuses;
    })).catch(action(e => {
      errorMessage(e);
      throw e;
    })).finally(action(() => {
      this.fetching = false;
    }));
  };

  @action
  cacheFetch = memoize(() => {
    let query = `
        query TaskStatuses {
          TaskStatuses {
            Code            
            Name
          }
        }
    `;

    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
      });
  }, {length: 5, promise: true})

}

export default new TaskStatusProviderStore();