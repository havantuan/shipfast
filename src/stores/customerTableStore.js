import {action, computed, observable} from "mobx";
import {authRequest, errorMessage} from '../request';
import apiUrl from '../config/apiUrl';
import {defaultPagination} from '../config';
import {convertToPagination, filterDateTime} from '../helpers/utility';
import {successMessage} from "../request/utils";
import moment from "moment";

export class CustomerTableStore {
  @observable fetching = false;
  @observable isCreating = false;
  @observable isUpdateMode = false;
  @observable isUpdating = false;
  @observable isShowModal = false;
  @observable dataSource = [];
  @observable currentRow = undefined;
  @observable CityID = 18;
  @observable DistrictID = null;
  @observable CityIDForm = 18;
  @observable DistrictIDForm = null;
  @observable isFetchingCurrentRow = false;
  @observable isFetchingRowID = 0;
  @observable items = undefined;
  @observable filter = {};
  @observable pagination = defaultPagination;
  @observable order = [];
  @observable expandSearch = false;
  @observable isShowInventoryModal = false;

  @action
  showInventoryModal = () => {
    this.isShowInventoryModal = true;
  };

  @action
  cancelInventoryModal = () => {
    this.isShowInventoryModal = false;
  };

  @action
  clear = () => {
    this.filter = {};
    this.pagination = defaultPagination;
    this.dataSource = [];
    this.order = [];
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
  setCityID = (CityID) => {
    this.CityID = CityID;
    this.DistrictID = null;
  }
  @action
  setDistrictID = (DistrictID) => {
    this.DistrictID = DistrictID;
  }

  @action
  setCityIDForm = (CityID) => {
    this.CityIDForm = CityID;
    this.DistrictIDForm = null;
  }
  @action
  setDistrictIDForm = (DistrictID) => {
    this.DistrictIDForm = DistrictID;
  }

  @action
  fetch = (filter, pagination, order = []) => {
    let query = `
        query Customers($Page: Int = 1, $Limit: Int = 10, $Order: [Sort], $Query: String, $CityID: Int, $DistrictID: Int, $WardID: Int, $State: EnumState, $CreatedTo: DateTime${filterDateTime(filter.CreatedTo)}, $CreatedFrom: DateTime${filterDateTime(filter.CreatedFrom)}, $TookCare: Boolean, $UserType: EnumUserType, $KHType: EnumKHType) {
            Customers(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, Query: $Query, CityID: $CityID, DistrictID: $DistrictID, WardID: $WardID, State: $State, CreatedTo: $CreatedTo, CreatedFrom :$CreatedFrom, TookCare: $TookCare, UserType: $UserType, KHType: $KHType) {
                Pager {
                  Limit
                  NumberOfPages
                  Page
                  TotalOfItems
                }
                Items {
                  ID
                  CustomerCode
                  CreatedAt {
                    Deadline
                    Pretty
                  }
                  BankAccounts{
                  Owner
                  Branch
                  AccountNumber
                  Bank {
                    EnglishName
                    ShortenName
                    VietnameseName
                  }
                }
                  Email
                  Name
                  Phone
                  State {
                    Code
                    Name
                    Value
                  }
                  Type {
                    Code
                    Name
                  }
                  TookCare
                  KHType {
                      Code
                      Name
                      Value
                  }
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
      let {Query, CityID, DistrictID, WardID, State, TookCare, UserType, KHType} = filter;
      variables.Query = Query || null;
      variables.CityID = CityID || null;
      variables.DistrictID = DistrictID || null;
      variables.WardID = WardID || null;
      variables.State = State || null;
      variables.TookCare = TookCare;
      variables.UserType = UserType || null;
      variables.KHType = KHType || null;
    }
    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Customers;
        this.dataSource = data.Items;
        this.pagination.total = data.Pager.TotalOfItems;

        this.pagination = pagination;
        this.order = order;
        this.filter = filter;
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
      .put(apiUrl.UPDATE_CUSTOMER_URL.replace(':id', id), data).then(action((result) => {
        successMessage('Sửa khách hàng thành công!')
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
      .post(apiUrl.CREATE_CUSTOMER_URL, data).then(action((result) => {
        successMessage('Thêm khách hàng thành công!')
        this.onCancelModal();
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
  active = (id, data) => {
    this.isFetchingRowID = id;
    return authRequest
      .put(data ? apiUrl.ACTIVE_CUSTOMER_URL.replace(':id', id) : apiUrl.DEACTIVE_CUSTOMER_URL.replace(':id', id)).then(action((result) => {
        return this.reload();
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isFetchingRowID = 0;
      }));
  }

  @action
  fetchByID = (id) => {
    let query = `
        query DataSources($id: Int, $Query: String) {
            Customer(ID: $id, Query: $Query) {
              CustomerCode
              Email
              Name
              Phone
              ID
              TookCare
              KHType {
                  Code
                  Name
                  Value
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
        this.currentRow = result.data.Customer;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isFetchingCurrentRow = false;
      }));
  }
  @action
  queryCustomer = (filter) => {
    let query = `
        query Customer($id: Int, $Query: String) {
            Customer(ID: $id, Query: $Query) {
              CustomerCode
              Email
              Name
              Phone
              ID
              TookCare
              KHType {
                  Code
                  Name
                  Value
              }                      
            }
        }
        `;

    let variables = {};
    if (filter) {
      let {Query} = filter;
      variables.Query = Query || null;
    }
    this.isFetchingCurrentRow = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        this.currentRow = result.data.Customer;
        return result;
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
    this.setCityIDForm(18);
    this.currentRow = undefined;
    this.isShowModal = true;
    this.isUpdateMode = false;

  }
  @action
  showUpdateModal = (id) => {
    this.isShowModal = true;
    this.isUpdateMode = true;
    this.fetchByID(id);
  }

  @computed
  get createdDateSelected() {
    let {CreatedFrom, CreatedTo} = this.filter;
    if (CreatedFrom && CreatedTo) {
      return [CreatedFrom, CreatedTo];
    }
  }

  @action
  onToggleExpandSearch = () => {
    this.expandSearch = !this.expandSearch;
  };

}

export default new CustomerTableStore()