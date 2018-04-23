import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../request';
import apiUrl from '../config/apiUrl';
import {defaultPagination} from '../config';
import {convertToPagination, convertToSorter, getCurrentSite} from '../helpers/utility';
import staffStore from './staffStore';

export class HubStore {

  @observable fetching = false;
  @observable isCreating = false;
  @observable isUpdateMode = false;
  @observable isUpdating = false;
  @observable dataSource = [];
  @observable currentRow = undefined;
  @observable isFetchingCurrentRow = false;
  @observable isFetchingRowID = 0;
  @observable items = undefined;
  @observable pager = {
    TotalOfItems: 0,
  };
  @observable filter = {};
  @observable pagination = defaultPagination;
  @observable order = [];
  @observable selectedRowKeys = [];

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
        query Hubs($Page: Int = 1, $Limit: Int = 10, $Order: [Sort], $CityID: Int, $State: EnumState, $DistrictID: Int, $Accessibility: EnumAccessibility) {
            Hubs(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, CityID: $CityID, State: $State, DistrictID: $DistrictID, Accessibility: $Accessibility) {
                Items {
                  Accessibility {
                    Code
                    Name
                    Value
                  }
                    ID
                    Address
                    DisplayName
                    Name
                    Code
                    City {
                        Name
                    }
                    District {
                        Name
                    }
                    State {
                        Code
                        Name
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
      let {CityID, DistrictID, State} = filter;
      variables.CityID = CityID || null;
      variables.DistrictID = DistrictID || null;
      variables.State = State || null;
      variables.Accessibility = getCurrentSite() === 'KH' ? 'Public' : null;
    }

    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Hubs;
        this.pager = data.Pager;
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
    this.isFetchingRowID = id;
    if (checked === true) {
      this.active(id);
    }
    else {
      this.deactive(id);
    }
  };

  @action
  active = (id) => {
    this.isFetchingCurrentRow = true;
    return authRequest
      .put(apiUrl.ACTIVE_HUB_URL.replace(':id', id)).then(action((result) => {
        this.reload();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isFetchingCurrentRow = false;
      }));
  };

  @action
  deactive = (id) => {
    this.isFetchingCurrentRow = true;
    return authRequest
      .put(apiUrl.DEACTIVE_HUB_URL.replace(':id', id)).then(action((result) => {
        this.reload();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isFetchingCurrentRow = false;
      }));
  };

  @action
  update = (id, data) => {
    this.isUpdating = true;
    return authRequest
      .put(apiUrl.UPDATE_HUB_URL.replace(':id', id), data).then(action((result) => {
        this.onCancelModal();
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
      .post(apiUrl.CREATE_HUB_URL, data).then(action((result) => {
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
  fetchByID = (id) => {
    let query = `
        query DiscountByID($id: Int) {
          Discount (ID: $id) {
            Code
            Discount
            DiscountPercent
            End {
              Deadline
              ISO
              Pretty
            }
            ID
            Limit
            LimitPerUser
            Name
            RequireCode
            Start {
              Deadline
              ISO
              Pretty
            }
            State {
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
        const data = result.data.Discount;
        this.currentRow = data;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isFetchingCurrentRow = false;
      }));
  };

  @action
  onSelectedChange = (rowKeys) => {
    this.selectedRowKeys = rowKeys;
  };

  @action
  grantHubByStaffID = (id) => {
    this.fetching = true;
    let IDs = this.selectedRowKeys;
    return authRequest
      .put(apiUrl.GRANT_HUB_URL.replace(':id', id), {IDs}).then(action((result) => {
        staffStore.closeModal();
        staffStore.reload();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

}

export default new HubStore()