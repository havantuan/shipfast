import {action, computed, observable} from "mobx";
import {authRequest, errorMessage} from '../request';
import apiUrl from '../config/apiUrl';
import {defaultPagination} from '../config';
import {convertToPagination, filterDateTime, setDefaultDate} from '../helpers/utility';
import meStore from "./meStore";
import moment from "moment";

export class HanderOverStore {

  @observable fetching = false;
  @observable dataSource = [];
  @observable items = undefined;
  @observable filter = {
    ...setDefaultDate('CreatedFrom', 'CreatedTo')
  };
  @observable pagination = defaultPagination;
  @observable order = [];

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
  clear = () => {
    this.filter = {
      ...setDefaultDate('CreatedFrom', 'CreatedTo')
    };
    this.pagination = defaultPagination;
    this.order = [];
    this.dataSource = [];
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
          query DataSources($Page: Int = 1, $Limit: Int = 10, $Order: [Sort], $Query: String, $StaffID: Int, $AssignStaffID: Int, $TaskID: Int, $HubID: Int, $CreatedTo: DateTime${filterDateTime(filter.CreatedTo)}, $CreatedFrom: DateTime${filterDateTime(filter.CreatedFrom)}, $HubIDs: [Int]) {
            HandOvers(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, Query: $Query, StaffID: $StaffID, AssignStaffID: $AssignStaffID, TaskID: $TaskID, HubID: $HubID, CreatedFrom: $CreatedFrom, CreatedTo: $CreatedTo, HubIDs: $HubIDs) {
                Items {
                   AccountReceivables
                   Code
                   Deliveries
                   ID
                   Pickups  
                   Returns
                  AssignStaff {
                    Address    
                    Email
                    Name
                    Phone   
                  }
                  CreatedAt {
                    Deadline
                    Pretty
                  }
                  Hub {
                    Address
                    Code                    
                    DisplayName
                    Name
                    Phone
                  }
                  Staff {
                    Address
                    Code
                    Email
                    Name
                    Phone       
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
      let {Query, StaffID, TaskID, AssignStaffID} = filter;
      variables.Query = Query || null;
      variables.StaffID = StaffID || null;
      variables.AssignStaffID = AssignStaffID || null;
      variables.TaskID = TaskID || null;
    }
    this.fetching = true
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.HandOvers;
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

export default new HanderOverStore()