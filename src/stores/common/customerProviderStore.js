import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";

export class CustomerProviderStore {

  @observable dataSource = [];
  @observable fetching = false;
  @action
  getDataSource = (filter) => {
    this.fetch(filter);
  };

  @action
  fetch = (filter) => {
    let query = `
        query Customers($Query: String, $UserType: EnumUserType) {
            Customers(Query: $Query, UserType: $UserType) {
                Items {
                  ID
                  Name
                  Phone
                }        
            }
        }
    `;

    let variables = {};
    if (filter) {
      let {Query, UserType} = filter;
      variables.Query = Query || null;
      variables.UserType = UserType || null;
    }

    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        this.dataSource = result.data.Customers.Items;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  }

}

export default new CustomerProviderStore();