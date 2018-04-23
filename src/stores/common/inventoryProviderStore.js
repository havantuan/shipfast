import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";
import memoize from 'memoizee';
import {remove_mark} from "../../containers/Site/Common/Helpers";

export class InventoryProviderStore {

  @observable data = [];
  @observable fetching = false;
  @observable dataSource = [];
  @observable filter = false;

  // @action
  // onChangeDefaultInventoryID = (id) => {
  //   this.defaultInventoryID = id;
  // };

  @action
  onChangeDataSource = (data) => {
    this.dataSource = data;
  };

  @action
  onSearchInventory = (query) => {
    this.dataSource = this.data.filter(val => {
      return this.filterData(val.Name, query) || this.filterData(val.Phone, query) || this.filterData(val.Address, query);
    });
  };

  filterData = (string, value) => {
    if (!string) return false;
    let option = remove_mark(string).toLowerCase();
    let input = remove_mark(value).toLowerCase();
    return option.indexOf(input) >= 0;
  };

  @action
  getDataSource = (filter) => {
    return this.fetch(filter).then(action((result) => {
      this.data = result.data.Inventories.Items;
      this.dataSource = result.data.Inventories.Items;
      this.filter = filter;
      return result;
      //------
    })).catch(action(e => {
      errorMessage(e);
      throw e;
    })).finally(action(() => {
      this.fetching = false;
    }));
  };

  @action
  reload = () => {
    this.fetching = true;
    return this.fetch(this.filter).then(action((result) => {
      this.data = result.data.Inventories.Items;
      this.dataSource = result.data.Inventories.Items;
      return result;
    })).catch(action(e => {
      errorMessage(e);
      throw e;
    })).finally(action(() => {
      this.fetching = false;
    }));
  };

  @action
  cacheFetch = memoize((filter) => {
    return this.fetch(filter)
  }, {length: 5, promise: true});

  @action
  fetch = (filter) => {
    let query = `
        query Inventories($State: EnumState, $UserID: Int) {
          Inventories(State: $State, UserID: $UserID) {
            Items {
                ID
                Name
                Phone
                Address
                FullAddress
                District {
                    FullName
                    Name
                    ID
                }
                Hub {
                  Address
                  DisplayName
                  Name
                  ID
                }
                ID
                IsDefault
                Name
                Phone
                State {
                  Value
                  Code
                  Name
                }
                Ward {
                  FullName
                  Name
                  ID
                }
            }
          }
        }
    `;

    let variables = {};
    if (filter) {
      let {State, UserID} = filter;
      variables.State = State || null;
      variables.UserID = UserID || null;
    }

    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      });
  };

  @action
  clear = () => {
    this.data = [];
    this.dataSource = [];
  };

}

export default new InventoryProviderStore();