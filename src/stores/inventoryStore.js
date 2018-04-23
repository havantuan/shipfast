import {action, observable} from 'mobx';
import {defaultPagination} from "../config";
import {authRequest, errorMessage, successMessage} from '../request';
import apiUrl from "../config/apiUrl";
import meStore from './meStore';
import {convertToPagination, convertToSorter} from "../helpers/utility";

export class InventoryStore {

  @observable pagination = defaultPagination;
  @observable filter = {};
  @observable sorter = [];
  @observable fetching = false;
  @observable dataSource = [];
  @observable pager = undefined;
  @observable cityID = null;
  @observable DistrictID = null;
  @observable isBlocking = false;

  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order);
  };
  @action
  getDataSource = (id) => {
    let query = `
        query DataSource($id: Int) {
          Inventory (ID: $id) {
              Address
              City {
                ID
                Name
              }
              Code
              District {
                ID
                FullName
                Name
                City {
                    ID
                }
              }
              Hub {
                ID
                Address
                DisplayName
                Name
              }
              ID
              IsDefault
              Name
              Phone
              State {
                Code
                Name
                Value
              }
              Ward {
                ID
                FullName
                Name
              }
          }
        }
        `;

    let variables = {
      id
    };
    this.fetching = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const keys = result.data.Inventories;
        this.dataSource = keys;
      })).catch(action(e => {
        errorMessage(e);
      })).finally(action(() => {
        this.fetching = false;
      }));
  }
  @action
  onCityIDChange = (cityID) => {
    this.cityID = cityID;
  };

  @action
  handleTableChange = (pagination, filters, sort) => {
    this.pagination = convertToPagination(pagination, this.pagination);
    this.sorter = convertToSorter(sort);
    this.reload();
  };

  @action
  onFilter = (filter) => {
    this.filter = filter;
    this.pagination = defaultPagination;
    this.reload();
  };
  @action
  create = (data) => {
    this.isCreating = true
    return authRequest
      .post(apiUrl.CREATE_INVENTORY_URL, data).then(action((result) => {
        successMessage('Tạo kho hàng thành công');
        return result
      })).catch(action(e => {
        errorMessage(e);
      }));
  }
  @action
  update = (id, data) => {
    this.isUpdating = true
    return authRequest
      .put(apiUrl.UPDATE_INVENTORY_URL.replace(':id', id), data).then(action((result) => {
        this.isShowModel = false;
        return this.reload();
      })).catch(action(e => {
        errorMessage(e);
      })).finally(action(() => {
        this.isUpdating = false;
      }));
  }
  @action
  fetch = (filter, pagination, order = []) => {
    let query = `
        query DataSources($Page: Int = 1, $Limit: Int = 10, $Order: [Sort], $Query: String, $State: EnumState, $UserID: Int, $HubID: Int) {
            Inventories(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, Query: $Query, State: $State, UserID: $UserID, HubID: $HubID) {
                Items {
                  Address
                  FullAddress
                  City {
                    Name
                  }
                  Code
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
                Pager {
                    Limit
                    NumberOfPages
                    Page
                    TotalOfItems
                }
            }
        }
        `;
    let {pageSize, current} = pagination;

    let variables = {
      Page: current,
      Limit: pageSize,
      Order: order || null,
    };
    if (filter) {
      let {query, State, hubID, UserID} = filter;
      variables.Query = query || null;
      variables.State = State || null;
      variables.UserID = UserID || meStore.getUserID() || null;
      variables.HubID = hubID || null;
    }

    this.fetching = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const keys = result.data.Inventories;
        this.dataSource = keys.Items;
        this.pager = keys.Pager;
        this.pagination = {
          ...pagination,
          total: keys.Pager ? keys.Pager.TotalOfItems : 0
        };
        this.filter = filter;
        this.order = order;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  }

  @action
  clear = () => {
    this.dataSource = [];
    this.pagination = defaultPagination;
    this.filter = {};
  };
}

export default new InventoryStore();