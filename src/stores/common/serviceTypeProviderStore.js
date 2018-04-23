import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";

export class ServiceTypeProviderStore {

  @observable dataSource = [];
  @observable fetching = false;
  @observable filter = {
    SenderDistrictID: null,
    ReceiverDistrictID: null,
    IsCod: null,
    SenderInventoryID: null
  };

  @action
  onFilter = (filter) => {
    this.filter = filter;
    this.fetch(filter);
  };

  @action
  getDataSource = (filter) => {
    this.fetch(filter);
  };

  @action
  fetch = (filter) => {
    let query = `
        query ServiceTypes($SenderDistrictID: Int, $ReceiverDistrictID: Int, $IsCod: Boolean){            
          ServiceTypes(SenderDistrictID: $SenderDistrictID, ReceiverDistrictID: $ReceiverDistrictID, IsCod: $IsCod) {
            Conversion
            Name
            ValueType
            ID
          }
        }
    `;

    let variables = {};
    if (filter) {
      let {SenderDistrictID, ReceiverDistrictID, IsCod} = filter;
      variables.SenderDistrictID = SenderDistrictID || null;
      variables.ReceiverDistrictID = ReceiverDistrictID || null;
      variables.IsCod = IsCod || null;
    }

    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        this.dataSource = result.data.ServiceTypes;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  }

}

export default new ServiceTypeProviderStore();