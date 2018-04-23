import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";

export class StaffSearchStore {

  @observable dataSource = [];
  @observable fetching = false;

  @action
  fetch = (filter) => {
    let query = `
        query Staffs($Page: Int, $Limit: Int, $Query: String, $HubID: Int) {
            Staffs(Pageable: {Page: $Page, Limit: $Limit}, Query: $Query, HubID: $HubID) {
                Items {
                  ID
                  Name
                  Phone
                }        
            }
        }
    `;

    let variables = {
      Page: 1,
      Limit: 30
    };
    if (filter) {
      let {Query, HubID} = filter;
      variables.Query = Query || null;
      variables.HubID = HubID || null;
    }

    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        this.dataSource = result.data.Staffs.Items;
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  }

}

export default new StaffSearchStore();