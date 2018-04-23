import {action, computed, observable} from "mobx";
import {authRequest, errorMessage} from '../../request';
import apiUrl from '../../config/apiUrl';
import ObjectPath from 'object-path';
import meStore from "../meStore";
import {convertToPagination, convertToSorter, filterDateTime, setDefaultDate} from "../../helpers/utility";
import {defaultPaginationPrint} from "../../config";
import moment from "moment";

export class MyLabelOrderStore {

  @observable fetching = false;
  @observable dataSource = [];
  @observable filter = {
    ...setDefaultDate('CreatedFrom', 'CreatedTo')
  };
  @observable code = [];
  @observable order = [];
  @observable pagination = defaultPaginationPrint;
  @observable expandSearch = false;

  @computed
  get timeSelected() {
    let {CreatedFrom, CreatedTo} = this.filter;
    if (CreatedFrom && CreatedTo) {
      return [CreatedFrom, CreatedTo];
    }
  }

  @action
  clear = () => {
    this.filter = {
      ...setDefaultDate('CreatedFrom', 'CreatedTo')
    };
    this.pagination = defaultPaginationPrint;
    this.dataSource = [];
    this.code = [];
    this.order = [];
  };

  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order)
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
  changeRowKeys = (rowKey) => {
    this.code = rowKey;
  };

  @action
  fetch = (filter, pagination) => {
    let query = `
    query Orders($Page: Int, $Limit: Int, $Order: [Sort], $SenderQuery: String, $ReceiverQuery: String, $HubID: Int, $StaffID: Int, $SenderCityID: Int, $SenderDistrictID: Int, $SenderWardID: Int, $ReceiverCityID: Int, $ReceiverDistrictID: Int, $ReceiverWardID: Int, $CreatedFrom: DateTime${filterDateTime(filter.CreatedFrom)}, $CreatedTo: DateTime${filterDateTime(filter.CreatedTo)}, $Codes: [String], $GroupStatusCodes: [Int], $StatusCodes: [Int], $ServiceTypeID: Int, $CustomerQuery: String) {
      MyOrders(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, SenderQuery: $SenderQuery, ReceiverQuery: $ReceiverQuery, HubID: $HubID, StaffID: $StaffID, SenderCityID: $SenderCityID, SenderDistrictID: $SenderDistrictID, SenderWardID: $SenderWardID, ReceiverCityID: $ReceiverCityID, ReceiverDistrictID: $ReceiverDistrictID, ReceiverWardID: $ReceiverWardID, CreatedFrom :$CreatedFrom, CreatedTo: $CreatedTo, Codes: $Codes, GroupStatusCodes: $GroupStatusCodes, StatusCodes: $StatusCodes, ServiceTypeID: $ServiceTypeID, CustomerQuery: $CustomerQuery) {
         Items {            
            Code
            CreatedAt {
              Pretty
            }
            DeliveryNote
            DeliveryTime {
              Deadline
              ISO
              Pretty
            }
            Height
            Length
            NetWeight
            PackageValue
            Quantity                     
            SuccessDeliveryTime {
              Deadline
              ISO
              Pretty
            }             
            SuccessPickupTime {
              Deadline
              ISO
              Pretty
            }
            StatusCode {
               Name
               Code
               Color
             }                      
            Width
            Name
            Sender {
              Address
              Email
              IdentityNumber
              Lat
              Lng
              Name
              Phone
            }
            Receiver {
              Address
              Email
              IdentityNumber
              Lat
              Lng
              Name
              Phone
            }
            Name
            EventStatusCode {        
              Name       
            }
            GroupStatusCode {
              Name
            }
            Staff {
              Name
              Phone
            }
        }
        Pager{
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
      HubID: (filter && filter.HubID) || meStore.getCurrentHub,
      Page: current,
      Limit: pageSize
    };
    if (filter) {
      let {Codes, SenderQuery, ReceiverQuery, StaffID, SenderCityID, SenderDistrictID, SenderWardID, ReceiverCityID, ReceiverDistrictID, ReceiverWardID, GroupStatusCodes, StatusCodes, ServiceTypeID, CustomerQuery} = filter;
      variables.ActionType = 'Print';
      variables.Codes = Codes || null;
      variables.SenderQuery = SenderQuery || null;
      variables.ReceiverQuery = ReceiverQuery || null;
      variables.StaffID = StaffID || null;
      variables.SenderCityID = SenderCityID || null;
      variables.SenderDistrictID = SenderDistrictID || null;
      variables.SenderWardID = SenderWardID || null;
      variables.ReceiverCityID = ReceiverCityID || null;
      variables.ReceiverDistrictID = ReceiverDistrictID || null;
      variables.ReceiverWardID = ReceiverWardID || null;
      variables.GroupStatusCodes = GroupStatusCodes || null;
      variables.StatusCodes = StatusCodes || null;
      variables.ServiceTypeID = ServiceTypeID || null;
      variables.CustomerQuery = CustomerQuery || null;
    }

    this.fetching = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.MyOrders;
        this.dataSource = data.Items;
        this.pager = data.Pager;
        this.code = data.Items.map(val => val.Code);
        this.pagination = {
          total: ObjectPath.get(data, 'Pager.TotalOfItems', 0)
        };
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  onToggleExpandSearch = () => {
    this.expandSearch = !this.expandSearch;
  };

}

export default new MyLabelOrderStore()