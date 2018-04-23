import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../request';
import apiUrl from '../config/apiUrl';
import {convertToPagination, filterDateTime} from "../helpers/utility";
import {defaultPagination} from "../config";

export class CustomerDebtStore {

  @observable fetching = false;
  @observable dataSource = [];
  @observable isUpdating = false;
  @observable filter = {};
  @observable pagination = defaultPagination;
  @observable order = [];
  @observable dataCross = [];
  @action
  clear = () => {
    this.filter = {};
    this.pagination = defaultPagination;
    this.dataSource = [];
    this.order = [];
    this.dataCross = [];
  }
  @action
  handleTableChange = (id, pagination, filters, sort) => {
    this.pagination = convertToPagination(pagination, this.pagination);
    this.reload(id);
  };
  @action
  onFilter = (id, filter) => {
    this.filter = filter;
    this.pagination = defaultPagination;
    return this.reload(id);
  };
  @action
  reload = (id) => {
    this.fetchCrossByID(id, this.filter, this.pagination, this.order);
  }
  @action
  fetchCrossByID = (id, filter, pagination, order = []) => {

    let query = `
        query CustomerCrosses($Page: Int = 1, $Limit: Int = 10, $Order: [Sort], $id: Int, $Codes: [String], $StatusCodes: [Int], $CreatedTo: DateTime${filterDateTime(filter.CreatedTo)}, $CreatedFrom: DateTime${filterDateTime(filter.CreatedFrom)}) {
          CustomerCrosses (Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order} ,UserID: $id, Codes: $Codes, StatusCodes: $StatusCodes, CreatedTo: $CreatedTo, CreatedFrom: $CreatedFrom) {
          Items{
            CancelCount
            Code
            ID
            DiscountByPolicy
            NetAmount
            QRCode
            ReturnCount
            StatusCode {
              Name
              Color
              Code
            }
            SuccessfulCount
            TotalCod
            TotalCosts
            TotalDiscount
            TotalOrders         
         
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
      id,

      Page: current,
      Limit: pageSize,
      Order: order || null,
    };
    if (filter) {
      let {StatusCodes, Codes} = filter;
      variables.Codes = Codes || null;
      variables.StatusCodes = StatusCodes || null;
    }
    this.fetching = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        this.dataCross = result.data.CustomerCrosses.Items;
        this.pagination.total = result.data.CustomerCrosses.Pager.TotalOfItems;
        this.pagination = pagination;
        this.filter = filter;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));

  }
  @action
  fetch = (id, date) => {
    let query = `
         query DataSource($id: Int!, $Date: DateTime${filterDateTime(date)}) {
          CustomerDebt (UserID: $id, Date: $Date) {
            Success {
            Cod
            Cost
            Count
            Discount
            NetAmount
          }
          Return {
            Cod
            Cost
            Count
            Discount
            NetAmount
            ReturningCost
          }
          Performing {
            Cod
            Cost
            Count
            Discount
            NetAmount
            ReturningCost
          }
          CanceledCount
          NetAmount
          }
        }
        `;

    let variables = {
      id: id
    };
    this.fetching = true
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const keys = result.data.CustomerDebt;
        this.dataSource = keys;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  }
}

export default new CustomerDebtStore()