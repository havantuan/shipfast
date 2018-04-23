import {action, computed, observable} from "mobx";
import {authRequest, errorMessage} from '../request';

import apiUrl from '../config/apiUrl';
import {defaultPagination} from '../config';
import {convertToPagination, filterDateTime, setDefaultDate} from '../helpers/utility';
import meStore from "./meStore";
import moment from "moment";

export class AssignConfirmStore {

  @observable fetching = false;
  @observable dataSource = [];
  @observable items = undefined;
  @observable filter = {};
  @observable pagination = defaultPagination;
  @observable order = [];

  @computed
  get createdDateSelected() {
    let {CreatedFrom, CreatedTo} = this.filter;
    if (CreatedFrom && CreatedTo) {
      return [CreatedFrom, CreatedTo];
    }
  }

  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order)
  };

  @action
  clear = () => {
    this.filter = {};
    this.pagination = defaultPagination;
    this.order = [];
    this.dataSource = [];
  };

  @action
  handleTableChange = (pagination, filters, sort) => {
    this.pagination = convertToPagination(pagination, this.pagination);
    this.reload();
  };

  @action
  fetchFirst = () => {
    this.filter = {
      ...this.filter,
      ...setDefaultDate('CreatedFrom', 'CreatedTo')
    };
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
       query AssignConfirms($Page: Int = 1, $Limit: Int = 10, $Order: [Sort], $Codes: [String], $StaffID: Int, $AssignStaffID: Int, $Query: String, $HubID: Int, $TaskID: Int, $HubIDs: [Int], $CreatedFrom: DateTime${filterDateTime(filter.CreatedFrom)}, $CreatedTo: DateTime${filterDateTime(filter.CreatedTo)}) {
         AssignConfirms(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, Codes: $Codes, StaffID: $StaffID, AssignStaffID: $AssignStaffID, Query: $Query, HubID: $HubID, TaskID: $TaskID, HubIDs: $HubIDs, CreatedFrom: $CreatedFrom, CreatedTo: $CreatedTo) {
              Items {
                Code
                CreatedAt {
                  Pretty
                }
                AssignStaff {
                  Name
                  Phone
                }
                Pickups
                Returns
                Deliveries  
                Hub {        
                  Code
                  Name                
                }
                Staff {        
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
      let {Codes, StaffID, AssignStaffID, Query, TaskID} = filter;
      variables.Codes = Codes || null;
      variables.StaffID = StaffID || null;
      variables.AssignStaffID = AssignStaffID || null;
      variables.StaffID = StaffID || null;
      variables.Query = Query || null;
      variables.TaskID = TaskID || null;
    }
    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.AssignConfirms;
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

export default new AssignConfirmStore()