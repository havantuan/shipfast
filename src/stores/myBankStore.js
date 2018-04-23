import {action, observable} from "mobx";
import {authRequest, errorMessage, successMessage} from '../request';
import apiUrl from '../config/apiUrl';
import {defaultPagination} from '../config';
import {convertToPagination} from '../helpers/utility';

export class MyBankStore {

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
  showUpdateModal = (currentRow) => {
    this.currentRow = currentRow;
    this.isShowModal = true;
  }

  @action
  active = (id, data) => {
    this.isFetchingRowID = id;
    return authRequest
      .put(data ? apiUrl.ACTIVE_ACCOUNT_BANK_URL.replace(':id', id).replace(':id', id) : apiUrl.DEACTIVE_ACCOUNT_BANK_URL.replace(':id', id)).then(action((result) => {
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
      .put(apiUrl.UPDATE_BANK_ACCOUNT_URL.replace(':id', id), data).then(action((result) => {
        errorMessage('Đã cập nhật tài khoản ngân hàng');
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
  onOkModal = () => {
    this.isShowModal = false;
    this.currentRow = undefined;
    return this.reload();
  }
  @action
  showModal = () => {
    this.isShowModal = true;
  }
  @action
  create = (data) => {
    this.isCreating = true
    return authRequest
      .post(apiUrl.CREATE_BANK_ACCOUNT_URL, data).then(action((result) => {
        successMessage('Tạo tài khoản ngân hàng thành công');
        this.isShowModal = false;
        return this.reload();
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      }));
  }

  @action
  fetch = (filter, pagination, order = []) => {

    let query = `
            query getMe {
                Me {                                                     
                    Banks {
                    ID
                    Code
                    AccountNumber
                    Bank {
                      ID
                      EnglishName
                      ShortenName
                      VietnameseName
                    }
                    State {
                      Code
                      Name
                    }
                    Branch
                    Owner
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
        console.log("mybank", result);
        const keys = result.data.Me.Banks;
        this.dataSource = keys;
        // this.pager = keys.Pager;
        // this.pagination = pagination;
        // this.filter = filter;
        // this.order = order;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  }

}

export default new MyBankStore()