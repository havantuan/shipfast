import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../request';

import apiUrl from '../config/apiUrl';
import {defaultPagination} from '../config';
import {convertToPagination} from '../helpers/utility';

export class NotificationStore {

  @observable fetching = false;
  @observable isCreating = false;
  @observable isUpdateMode = false;
  @observable isUpdating = false;
  @observable isShowModal = false;
  @observable dataSource = [];
  @observable currentRow = undefined;
  @observable isFetchingCurrentRow = false;
  @observable isFetchingRowID = 0;
  @observable filter = {};
  @observable pagination = defaultPagination;
  @observable order = [];

  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order)
  }

  clear() {
    this.filter = {};
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
        query DataSources($Page: Int = 1, $Limit: Int = 10, $Order: [Sort],$Query: String, $ID: Int, $AppType:  EnumAppType) {
            Notifications(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, Query: $Query, ID: $ID, AppType: $AppType) {
                Items {                                  
                    Body
                    JsonContent
                    Title
                    ID      
                  CreatedAt {
                    Pretty
                  }
                  UpdatedAt {
                    Pretty
                  }
                    AppType {
                    Code
                    Name
                    Value
                  }
                      TotalPushSuccess
                    TotalPushTokens
                    TotalTokens
                        PushedAt {   
                      Pretty
                    }
                Date {
                  Deadline
                  ISO
                  Pretty
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
      let {Query, ID, AppType} = filter;
      variables.Query = Query || null;
      variables.AppType = AppType || null;
      variables.ID = ID || null;
    }
    this.fetching = true
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Notifications;
        this.dataSource = data.Items;
        this.pagination.total = data.Pager.TotalOfItems;

        this.pagination = pagination;
        this.order = order;
        this.filter = filter;
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
      .post(apiUrl.CREATE_NOTIFICATION_URL, data).then(action((result) => {
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
          Notification (ID: $id) {                                  
            Body
            JsonContent
            Title
            ID      
            CreatedAt {
              Pretty
            }
            UpdatedAt {
              Pretty
            }
            AppType {
              Code
              Name
              Value
            }
            TotalPushSuccess
            TotalPushTokens
            TotalTokens
            PushedAt {   
              Pretty
            }
            Date {
              Deadline
              ISO
              Pretty
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

export default new NotificationStore()