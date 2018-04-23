import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";
import memoize from 'memoizee';

export class EnumProviderStore {

  @observable dataSource = [];
  @observable fetching = false;

  @action
  getDataSource = () => {
    this.cacheFetch().then(action((result) => {
      this.dataSource = result.data.Enum;
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
        query Enum {
          Enum {
            ActionTypes {
              Code
              Name
              Value
            }
            AppTypes {
              Code
              Name
              Value
            }
            HubTypes {
              Code
              Name
              Value
            }
            KHTypes {
              Code
              Name
              Value
            }
            States {
              Code
              Value
              Name      
            }
            Scopes {
              Code
            
              Name      
            }
            TaskTypes {
              Code
              Value      
              Name      
            }
            UserTypes{
              Code
              Value
              Name      
            }
            VehicleTypes {
              Code
              Value
              Name      
            }
            PickingListTypes {
              Code
              Name
              Value
            }
            NotificationTypes {
              Code
              Name
              Value
            }
            OrderStatisticsTypes {
              Code
              Name
              Value
            }
          }
        }
    `;

    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query
      });
  }, {length: 5, promise: true})

}

export default new EnumProviderStore();