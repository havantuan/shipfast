import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";
import memoize from 'memoizee';

export class HubProviderStore {

  @observable dataSource = [];
  @observable fetching = false;

  @action
  getDataSource = (cityID) => {
    this.cacheFetch(cityID).then(action((result) => {
      this.dataSource = result.data.Hubs.Items;
    })).catch(action(e => {
      errorMessage(e);
      throw e;
    })).finally(action(() => {
      this.fetching = false;
    }));
  };

  @action
  cacheFetch = memoize((cityID) => {
    let query = `
        query Hubs($cityID: Int) {
          Hubs (CityID: $cityID, State: Active) {
            Items {
              ID
              DisplayName
              Name
            }
          }
        }
    `;

    let variables = {cityID};

    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      });
  }, {length: 5, promise: true})

}

export default new HubProviderStore();