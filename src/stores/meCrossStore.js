import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../request';

import apiUrl from '../config/apiUrl';
import {defaultPagination} from '../config';
import {convertToPagination, filterDateTime} from '../helpers/utility';

export class MeCrossStore {

  @observable fetching = false;
  @observable dataCross = [];
  @observable filter = {};
  @observable pagination = defaultPagination;
  @observable order = [];
  @action
  clear = () => {
    this.filter = {};
    this.pagination = defaultPagination;
    this.dataCross = [];
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
  fetch = (filter, pagination, order = []) => {

    let query = `
        query DataSources($Page: Int = 1, $Limit: Int = 10, $Order: [Sort], $Codes: [String], $StatusCodes: [Int], $CreatedTo: DateTime${filterDateTime(filter.CreatedTo)}, $CreatedFrom: DateTime${filterDateTime(filter.CreatedFrom)}) {
          Me {
            Crosses (Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, Codes: $Codes, StatusCodes: $StatusCodes, CreatedTo: $CreatedTo, CreatedFrom: $CreatedFrom) {
              Items {
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
        }
        `;
    let {pageSize, current} = pagination;

    let variables = {
      Page: current,
      Limit: pageSize,
      Order: order || null,
    };
    if (filter) {
      let {StatusCodes, Codes} = filter;
      variables.Codes = Codes || null;
      variables.StatusCodes = StatusCodes || null;
    }
    this.fetching = true
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Me.Crosses;
        this.dataCross = data.Items;
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

export default new MeCrossStore()