import {action, computed, observable} from "mobx";
import {authRequest, errorMessage} from '../request';
import apiUrl from '../config/apiUrl';
import {defaultPagination} from '../config';
import {convertToPagination, filterDateTime, setDefaultDate} from '../helpers/utility';
import moment from "moment";
import meStore from "./meStore";

export class TaskStore {

  @observable fetching = false;
  @observable dataSource = [];
  @observable filter = {
    ...setDefaultDate('CreatedFrom', 'CreatedTo')
  };
  @observable items = undefined;
  @observable pager = undefined;
  @observable pagination = defaultPagination;
  @observable order = [];
  @observable isFetchingCurrentRow = false;
  @observable currentRow = undefined;
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
  clear = () => {
    this.filter = {
      ...setDefaultDate('CreatedFrom', 'CreatedTo')
    };
    this.pagination = defaultPagination;
    this.order = [];
    this.dataSource = [];
  };

  @action
  setFetching = (fetching) => {
    this.fetching = fetching
  };

  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order)
  };

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
       query Tasks($Page: Int = 1, $Limit: Int = 10, $Order: [Sort], $Code: String, $Query: String, $ReceiverQuery: String, $StaffID: Int, $StatusCode: Int, $Type: EnumTaskType, $CreatedTo: DateTime${filterDateTime(filter.CreatedTo)}, $CreatedFrom: DateTime${filterDateTime(filter.CreatedFrom)}, $ExpiredTo: DateTime${filterDateTime(filter.ExpiredTo)}, $ExpiredFrom: DateTime${filterDateTime(filter.ExpiredFrom)}, $StatusCodes: [Int], $HubID: Int, $HubIDs: [Int]) {
            Tasks(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, Query: $Query, ReceiverQuery: $ReceiverQuery, Code: $Code, StaffID: $StaffID, StatusCode: $StatusCode, Type: $Type, CreatedTo: $CreatedTo, CreatedFrom: $CreatedFrom, ExpiredTo: $ExpiredTo, ExpiredFrom: $ExpiredFrom, StatusCodes: $StatusCodes, HubID: $HubID, HubIDs: $HubIDs) {
                Items {
                  Address
                  Code
                  CustomerName
                  CustomerPhone
                  CreatedAt {
                      Deadline 		  
                      Pretty
                  }
                  AssignedAt {	  
                      Pretty
                  }
                  ExpiredAt {
                    Deadline
                    ISO
                  }
                  StatusCode {
                    Name
                    Code
                    Color
                  }
                   Staff {   
                     Name
                     Phone   
                   }
                   Hub {   
                     Name
                     Code   
                   }
                   AccountReceivable
                  TotalWeight
                  Type {
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
      HubID: meStore.getCurrentHub(),
      HubIDs: meStore.getCurrentHub() ? null : meStore.getHubIDs()
    };
    if (filter) {
      let {Query, ReceiverQuery, Code, StaffID, StatusCode, Type, StatusCodes} = filter;
      variables.Query = Query || null;
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
        const keys = result.data.Tasks;
        this.dataSource = keys.Items;
        this.pager = keys.Pager;
        this.pagination = {
          ...pagination,
          total: keys.Pager ? keys.Pager.TotalOfItems : 0
        };
        this.filter = filter;
        this.order = order;
        console.log(this.result);
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  fetchByCode = (Code) => {
    let query = `
      query Task($Code: String!) {
          Task(Code: $Code) {
            Address
            Code
             StatusCode {
              Name
              Code
              Color
            }
            AssignedAt {
                Deadline    
                Pretty
            }
            Hub {
              Code  
              Address    
              DisplayName
              Name
              Phone
            }
            Staff {                    
              Name
              Phone                        
            }
            TotalWeight
            CustomerName
            CustomerPhone
            CreatedAt {
              Deadline    
              Pretty
            }
             UpdatedAt {
              Deadline    
              Pretty
            }
            ClosedAt {
              Deadline    
              Pretty
            }
            ExpiredAt {
              Deadline 
              Pretty
            }
            SucceedAt {
              Deadline    
              Pretty
            }
            Entries {
                Order {
                    Code
                    StatusCode {
                      Name
                      Code
                      Color
                    }
                    Receiver {
                      Email
                      Name
                      Phone
                    }
                }
            }
          }
      }
    `;
    let variables = {Code};

    this.isFetchingCurrentRow = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        this.currentRow = result.data.Task;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isFetchingCurrentRow = false;
      }));
  };

}

export default new TaskStore()