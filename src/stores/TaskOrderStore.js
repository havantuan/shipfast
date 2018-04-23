import {action, observable, computed} from "mobx";
import {authRequest, errorMessage} from '../request';
import apiUrl from '../config/apiUrl';
import {defaultPagination} from '../config';
import appStore from "./appStore";
import {convertToPagination, filterDateTime, setDefaultDate} from '../helpers/utility';
import moment from "moment";

export class TaskOrderStore {

  @observable fetching = false;
  @observable dataSource = [];
  @observable filter = {
    ...setDefaultDate('AssignedFrom', 'AssignedTo'),
  };
  @observable pagination = defaultPagination;
  @observable order = [];
  @observable expandSearch = false;

  @action
  clear = () => {
    this.filter = {
      ...setDefaultDate('AssignedFrom','AssignedTo'),
    };
    this.pagination = defaultPagination;
    this.dataSource = [];
    this.order = [];
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
  exportExcelTask = (data) => {
    window.open(apiUrl.EXPORT_TASK_URL + `?access_token=` + appStore.token + `&query=` + encodeURIComponent(JSON.stringify(data)));
  }

  @action
  fetch = (filter, pagination, order = []) => {

    let query = `
        query TaskOrders($Page: Int = 1, $Limit: Int = 10, $Order: [Sort],$TasksOrdersGroupStatuses: [Int] ,$ReceiverQuery: String, $StaffID: Int, $HubID: Int, $UpdatedTo: DateTime${filterDateTime(filter.UpdatedTo)}, $UpdatedFrom: DateTime${filterDateTime(filter.UpdatedFrom)}, $AssignedTo: DateTime${filterDateTime(filter.AssignedTo)}, $AssignedFrom: DateTime${filterDateTime(filter.AssignedFrom)}, $Type: EnumTaskType) {
            TaskOrders(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order},TasksOrdersGroupStatuses: $TasksOrdersGroupStatuses ,ReceiverQuery: $ReceiverQuery, StaffID: $StaffID, HubID: $HubID, UpdatedTo: $UpdatedTo, UpdatedFrom :$UpdatedFrom,AssignedTo: $AssignedTo, AssignedFrom: $AssignedFrom, Type: $Type) {
                Items {
                  Note                  
                   TasksOrdersGroupStatus {
                     Color
                      Name
                      Code
                  }
                  StatusCode {
                      Code
                      Color
                      Name
                    }
                  CreatedAt {      
                    Pretty
                  }
                  UpdatedAt {      
                    Pretty
                  }
                  Task {
                    AssignedAt {
                      Pretty
                    }                                                      
                    Type {
                      Code
                      Name
                    }
                    AccountReceivable
                    Address
                    Code
                    CustomerName
                    CustomerPhone
                    StaffCode
                    TotalWeight
                    Hub {
                      Code
                      Name                      
                    }
                    Staff {
                      Phone
                      Name
                    }
                    AccountReceivable                    
                  }
                  Order {
                    Code
                    Cod
                    TotalCost
                    PaymentType {
                      Code
                      Name
                    }
                    Vases {
                      Code
                      Name
                    }
                    ServiceType {
                      Name
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
    };
    if (filter) {
      let {StaffID, HubID, ReceiverQuery, TasksOrdersGroupStatuses, Type} = filter;
      variables.StaffID = StaffID || null;
      variables.HubID = HubID || null;
      variables.ReceiverQuery = ReceiverQuery || null;
      variables.TasksOrdersGroupStatuses = TasksOrdersGroupStatuses || null;
      variables.Type = Type || null;
    }
    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.TaskOrders;
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
  };

  @computed
  get assignedDateSelected() {
    let {AssignedFrom, AssignedTo} = this.filter;
    if (AssignedFrom && AssignedTo) {
      return [AssignedFrom, AssignedTo];
    }
  }

  @action
  onToggleExpandSearch = () => {
    this.expandSearch = !this.expandSearch;
  };
}


export default new TaskOrderStore()