import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";
import memoize from 'memoizee';

export class DistrictProviderStore {

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
  clearDataSource = () => {
    this.values = [];
    this.dataSource = [];
  };
  @action
  clearValues = () => {
    this.values = [];
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
    this.load = true;
    this.indeterminate = true;
    this.checkAll = false;
    this.values = [];
  };

  @action
  getDataSource = (cityID) => {
    this.cacheFetch(cityID).then(action((result) => {
      this.dataSource = result.data.Districts;
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
        query Districts ($cityID: Int) {
          Districts (CityID: $cityID) {
            ID
            Name
            Code
            FullName
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

export default new DistrictProviderStore();