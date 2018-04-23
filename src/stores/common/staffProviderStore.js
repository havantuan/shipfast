import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";
import memoize from 'memoizee';
import meStore from "../meStore";

export class StaffProviderStore {

  @observable dataSource = [];
  @observable fetching = false;

  @action
  getDataSource = () => {
    this.cacheFetch(meStore.getCurrentHub()).then(action((result) => {
      this.dataSource = result.data.Staffs.Items;
    })).catch(action(e => {
      errorMessage(e);
      throw e;
    })).finally(action(() => {
      this.fetching = false;
    }));
  };

  @action
  cacheFetch = memoize((hubID) => {
    let query = `
      query StaffsFilter($hubID: Int) {
        Staffs(HubID: $hubID) {
          Items {
            Email
            ID
            Name
            Phone
          }
          Limit
          NumberOfPages
          Page
          TotalOfItems
        }
      }
    `;
    let variables = {
      hubID: hubID || null
    };
    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      });
  }, {length: 5, promise: true});

}

export default new StaffProviderStore();