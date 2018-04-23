import {action, observable, computed} from "mobx";
import {authRequest, errorMessage} from '../request';
import apiUrl from '../config/apiUrl';
import {defaultPagination} from '../config';
import moment from "moment";
import {convertToPagination, filterDateTime, setDefaultDate} from '../helpers/utility';

export class DiscountStore {

  @observable fetching = false;
  @observable isCreating = false;
  @observable isUpdateMode = false;
  @observable isUpdating = false;
  @observable isShowModal = false;
  @observable dataSource = [];
  @observable currentRow = undefined;
  @observable isFetchingCurrentRow = false;
  @observable isFetchingRowID = 0;
  @observable filter = {
    ...setDefaultDate('CreatedFrom', 'CreatedTo')
  };
  @observable pagination = defaultPagination;
  @observable order = [];

  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order)
  }
  @computed
  get timeSelected() {
    let {CreatedFrom, CreatedTo} = this.filter;
    if (CreatedFrom && CreatedTo) {
      return [CreatedFrom, CreatedTo];
    }
  }

  clear() {
    this.filter = {
      ...setDefaultDate('CreatedFrom', 'CreatedTo')
    };
    this.pagination = defaultPagination;
    this.dataSource = [];
    this.order = [];
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
      query DiscountTable($Page: Int = 1, $Limit: Int = 10, $Order: [Sort], $Code: String, $RequireCode:  Boolean, $DistrictID: Int, $WardID: Int, $HubID: Int, $State: EnumState, $CreatedTo: DateTime${filterDateTime(filter.CreatedTo)}, $CreatedFrom: DateTime${filterDateTime(filter.CreatedFrom)}) {
        Discounts(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, Code: $Code, RequireCode: $RequireCode, DistrictID: $DistrictID, WardID: $WardID, HubID: $HubID, State: $State, CreatedTo: $CreatedTo, CreatedFrom :$CreatedFrom) {
          Items {
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
      let {Code, RequireCode, State} = filter;
      variables.Code = Code || null;
      variables.RequireCode = RequireCode;
      variables.State = State || null;
    }
    this.fetching = true
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Discounts;
        this.dataSource = data.Items;
        this.pagination = pagination;
        this.pagination.total = data.Pager.TotalOfItems;
        this.order = order;
        return result;
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
      .put(apiUrl.UPDATE_DISCOUNT_URL.replace(':id', id), data).then(action((result) => {
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
      .post(apiUrl.CREATE_DISCOUNT_URL, data).then(action((result) => {
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

}

export default new DiscountStore()