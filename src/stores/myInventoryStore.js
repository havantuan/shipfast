import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../request';
import apiUrl from '../config/apiUrl';
import {defaultPagination} from '../config';
import {convertToPagination} from '../helpers/utility';
import meStore from './meStore';

export class MyInventoryStore {

  @observable fetching = false;
  @observable isCreating = false;
  @observable isUpdateMode = false;
  @observable isUpdating = false;
  @observable isShowModal = false;
  @observable CityID = 18;
  @observable DistrictID = null;
  @observable dataSource = [];
  @observable currentRow = undefined;
  @observable isFetchingCurrentRow = false;
  @observable isFetchingRowID = 0;
  @observable items = undefined;
  @observable filter = {};
  @observable pagination = defaultPagination;
  @observable order = [];
  @action
  clear = () => {
    this.filter = {};
    this.pagination = defaultPagination;
    this.order = [];
    this.dataSource = [];
  }
  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order)
  }

  @action
  handleTableChange = (pagination, filters, sort) => {
    this.pagination = convertToPagination(pagination, this.pagination);
    this.reload();
  };
  @action
  onFilter = (filter) => {
    this.filter = filter;
    this.pagination = defaultPagination;
    return this.reload();
  };

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
      variables.UserID = UserID || meStore.current.UserID || null;
      variables.HubID = hubID || null;
    }
    this.fetching = true
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Inventories;
        this.pager = data.Pager;
        this.dataSource = data.Items;
        this.pagination = pagination;
        this.pagination.total = this.pager.TotalOfItems
        this.order = order;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  }

  @action
  update = (id, data) => {
    this.isUpdating = true
    return authRequest
      .put(apiUrl.UPDATE_INVENTORY_URL.replace(':id', id), data).then(action((result) => {
        this.onCancelModal();
        this.reload();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isUpdating = false;
      }));
  }
  @action
  create = (data) => {
    this.isCreating = true;
    return authRequest
      .post(apiUrl.CREATE_INVENTORY_URL, data).then(action((result) => {
        this.onCancelModal();
        this.reload();
        return result
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isCreating = false;
      }));
  }

  @action
  fetchByID = (id) => {
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
    this.isFetchingCurrentRow = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Inventory;
        this.currentRow = data;
        this.DistrictID = this.currentRow.District ? this.currentRow.District.ID : null;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isFetchingCurrentRow = false;
      }));
  }


  @action
  onCancelModal = () => {
    this.isShowModal = false;
  }
  @action
  onSubmitFormModal = (formData) => {
    if (this.isUpdateMode) {
      return this.update(this.currentRow.ID, formData);
    } else {
      return this.create(formData);
    }
  }
  @action
  showCreateModal = () => {
    console.log('showCreateModal')
    this.currentRow = undefined;
    this.setCityID(18);
    this.isShowModal = true;
    this.isUpdateMode = false;

  }

  @action
  setCityID = (CityID) => {
    this.CityID = CityID;
    this.DistrictID = null;
  }
  @action
  setDistrictID = (DistrictID) => {
    this.DistrictID = DistrictID;
  }
  @action
  showUpdateModal = (id) => {
    this.isShowModal = true;
    this.isUpdateMode = true;
    this.fetchByID(id);
  }

}

export default new MyInventoryStore()