import {action, computed, observable} from "mobx";
import {authRequest, errorMessage} from '../request';
import apiUrl from '../config/apiUrl';
import {defaultPagination} from '../config';
import {convertToPagination, filterDateTime, setDefaultDate} from '../helpers/utility';
import moment from "moment";

export class CrossTableStore {

  @observable fetching = false;
  @observable dataSource = [];
  @observable items = undefined;
  @observable pagination = defaultPagination;
  @observable order = [];
  @observable listCode = [];
  @observable total = 0;
  @observable filter = {
    ...setDefaultDate('CreatedFrom', 'CreatedTo')
  };
  @action
  clear = () => {
    this.filter = {
      ...setDefaultDate('CreatedFrom', 'CreatedTo')
    };
    this.pagination = defaultPagination;
    this.dataSource = [];
    this.order = [];
    this.listCode = [];
  }

  @computed
  get timeSelected() {
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
  changeRowKeys = (rowKey) => {
    this.listCode = rowKey;
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
  updateCross = () => {
    return authRequest
      .put(apiUrl.UPDATE_CROSS_URL, {Codes: this.listCode}).then(action((result) => {
        this.listCode = [];
        this.reload();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
      }));
  }
  @action
  fetch = (filter, pagination, order = []) => {
    let query = `
      query CustomerCrosses($Page: Int = 1, $Limit: Int = 10, $Codes: [String], $CreatedTo: DateTime${filterDateTime(filter.CreatedTo)}, $CreatedFrom: DateTime${filterDateTime(filter.CreatedFrom)}, $UserID: Int, $StatusCodes: [Int]) {
          CustomerCrosses(Pageable: {Page: $Page, Limit: $Limit}, Codes: $Codes,CreatedTo: $CreatedTo, CreatedFrom :$CreatedFrom, UserID: $UserID, StatusCodes: $StatusCodes) {
              Items {
                ID
                CancelCount
                Code
                DiscountByPolicy
                NetAmount
                QRCode
                ReturnCount               
                SuccessfulCount
                TotalCod
                TotalCosts
                TotalDiscount
                TotalOrders
                CreatedAt {
                  Pretty
                }
                StatusCode {
                  Code
                  Name
                  Color
                }
                Customer {
                  CustomerCode      
                  Email
                  Name
                  Phone
                  TookCare      
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
    };
    if (filter) {
      let {Codes, UserID, StatusCodes} = filter;
      variables.Codes = Codes || null;
      variables.UserID = UserID || null;
      variables.StatusCodes = StatusCodes || null;
    }
    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.CustomerCrosses;
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

}

export default new CrossTableStore()