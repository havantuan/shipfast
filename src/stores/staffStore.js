import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../request';
import apiUrl from '../config/apiUrl';
import {defaultPagination} from '../config';
import {convertToPagination, convertToSorter} from '../helpers/utility';
import roleStore from "./roleStore";
import hubStore from "./hubStore";
import ObjectPath from 'object-path';
import routerStore from "./routerStore";
import routerSystemConfig from "../config/routerSystem";

export class StaffStore {

  @observable fetching = false;
  @observable isCreating = false;
  @observable isUpdateMode = false;
  @observable isUpdating = false;
  @observable isShowRoleModal = false;
  @observable isShowHubModal = false;
  @observable dataSource = [];
  @observable currentRow = undefined;
  @observable isActiveFetching = false;
  @observable isActiveID = 0;
  @observable isFetchingCurrentRow = false;
  @observable isFetchingRowID = 0;
  @observable filter = {};
  @observable pagination = defaultPagination;
  @observable order = [];
  @observable stepIndex = 0;
  @observable temporaryData = {};
  @observable fetchingSingleData = false;
  @observable singleData = {};

  clear() {
    this.filter = {};
    this.pagination = defaultPagination;
    this.dataSource = [];
    this.order = [];
  }

  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order)
  };

  @action
  handleTableChange = (pagination, filters, sort) => {
    this.pagination = convertToPagination(pagination, this.pagination);
    this.order = convertToSorter(sort);
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
    query StaffsFilter($Page: Int = 1, $Limit: Int = 10, $Order: [Sort], $query: String, $hubID: Int, $state: EnumState, $roleID: Int) {
      Staffs(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, Query: $query, HubID: $hubID, State: $state, RoleID: $roleID) {
        Items {
          Email
          ID
          Code
          Name
          Phone
          Hubs {
            ID
            Address
            DisplayName
            Name
            Code
          }
          Roles {
            Name
            ID
            Code
          }
          State {
            Code
            Name
            Value
          }
        }
        Pager{
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
      let {query: querySearch, hubID, roleID, state} = filter;
      variables.query = querySearch || null;
      variables.hubID = hubID || null;
      variables.roleID = roleID || null;
      variables.state = state || null;
    }

    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Staffs;
        this.pagination.total = data.Pager.TotalOfItems;
        this.dataSource = data.Items;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  onActiveChange = (id, checked) => {
    this.isActiveID = id;
    if (checked === true) {
      this.active(id);
    }
    else {
      this.deactive(id);
    }
  };

  @action
  active = (id) => {
    this.isActiveFetching = true;
    return authRequest
      .put(apiUrl.ACTIVE_STAFF_URL.replace(':id', id)).then(action((result) => {
        this.reload();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isActiveFetching = false;
      }));
  };

  @action
  deactive = (id) => {
    this.isActiveFetching = true;
    return authRequest
      .put(apiUrl.DEACTIVE_STAFF_URL.replace(':id', id)).then(action((result) => {
        this.reload();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isActiveFetching = false;
      }));
  };

  @action
  update = (id, data) => {
    this.isUpdating = true;
    return authRequest
      .put(apiUrl.UPDATE_STAFF_URL.replace(':id', id), data).then(action((result) => {
        routerStore.push(routerSystemConfig.staff);
        this.reload();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isUpdating = false;
      }));
  };

  @action
  create = (data) => {
    this.isCreating = true;
    return authRequest
      .post(apiUrl.CREATE_STAFF_URL, data).then(action((result) => {
        routerStore.push(routerSystemConfig.staff);
        this.reload();
        return result
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isCreating = false;
      }));
  };

  @action
  fetchByID = (id) => {
    let query = `
        query Staff($id: Int) {
          Staff (ID: $id) {
            Email
            Address
            Hubs {
              Address
              Code
              City {
                Code
                ID
                Name
              }
              DisplayName
              ID
              Name
            }
            ID
            IDCard {
              DateOfIssue
              IDNumber
              PlaceOfIssue
            }
            Name
            Phone
            StudentCard {
              DateOfIssue
              IDNumber
              PlaceOfIssue
            }
            Vehicle {
              NumberPlate
              Type {
                Code
                Name
                Value
              }
              Weight
            }
          }
        }
    `;
    let variables = {id};

    this.fetchingSingleData = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Staff;
        this.singleData = data;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetchingSingleData = false;
      }));
  };

  @action
  showRoleModal = (currentData) => {
    this.isShowRoleModal = true;
    this.isFetchingRowID = currentData ? currentData.ID : null;
    this.currentRow = currentData;
    let roles = ObjectPath.get(currentData, 'Roles', []);
    let roleIDs = roles.map(val => val.ID);
    roleStore.onSelectedChange(roleIDs);
  };

  @action
  showHubModal = (currentData) => {
    this.isShowHubModal = true;
    this.isFetchingRowID = currentData ? currentData.ID : null;
    this.currentRow = currentData;
    let hubs = ObjectPath.get(currentData, 'Hubs', []);
    let hubIDs = hubs.map(val => val.ID);
    hubStore.onSelectedChange(hubIDs);
  };

  @action
  closeModal = () => {
    this.isShowRoleModal = false;
    this.isShowHubModal = false;
    this.currentRow = {};
  };

  @action
  setUpdateMode = (isUpdate = true) => {
    this.isUpdateMode = isUpdate;
  };

  @action
  onNextStep = () => {
    this.stepIndex = this.stepIndex + 1;
  };

  @action
  onPrevStep = () => {
    this.stepIndex = this.stepIndex > 1 ? this.stepIndex - 1 : 0;
  };

  @action
  onTemporaryDataChange = (data = {}) => {
    this.temporaryData = {
      ...this.temporaryData,
      ...data
    };
  };

  @action
  clearData = () => {
    if (this.isUpdateMode) {
      this.singleData = {};
      this.temporaryData = {};
      this.stepIndex = 0;
    }
  };

}

export default new StaffStore()