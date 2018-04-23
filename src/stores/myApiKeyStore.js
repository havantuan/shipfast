import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../request';

import apiUrl from '../config/apiUrl';
import {defaultPagination} from '../config';
import {convertToPagination} from '../helpers/utility';

export class MyApiKeyStore {

  @observable fetching = false;
  @observable isFetchingRowID = -1;
  @observable dataSource = [];
  @observable currentRow = null;
  @observable isUpdating = false;
  @observable isCreating = false;
  @observable isShowModal = false;
  @observable items = undefined;
  @observable pager = undefined;
  @observable filter = {};
  @observable pagination = defaultPagination;
  @observable order = [];

  @action
  setFetching = (fetching) => {
    this.fetching = fetching
  }


  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order)
  }


  @action
  showUpdateModel = (currentRow) => {
    this.currentRow = currentRow;
    this.isShowModal = true;
  }
  @action
  delete = (id) => {
    this.isDeleting = true
    return authRequest
      .delete(apiUrl.DELETE_API_KEY_URL.replace(':id', id)).then(action((result) => {
        return this.reload();
      })).catch(action(e => {
        errorMessage(e)
      })).finally(action(() => {
        this.isDeleting = false;
      }));
  }
  @action
  active = (id, data) => {
    this.isFetchingRowID = id;
    return authRequest
      .put(data ? apiUrl.ACTIVE_API_KEY_URL.replace(':id', id) : apiUrl.DEACTIVE_API_KEY_URL.replace(':id', id)).then(action((result) => {
        return this.reload();
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isFetchingRowID = 0;
      }));
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
  update = (id, data) => {
    this.isUpdating = true
    return authRequest
      .put(apiUrl.UPDATE_API_KEY_URL.replace(':accessKey', id), data).then(action((result) => {
        this.isShowModal = false;
        return this.reload();
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isUpdating = false;
      }));
  }
  @action
  onCancelModal = () => {
    this.isShowModal = false;
    this.currentRow = undefined;
  }
  @action
  onOkModel = () => {
    this.isShowModal = false;
    this.currentRow = undefined;
    return this.reload();
  }
  @action
  showModal = () => {
    console.log("Show model");
    this.isShowModal = true;
  }
  @action
  create = (data) => {
    this.isCreating = true
    return authRequest
      .post(apiUrl.CREATE_KEY_URL, data).then(action((result) => {
        console.log('result', result)
        return result
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      }));
  }

  @action
  fetch = (filter, pagination, order = []) => {

    let query = `
        query DataSources($Page: Int = 1, $Limit: Int = 10, $Order: [Sort]) {
            Me {
            Keys(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}) {
              Items {
                AccessKey
                Description
                Name
                CreatedAt {
                 
                  Pretty
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
        }
        `;
    let {pageSize, current} = pagination;


    let variables = {
      Page: current,
      Limit: pageSize,
      Order: order || null,
    };
    this.fetching = true
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const keys = result.data.Me.Keys;
        this.dataSource = keys.Items;
        this.pager = keys.Pager;
        this.pagination = pagination;
        this.filter = filter;
        this.order = order;
        console.log(this.result);
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  }

}

export default new MyApiKeyStore()