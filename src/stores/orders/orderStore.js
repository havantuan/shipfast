import {action, computed, observable} from "mobx";
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from '../../config/apiUrl';
import {defaultPagination} from '../../config';
import {convertToPagination, convertToSorter, filterDateTime, setDefaultDate} from '../../helpers/utility';
import appStore from "../appStore";
import meStore from "../meStore";

export class OrderStore {

  @observable fetching = false;
  @observable dataSource = [];
  @observable filter = {
    ...setDefaultDate('CreatedFrom', 'CreatedTo')
  };
  @observable items = undefined;
  @observable pager = undefined;
  @observable pagination = defaultPagination;
  @observable order = [];
  @observable visible = false;
  @observable titleOrder = null;
  @observable reasonCancel = null;
  @observable expandSearch = false;

  @computed
  get timeSelected() {
    let {CreatedFrom, CreatedTo} = this.filter;
    if (CreatedFrom && CreatedTo) {
      return [CreatedFrom, CreatedTo];
    }
  }

  @action
  onChangeCreatedDate = (time) => {
    this.filter = {
      ...this.filter,
      CreatedFrom: time[0],
      CreatedTo: time[1]
    }
  };

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
  setFetching = (fetching) => {
    this.fetching = fetching
  }
  @action
  showUpdateModel = (currentRow) => {
    this.titleOrder = currentRow;
    this.visible = true;
  }
  @action
  onCancelModal = () => {
    this.visible = false;
    this.currentRow = undefined;
    this.reasonCancel = null;
  }
  @action
  onOkModel = () => {
    this.visible = false;
    this.currentRow = undefined;
    return this.reload();
  }
  @action
  handleReject = () => {
    return authRequest
      .put(apiUrl.REJECT_ORDER_URL.replace(':code', this.titleOrder), {Note: this.reasonCancel}).then(action((result) => {
        this.onCancelModal();
        return this.reload();
      })).catch(action(e => {
        errorMessage(e);
      })).finally(action(() => {
      }));
  }
  @action
  exportExcelOrder = (data) => {
    window.open(apiUrl.EXPORT_ORDER_URL + `?access_token=` + appStore.token + `&query=` + encodeURIComponent(JSON.stringify(data)) + `&type=order`);
  }
  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order)
  }
  @action
  onchangeTabs = (e) => {
    this.filter.GroupStatusCode = e.key;
    this.reload();
  }
  @action
  handleChangeReason = (value) => {
    console.log('%c value', 'color: #00b33c', value)
    this.reasonCancel = value;
  }
  @action
  handleTableChange = (pagination, filters, sort) => {
    this.pagination = convertToPagination(pagination, this.pagination);
    this.order = convertToSorter(sort);
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
    let {onTopBar} = filter;
    if (onTopBar) {
      filter = {Query: filter.Query}
    }
    let query = `
       query OrdersFilter($Page: Int, $Limit: Int, $Order: [Sort], $Query: String, $HubID: Int, $StaffID: Int,$SenderQuery: String,$ReceiverQuery: String, $SenderCityID: Int, $SenderDistrictID: Int, $SenderWardID: Int, $ReceiverCityID: Int, $ReceiverDistrictID: Int, $ReceiverWardID: Int, $GroupStatusCode: Int, $CreatedTo: DateTime${filterDateTime(filter.CreatedTo)}, $CreatedFrom: DateTime${filterDateTime(filter.CreatedFrom)}, $DeliveryTo :DateTime${filterDateTime(filter.DeliveryTo)}, $DeliveryFrom: DateTime${filterDateTime(filter.DeliveryFrom)}, $StatusCode: Int, $Codes: [String], $GroupStatusCodes: [Int], $StatusCodes: [Int], $ServiceTypeID: Int, $CustomerQuery: String, $HubIDs: [Int]) {
      Orders(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, Query: $Query, HubID: $HubID, StaffID: $StaffID,SenderQuery: $SenderQuery,ReceiverQuery: $ReceiverQuery, SenderCityID: $SenderCityID, SenderDistrictID: $SenderDistrictID, SenderWardID: $SenderWardID, ReceiverCityID: $ReceiverCityID, ReceiverDistrictID: $ReceiverDistrictID, ReceiverWardID: $ReceiverWardID, GroupStatusCode: $GroupStatusCode, CreatedTo: $CreatedTo, CreatedFrom :$CreatedFrom, DeliveryTo :$DeliveryTo, DeliveryFrom :$DeliveryFrom, StatusCode: $StatusCode, Codes: $Codes, GroupStatusCodes: $GroupStatusCodes, StatusCodes: $StatusCodes, ServiceTypeID: $ServiceTypeID, CustomerQuery: $CustomerQuery, HubIDs: $HubIDs) {
         Items {
            DiscountCode
            AllowCancelByUser
            Code
            CreatedAt {
              Pretty
            }
            CurrentHub {
              Name
              Code
            }
            Customer {
              CustomerCode
              Name
              Phone
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
            PaymentType {
              Name
            }
            ServiceType {     
              Name      
              Code
            }
            Vases {
              Name
              Code
            }
            Cod
            TotalCost     
                       
            Width
            Name
            Sender {
              AccountReceivable 
              Address
              Email
              IdentityNumber
              Name
              Phone
              Hub {
                Name
              }            
              City {
                Name
              }
              District {          
                Name
              }             
            }                         
            Receiver {
              AccountReceivable
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
            UpdatedAt {
              Pretty
            }
            SurchargeCost 
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
      Order: order || null
    };
    if (!onTopBar) {
      variables.HubID = meStore.getCurrentHub();
      variables.HubIDs = meStore.getCurrentHub() ? null : meStore.getHubIDs()
    }
    if (filter) {
      let {Query, SenderQuery, ReceiverQuery, StaffID, SenderCityID, SenderDistrictID, SenderWardID, ReceiverCityID, ReceiverDistrictID, ReceiverWardID, GroupStatusCode, StatusCode, Codes, GroupStatusCodes, StatusCodes, ServiceTypeID, CustomerQuery} = filter;
      variables.SenderQuery = SenderQuery || null;
      variables.ReceiverQuery = ReceiverQuery || null;
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
        const keys = result.data.Orders;
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
  onToggleExpandSearch = () => {
    this.expandSearch = !this.expandSearch;
  };

}

export default new OrderStore()