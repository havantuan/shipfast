import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../request';
import apiUrl from '../config/apiUrl';
import {defaultPagination} from '../config';
import {convertToPagination, filterDateTime} from '../helpers/utility';
import appStore from "./appStore";
import {message, Modal, Tag} from 'antd';
import moment from "moment";
import React from 'react';
import routerConfig from "../config/router";

export class CrossStore extends React.PureComponent {
  @observable fetching = false;
  @observable isCreating = false;
  @observable isUpdateMode = false;
  @observable isUpdating = false;
  @observable isShowModal = false;
  @observable dataSource = [];
  @observable filter = {
    CrossTo: moment(moment().endOf('day')).subtract(1, 'days').format()
  };
  @observable items = undefined;
  @observable pager = undefined;
  @observable pagination = defaultPagination;
  @observable order = [];
  @observable dataOrder = [];
  @observable expandSearch = false;

  @action
  clear = () => {
    this.filter = {};
    this.pagination = defaultPagination;
    this.dataSource = [];
    this.order = [];
    this.dataOrder = [];
  }
  @action
  setUpdateMode = (isUpdate) => {
    this.isUpdateMode = isUpdate;
  };
  @action
  reload = () => {
    this.getOrderByCustomer(this.filter, this.pagination, this.order)
  }
  @action
  exportExcelCross = (data) => {
    console.log('%c data', 'color: #00b33c', data);
    window.open(apiUrl.EXPORT_ORDER_URL + `?access_token=` + appStore.token + `&query=` + encodeURIComponent(JSON.stringify(data)) + `&type=cross`);
  }
  @action
  getCrossByID = (id, filter, pagination, order = []) => {
    let query = `
        query CustomerCrosses($id: Int, $Page: Int, $Limit: Int, $Order: [Sort]) {
          CustomerCrosses (UserID: $id) {
          Items {
            CancelCount
            Code
            DiscountByPolicy
            NetAmount
            QRCode
            ReturnCount
            StatusCode {
              Name
              Color
              Code
            }
            DiscountCode
            SuccessfulCount
            TotalCod
            TotalCosts
            TotalDiscount
            TotalOrders
            Orders(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}) {
              Items {
                CustomerCrossCode
                Customer {
                CustomerCode 
                Name
                Phone 
              }  
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
          }
        
        }
        }
        `;
    let {pageSize, current} = pagination;
    let variables = {
      id,
      Page: current,
      Limit: pageSize,
      Order: order || null,
    };
    this.fetching = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.CustomerCrosses;
        this.dataSource = data.Items;
        if (Array.isArray(data.Items) && data.Items.length > 0) {
          this.dataOrder = data.Items[0].Orders.Items;
          this.pagination.total = data.Items[0].Orders.Pager.TotalOfItems;
          this.pagination = pagination;
        }
        this.filter = filter;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));

  }

  @action
  getOrderByCustomer(filter, pagination, order = []) {
    let query = `
       query OrdersFilter($Page: Int, $Limit: Int, $Order: [Sort],$ActionType: EnumActionType, $Query: String, $CustomerID: Int, $StaffID: Int, $SenderCityID: Int, $SenderDistrictID: Int, $SenderWardID: Int, $ReceiverCityID: Int, $ReceiverDistrictID: Int, $ReceiverWardID: Int, $GroupStatusCode: Int, $CrossTo: DateTime${filterDateTime(filter.CrossTo)}, $CreatedFrom: DateTime${filterDateTime(filter.CreatedFrom)}, $DeliveryTo :DateTime${filterDateTime(filter.DeliveryTo)}, $DeliveryFrom: DateTime${filterDateTime(filter.DeliveryFrom)}, $StatusCode: Int, $Codes: [String]) {
      Orders(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, Query: $Query,ActionType: $ActionType, CustomerID: $CustomerID, StaffID: $StaffID, SenderCityID: $SenderCityID, SenderDistrictID: $SenderDistrictID, SenderWardID: $SenderWardID, ReceiverCityID: $ReceiverCityID, ReceiverDistrictID: $ReceiverDistrictID, ReceiverWardID: $ReceiverWardID, GroupStatusCode: $GroupStatusCode, CrossTo: $CrossTo, CreatedFrom :$CreatedFrom, DeliveryTo :$DeliveryTo, DeliveryFrom :$DeliveryFrom, StatusCode: $StatusCode, Codes: $Codes) {
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
              Pretty
            }
           ReturningTime {              
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
      Order: order || null,
    };
    if (filter) {

      let {Query, StaffID, SenderCityID, SenderDistrictID, SenderWardID, ReceiverCityID, ReceiverDistrictID, ReceiverWardID, GroupStatusCode, StatusCode, Codes, CustomerID} = filter;
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
      variables.CustomerID = CustomerID || null;
      variables.ActionType = 'NotCross';
    }
    this.fetching = true
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const keys = result.data.Orders;
        this.dataOrder = keys.Items;
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
        console.log('%cfinal', 'color: #00b33c',)
        this.fetching = false;
      }));
  }

  @action
  createCross = (data) => {
    this.isCreating = true;
    return authRequest
      .post(apiUrl.CREATE_CROSS_URL, data).then(action((result) => {
        if (!result.data) {
          message.error('Không có đơn hàng nào được đối soát');
        } else {
          Modal.success({
            title: `Có ${result.data.length} được đối soát`,
            // content: (<div> Đối soát  {result.data && result.data.map((val, index) => <Link to={routerConfig.crossDetail.replace(':id', val)} key={index}>val</Link> )}  được tạo! </div>),
            // content: ` Đối soát  ${result.data && result.data.map((val) => val)}  được tạo! `,
            content: (
              <div>
                  <span>{'Đối soát '}{result.data && result.data.map((val, index) => (
                    <Tag
                      key={index}
                      color={'purple'}
                      onClick={() => window.open(routerConfig.crossDetail.replace(':code', val), '_blank')}
                    >
                      {val}
                    </Tag>
                  ))}{'đã được tạo!'}</span>
              </div>
            )
          });
        }
        return result
      })).catch(action(e => {
        errorMessage(e);
        throw  e;
      })).finally(action(() => {
        this.isCreating = false;
      }));
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
  onToggleExpandSearch = () => {
    this.expandSearch = !this.expandSearch;
  };
}

export default new CrossStore()