import {action, computed, observable} from "mobx";
import {authRequest, errorMessage} from '../../request';
import apiUrl from '../../config/apiUrl';
import {defaultPaginationPrint} from '../../config';
import {convertToPagination, convertToSorter, filterDateTime, setDefaultDate} from '../../helpers/utility';
import meStore from '../meStore';
import moment from "moment";

export class PrintTasksStore {

  @observable fetching = false;
  @observable dataSource = [];
  @observable filter = {
    ...setDefaultDate('CreatedFrom', 'CreatedTo')
  };
  @observable pagination = defaultPaginationPrint;
  @observable order = [];
  @observable selectedRowKeys = [];
  @observable printData = [];
  @observable fetchingPrint = false;
  @observable expandSearch = false;

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

  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order);
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
    this.pagination = defaultPaginationPrint;
    return this.reload();
  };

  @action
  fetch = (filter, pagination, order = []) => {
    let query = `
      query DataSource($Page: Int = 1, $Limit: Int = 10, $Order: [Sort], $Code: String, $SenderQuery: String, $ReceiverQuery: String, $StaffID: Int, $StatusCode: Int, $Type: EnumTaskType, $CreatedTo: DateTime${filterDateTime(filter.CreatedTo)}, $CreatedFrom: DateTime${filterDateTime(filter.CreatedFrom)}, $ExpiredTo: DateTime${filterDateTime(filter.ExpiredTo)}, $ExpiredFrom: DateTime${filterDateTime(filter.ExpiredFrom)}, $StatusCodes: [Int], $HubID: Int, $HubIDs: [Int]) {
        Tasks(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, SenderQuery: $SenderQuery, ReceiverQuery: $ReceiverQuery, Code: $Code, StaffID: $StaffID, StatusCode: $StatusCode, Type: $Type, CreatedTo: $CreatedTo, CreatedFrom: $CreatedFrom, ExpiredTo: $ExpiredTo, ExpiredFrom: $ExpiredFrom, StatusCodes: $StatusCodes, HubID: $HubID, HubIDs: $HubIDs) {
            Items {
                Address
                Code
                CreatedAt {
                  Pretty
                }
                CustomerName
                CustomerPhone
                ExpiredAt {
                  Deadline
                }
                Hub {
                  DisplayName
                  Code
                  Name
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
                  Order {
                    Code
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
      let {SenderQuery, ReceiverQuery, Code, StaffID, StatusCode, Type, StatusCodes} = filter;
      variables.SenderQuery = SenderQuery || null;
      variables.ReceiverQuery = ReceiverQuery || null;
      variables.Code = Code || null;
      variables.StaffID = StaffID || null;
      variables.Type = Type || null;
      variables.StatusCode = StatusCode || null;
      variables.StatusCodes = StatusCodes || null;
    }
    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Tasks;
        this.dataSource = data.Items;
        this.pagination = pagination;
        this.pagination.total = data.Pager.TotalOfItems;
        this.order = order;
        this.selectedRowKeys = data.Items.map(val => val.Code);
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  clear = () => {
    this.dataSource = [];
    this.filter = {
      ...setDefaultDate('CreatedFrom', 'CreatedTo'),
      HubID: meStore.getCurrentHub()
    };
    this.pagination = defaultPaginationPrint;
    this.order = [];
    this.selectedRowKeys = [];
  };

  @action
  changeRowKeys = (rowKeys) => {
    this.selectedRowKeys = rowKeys;
  };

  @action
  clearPrint = () => {
    this.printData = [];
  };

  @action
  fetchByCodes = (codes) => {
    let query = `
      query Tasks($Codes: [String]) {
        Tasks(Codes: $Codes) {
          Items {
              Address
              Code
              CreatedAt {
                Pretty
              }
              CustomerName
              CustomerPhone
              AccountReceivable
              QRCode
              StatusCode {
                Name
              }
              Staff {
                Name
              }
              Orders {                    
                TotalCost
                PaymentType {
                    Name
                }
                Name
                CreatedAt {          
                  Pretty
                }
                Receiver {       
                  Phone    
                  AccountReceivable      
                }
                ServiceType {          
                  Name          
                }
                DeliveryNote
                Quantity
                NetWeight
              }
          }
        }
      }
    `;
    let variables = {
      Codes: codes
    };
    this.fetchingPrint = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Tasks;
        this.printData = data.Items;
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetchingPrint = false;
      }));
  };

}

export default new PrintTasksStore()