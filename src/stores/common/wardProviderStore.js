import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";
import memoize from 'memoizee';
import {checkExist} from "../../helpers/utility";

export class WardProviderStore {

  @observable dataSource = [];
  @observable fetching = false;
  @observable values = [];
  @observable load = true;
  @observable indeterminate = true;
  @observable checkAll = false;

  @action
  loadDisable = (load = false) => {
    this.load = load;
  };

  @action
  onChangeValues = (values) => {
    this.values = values;
  };

  @action
  onChange = (values) => {
    this.values = values;
    this.indeterminate = !!values.length && (values.length < this.dataSource.length);
    this.checkAll = values.length === this.dataSource.length;
  };

  @action
  onCheckAllChange = (checked) => {
    let tmp = this.dataSource.map(val => `${val.ID}`);
    this.values = checked ? tmp : [];
    this.indeterminate = false;
    this.checkAll = checked;
  };

  @action
  clear = () => {
    this.checkAll = false;
    this.load = true;
    this.values = [];
    this.indeterminate = true;
  };

  @action
  getDataSource = (districtID, districtIDs = null) => {
    if (districtIDs && districtIDs.length === 0) {
      this.dataSource = [];
      return;
    }
    this.cacheFetch(districtID, districtIDs).then(action((result) => {
      let data = result.data.Wards;
      this.dataSource = data;
      let tmp = data.map(val => `${val.ID}`);
      this.values = this.values.filter(val => checkExist(tmp, val));
    })).catch(action(e => {
      this.dataSource = [];
      this.values = [];
      errorMessage(e);
    })).finally(action(() => {
      this.fetching = false;
    }));
  };

  @action
  cacheFetch = memoize((districtID, districtIDs = null) => {
    let query = `
        query Wards ($districtID: Int, $districtIDs: [Int]) {
          Wards (DistrictID: $districtID, DistrictIDs: $districtIDs) {
            ID
            Name
            Code
          }
        }
    `;
    let variables = {districtID, districtIDs};
    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      });
  }, {length: 5, promise: true})

}

export default new WardProviderStore();