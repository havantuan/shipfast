import {action, computed, observable} from "mobx";
import {authRequest, errorMessage} from '../../request';
import apiUrl from '../../config/apiUrl';
import {defaultPagination} from '../../config';
import ObjectPath from 'object-path';
import {convertToPagination, convertToSorter, filterDateTime, setDefaultDate} from '../../helpers/utility';
import meStore from '../meStore';
import moment from "moment";

export class WattingOrderStore {

  @observable fetching = false;
  @observable isShowModal = false;
  @observable isUpdatingReceiver = false;
  @observable dataSource = [];
  @observable items = undefined;
  @observable filter = {
    ...setDefaultDate('CreatedFrom', 'CreatedTo')
  };
  @observable pagination = defaultPagination;
  @observable order = [];
  @observable CityID = null;
  @observable DistrictID = null;
  @observable modal = {
    visible: false,
    data: {}
  };
  @observable expandSearch = false;

  @action
  onToggleExpandSearch = () => {
    this.expandSearch = !this.expandSearch;
  };

  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order)
  };
  @action
  clear = () => {
    this.filter = {
      ...setDefaultDate('CreatedFrom', 'CreatedTo')
    };
    this.pagination = defaultPagination;
    this.dataSource = [];
    this.order = [];
  }
  @action
  handleTableChange = (pagination, filters, sort) => {
    this.pagination = convertToPagination(pagination, this.pagination);
    this.order = convertToSorter(sort);
    this.reload();
  };
  @action
  showModal = (data) => {
    this.currentRow = data;
    this.isShowModal = true;
  };

  @action
  cancelModal = () => {
    this.isShowModal = false;
    this.currentRow = undefined;
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
    query OrdersFilter($Page: Int, $Limit: Int, $Order: [Sort], $Query: String, $HubID: Int, $StaffID: Int, $SenderCityID: Int, $SenderDistrictID: Int, $SenderWardID: Int, $ReceiverCityID: Int, $ReceiverDistrictID: Int, $ReceiverWardID: Int, $GroupStatusCode: Int, $CreatedTo: DateTime${filterDateTime(filter.CreatedTo)}, $CreatedFrom: DateTime${filterDateTime(filter.CreatedFrom)}, $StatusCode: Int, $Codes: [String], $GroupStatusCodes: [Int], $StatusCodes: [Int], $ServiceTypeID: Int, $CustomerQuery: String, $HubIDs: [Int], $SenderQuery: String, $ReceiverQuery: String) {
      Orders(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, Query: $Query, HubID: $HubID, StaffID: $StaffID, SenderCityID: $SenderCityID, SenderDistrictID: $SenderDistrictID, SenderWardID: $SenderWardID, ReceiverCityID: $ReceiverCityID, ReceiverDistrictID: $ReceiverDistrictID, ReceiverWardID: $ReceiverWardID, GroupStatusCode: $GroupStatusCode, CreatedTo: $CreatedTo, CreatedFrom :$CreatedFrom, StatusCode: $StatusCode, Codes: $Codes, GroupStatusCodes: $GroupStatusCodes, StatusCodes: $StatusCodes, ServiceTypeID: $ServiceTypeID, CustomerQuery: $CustomerQuery, HubIDs: $HubIDs, SenderQuery: $SenderQuery, ReceiverQuery: $ReceiverQuery) {
         Items {
            Code
            CreatedAt {
              Pretty
            }
            CurrentHub {
              Name  
            }               
            NetWeight     
            Quantity                     
            StatusCode {
              Name
              Code
              Color
            }     
            ServiceType {     
              Name      
              Code
            }                                                                  
            Receiver {
              Name
              Phone
              Hub {
                Name
                Code
              }
              City {
                ID
              }
              District {
                ID
              }
              Ward {
                ID
              }
              Address
              ToBeModifiedAddress
            }                                                                  
            Sender {
              Name
              Phone
              Hub {
                Name
                Code
              }
              City {
                ID
              }
              District {
                ID
              }
              Ward {
                ID
              }
              Address
              ToBeModifiedAddress
            }
            Name
            EventStatusCode {        
              Name       
            }
            GroupStatusCode {
              Name
            }
            UpdatedAt {
              Pretty
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
      Page: current || null,
      Limit: pageSize || null,
      Order: order || null,
      HubID: meStore.getCurrentHub(),
      HubIDs: meStore.getCurrentHub() ? null : meStore.getHubIDs()
    };
    if (filter) {
      let {Query, StaffID, SenderCityID, SenderDistrictID, SenderWardID, ReceiverCityID,
        ReceiverDistrictID, ReceiverWardID, GroupStatusCode, StatusCode, Codes, ServiceTypeID, CustomerQuery, SenderQuery, ReceiverQuery} = filter;
      variables.Query = Query || null;
      variables.StaffID = StaffID || null;
      variables.SenderCityID = SenderCityID || null;
      variables.SenderDistrictID = SenderDistrictID || null;
      variables.SenderWardID = SenderWardID || null;
      variables.ReceiverCityID = ReceiverCityID || null;
      variables.ReceiverDistrictID = ReceiverDistrictID || null;
      variables.ReceiverWardID = ReceiverWardID || null;
      variables.GroupStatusCode = GroupStatusCode || null;
      variables.StatusCode = StatusCode || null;
      variables.Codes = Codes || null;
      variables.StatusCodes = [355, 375];
      variables.ServiceTypeID = ServiceTypeID || null;
      variables.CustomerQuery = CustomerQuery || null;
      variables.SenderQuery = SenderQuery || null;
      variables.ReceiverQuery = ReceiverQuery || null;
    }

    this.fetching = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Orders;
        this.dataSource = data.Items;
        this.pagination = {
          ...pagination,
          total: ObjectPath.get(data, 'Pager.TotalOfItems', 0)
        };
        this.order = order;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };


  @action
  rejectOrder = (code, data) => {
    this.isRejecting = true;
    return authRequest
      .put(apiUrl.REJECT_ORDER_URL.replace(':code', code), data).then(action((result) => {
        this.reload();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isRejecting = false;
        this.rejectValue = {};
        this.isShowModal = false;
      }));
  };
  @action
  updateOrderStatus = (code, data) => {
    this.fetching = true;
    return authRequest
      .put(apiUrl.UPDATE_ORDER_STATUS_URL.replace(':code', code), {StatusCode: data}).then(action((result) => {
        this.reload();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };
  @action
  updateReceiver = (code, data) => {
    return authRequest
      .put(apiUrl.UPDATE_RECEIVER_URL.replace(':code', code), data).then(action((result) => {
        this.reload();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isShowModal = false;
        this.reload();
      }));
  };
  @action
  onCancelModal = () => {
    this.isShowModal = false;
  };

  @computed
  get createdDateSelected() {
    let {CreatedFrom, CreatedTo} = this.filter;
    if (CreatedFrom && CreatedTo) {
      return [CreatedFrom, CreatedTo];
    }
  }

}

export default new WattingOrderStore()