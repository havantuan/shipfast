import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../request/index';
import apiUrl from "../config/apiUrl";
import memoize from 'memoizee';

export class OrderGroupStatusStore {

  @observable dataSource = [];
  @observable fetching = false;

  @action
  getDataSource = () => {
    this.cacheFetch();
  };

  @action
  cacheFetch = memoize(() => {
    let query = `
        query DataSources {
            GroupOrderStatuses {
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

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
      }).then(action((result) => {
        this.dataSource = result.data.GroupOrderStatuses;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  }, {length: 5, promise: true})

}

export default new OrderGroupStatusStore();