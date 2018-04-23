import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../request';
import apiUrl from '../config/apiUrl';
import {defaultPagination} from '../config';
import {convertToPagination} from '../helpers/utility';
import {WebSite} from "../helpers/WebSite";
import meStore from "./meStore";

export class DetailCrossStore {
  @observable fetching = false;
  @observable isCreating = false;
  @observable isUpdateMode = false;
  @observable isUpdating = false;
  @observable isShowModal = false;
  @observable dataSource = [];
  @observable filter = {};
  @observable items = undefined;
  @observable pager = undefined;
  @observable pagination = defaultPagination;
  @observable dataOrder = [];
  @observable order = [];

  @action
  clear = () => {
    this.filter = {};
    this.pagination = defaultPagination;
    this.dataSource = [];
    this.order = [];
    this.dataOrder = [];
  };

  @action
  reload = (code) => {
    this.getCrossByID(code, this.filter, this.pagination, this.order);
  };

  @action
  getCrossByID = (code, filter, pagination, order = []) => {
    let query = `
        query CustomerCross($Page: Int = 1, $Limit: Int = 10, $Order: [Sort], $code: String, $Codes: [String], $Query: String, $StatusCode: Int) {
          CustomerCross (Code: $code) {
            CancelCount
            Code
            DiscountByPolicy
            NetAmount
            QRCode
            ReturnCount            
            SuccessfulCount
            TotalCod
            TotalCosts
            TotalDiscount
            TotalOrders
             Orders(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order},Codes: $Codes, Query: $Query, StatusCode: $StatusCode) {
              Items {
                  AllowCancelByUser
            Code
            CreatedAt {
              Pretty
            }
            CurrentHub {
              Name  
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
               Pager {
                    Limit
                    NumberOfPages
                    Page
                    TotalOfItems
                }
            }
            ExtraFee
            CustomerCrossHistory {
              ExtraFee
              Note
              Type
              CreatedBy {
                Name
              }
              StatusCode {
                Code
                Color
                Name
              }
              CreatedAt {
                Pretty
              }
            }
          }
        }
        `;
    let {pageSize, current} = pagination;
    let variables = {
      code,
      Page: current,
      Limit: pageSize,
      Order: order || null,
      UserID: WebSite.IsKh ? meStore.getUserID() : null
    };
    if (filter) {
      let {Query, Codes, StatusCode} = filter;
      variables.Query = Query || null;
      variables.Codes = Codes || null;
      variables.StatusCode = StatusCode || null;
    }
    this.fetching = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        this.dataSource = result.data.CustomerCross;
        this.dataOrder = result.data.CustomerCross.Orders.Items;
        this.pagination.total = result.data.CustomerCross.Orders.Pager.TotalOfItems;
        this.pagination = pagination;
        this.filter = filter;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  handleTableChange = (code, pagination, filters, sort) => {
    this.pagination = convertToPagination(pagination, this.pagination);
    this.reload(code);
  };

  @action
  onFilter = (code, filter) => {
    this.filter = filter;
    this.pagination = defaultPagination;
    return this.reload(code);
  };

  @action
  openModal = () => {
    this.isShowModal = true;
  };

  @action
  closeModal = () => {
    this.isShowModal = false;
  };

  @action
  updateCustomerCross = (code, data) => {
    this.isUpdating = true;
    return authRequest
      .put(apiUrl.UPDATE_CUSTOMER_CROSS_URL.replace(':code', code), data).then(action((result) => {
        this.closeModal();
        this.reload(code);
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isUpdating = false;
      }));
  };
}

export default new DetailCrossStore()