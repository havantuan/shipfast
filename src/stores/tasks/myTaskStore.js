import {action, computed, observable} from "mobx";
import {authRequest, errorMessage} from '../../request';
import apiUrl from '../../config/apiUrl';
import {defaultPagination} from '../../config';
import {convertToPagination, filterDateTime, setDefaultDate} from '../../helpers/utility';
import meStore from '../meStore';
import moment from "moment";

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
  @observable filter = {
    ...setDefaultDate('CreatedFrom', 'CreatedTo')
  };
  @observable pagination = defaultPagination;
  @observable order = [];
  @observable expandSearch = false;

  @computed
  get createdDateSelected() {
    let {CreatedFrom, CreatedTo} = this.filter;
    if (CreatedFrom && CreatedTo) {
      return [CreatedFrom, CreatedTo];
    }
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
      query MyTasks($Page: Int = 1, $Limit: Int = 10, $Order: [Sort], $WardID: Int, $StaffID: Int, $Type: EnumTaskType, $ExpiredTo: DateTime${filterDateTime(filter.ExpiredTo)}, $ExpiredFrom: DateTime${filterDateTime(filter.ExpiredFrom)}, $SucceedFrom: DateTime${filterDateTime(filter.SucceedFrom)}, $SucceedTo: DateTime${filterDateTime(filter.SucceedTo)}, $CreatedTo: DateTime${filterDateTime(filter.CreatedTo)}, $CreatedFrom: DateTime${filterDateTime(filter.CreatedFrom)}, $Query: String, $ReceiverQuery: String, $CityID: Int, $HubID: Int, $DistrictID: Int, $OrderCodeOrTaskCode: String, $StatusCodes: [Int], $HubIDs: [Int]) {
          MyTasks(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, WardID: $WardID, StaffID: $StaffID, ExpiredFrom: $ExpiredFrom, SucceedFrom: $SucceedFrom, SucceedTo: $SucceedTo, Type: $Type, CreatedFrom: $CreatedFrom, CreatedTo: $CreatedTo, Query: $Query, ReceiverQuery: $ReceiverQuery, CityID: $CityID, HubID: $HubID, DistrictID: $DistrictID, ExpiredTo: $ExpiredTo, OrderCodeOrTaskCode: $OrderCodeOrTaskCode, StatusCodes: $StatusCodes, HubIDs: $HubIDs) {
              Items {
                Address
                Code
                CreatedAt {
                  Pretty
                }
                AssignedAt {
                  Pretty
                }    
                AccountReceivable            
                CustomerName
                CustomerPhone
                ExpiredAt {
                  Deadline
                }
                Hub {
                  Code
                  Name
                  DisplayName
                }
                StatusCode {
                  Name
                  Code
                  Color
                }
                TotalWeight
                Type {
                  Code
                  Name
                }
                Entries {
                  IsClosed
                  StatusCode {
                    Name
                    Code
                    Color
                  }
                  Order {
                    CurrentTask {
                      Code
                    }
                    Code
                    CreatedAt {
                      Pretty
                    }
                    Name
                    Sender {
                      AccountReceivable
                      Address
                      Email
                      Name
                      Phone
                    }
                    Receiver {
                      AccountReceivable
                      Address
                      Email
                      Name
                      Phone
                    }
                    ServiceType {
                      Name
                    }
                    StatusCode {
                      Code
                      Color
                      Name
                    }
                    NextTaskCodes {
                      Code
                      Name
                    }
                    UpdatedAt {
                      Pretty
                    }
                  }
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
      HubID: meStore.getCurrentHub(),
      HubIDs: meStore.getCurrentHub() ? null : meStore.getHubIDs()
    };
    if (filter) {
      let {OrderCodeOrTaskCode, CityID, Query, ReceiverQuery, Type, DistrictID, StatusCodes, WardID} = filter;
      variables.OrderCodeOrTaskCode = OrderCodeOrTaskCode || null;
      variables.CityID = CityID || null;
      variables.Query = Query || null;
      variables.ReceiverQuery = ReceiverQuery || null;
      variables.Type = Type || null;
      variables.DistrictID = DistrictID || null;
      variables.StatusCodes = StatusCodes || null;
      variables.WardID = WardID || null;
    }
    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.MyTasks;
        this.dataSource = data.Items;
        this.pagination = pagination;
        this.pagination.total = data.Pager.TotalOfItems;
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
      .put(apiUrl.UPDATE_ORDERS_STATUSES_IN_TASK_URL.replace(":code", id), data).then(action((result) => {
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
  confirm = (id, data) => {
    this.isUpdating = true
    return authRequest
      .put(apiUrl.CONFIRM_TASK_URL.replace(":code", id), data).then(action((result) => {
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
  cancel = (id, data) => {
    this.isUpdating = true
    return authRequest
      .put(apiUrl.CANCEL_TASK_URL.replace(":code", id), data).then(action((result) => {
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

  @action
  onToggleExpandSearch = () => {
    this.expandSearch = !this.expandSearch;
  };

}

export default new MyInventoryStore()