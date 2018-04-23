import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../../request';
import apiUrl from '../../config/apiUrl';
import {paginationConfig} from '../../config';
import ObjectPath from "object-path";

export class DetailOrderStore {

  @observable fetching = false;
  @observable isCreating = false;
  @observable isUpdateMode = false;
  @observable isUpdating = false;
  @observable isShowModal = false;
  @observable isShowRootModal = false;
  @observable dataSource = [];
  @observable hubID = null;
  @observable statusHub = null;
  @observable weight = false;
  @observable disabled = false;
  @observable isEditSurcharge = false;
  @observable surchargeCost = 0;
  @observable pager = {
    TotalOfItems: 0,
  };
  @observable filter = {};
  @observable pagination = {
    current: paginationConfig.page,
    pageSize: paginationConfig.perPage
  };
  @observable order = [];
  @observable dataOrder = {};

  @action  showRootModal = (code) => {
    this.isShowRootModal = true;
    this.getSingleOrder(code)
  }
  @action  onShowRootModal = (code) => {
    let self = this;
    return function () {
      self.showRootModal(code);
    };
  }
  @action  closeRootModal = () => {
    this.isShowRootModal = false;
    this.dataOrder = {}
  }
  @action
  clear = () => {
    this.isShowModal = false;
    this.dataOrder = {};
    this.statusHub = null;
    this.isEditSurcharge = false;
    this.weight = false;
    this.disabled = false;
    this.surchargeCost = false;
    this.isShowRootModal = false;
    this.fetching = false;
  }
  @action
  getSingleOrder = (code) => {
    let query = `
        query Order($code: String!) {
          Order (Code: $code) {
            Code
            IsPickupInHub
            SurchargeCost
            Customer {
              CustomerCode
              Name
              Phone
            }
            CreatedAt {
              Deadline        
              Pretty
            }
            UpdatedAt {
              Deadline        
              Pretty
            }
              PickupTime {
              Deadline        
              Pretty
            }
            CurrentHub {
              Code
              Name  
              Address      
            }
            Cod            
            DiscountCode
            DeliveryNote                
            Height
            Length
            NetWeight
            PackageValue
            Quantity                
            StatusCode {
              Name
              Code
              Color
            }
            ServiceType {
              Conversion
              Name
              ValueType
            }
            Vases {
              Name
              ID
              Code
            }
             PaymentType {
              Code
              Name
            }                   
            Width
            Name
            Customer {
              CustomerCode
              Email
              Name
              Phone
              CreatedAt {
                Deadline                       
                Pretty
              }
            }
            Quantity
            Sender {
              Address
              Email
              IdentityNumber
              Lat
              Lng
              Name
              Phone
              Hub {
                Code
                Name
                Address
                ID
              }
              Inventory {
                Name
                Address
                Phone
              }
            }                
            Receiver {
              Address
              Email
              IdentityNumber
              Lat
              Lng
              Name
              Phone
              Hub {
                Code
                Name
                Address
                ID
              }
            }
            Tasks {
              Staff {                 
                Name
                Phone                    
              }
              Hub {  
               Name
              Code
             }  
              Address
              Code
              CustomerName
              CustomerPhone                                                  
              TotalWeight
               ExpiredAt {
                Deadline
                Pretty
              }
              ClosedAt {
                Deadline
                Pretty
              }
              CreatedAt {
                Deadline
                Pretty
              }
              StatusCode {
                Code
                Name
                Color
              }                   
            }
            OrderHistory {
              Note
              Type
                CreatedBy {  	    	  
                  Name
                  Phone
                }
                Hub {
                  Code
                  Address
                  Name
                }
              Staff {
                Code
                Phone
                Name                 
              }
              CreatedAt {
                Pretty
              }
              StatusCode {
                Code
                Name
                Color
              }
            }
            IsProvincialShipping
            ReturningCost
            TotalCost
            SuccessPickupTime {
              Pretty
            }
            SuccessDeliveryTime {
              Pretty
            }
              ReturningTime {
            Pretty
          }
          }
        }
        `;

    let variables = {
      code
    };
    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Order;
        this.dataOrder = data;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  }
  @action
  updateOrderHub = (code, hubID) => {
    this.isCreating = true;
    return authRequest
      .put(apiUrl.UPDATE_ORDER_HUB_URL.replace(':code', code), {ID: +hubID}).then(action((result) => {
        return this.getSingleOrder(code);
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isShowModal = false;
        this.isCreating = false;
      }));
  }
  updateOrderHubReleased = (code, hubID) => {
    return authRequest
      .put(apiUrl.UPDATE_ORDER_HUB_RELEASED_URL.replace(':code', code), {ID: +hubID}).then(action((result) => {
        return this.getSingleOrder(code);
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isShowModal = false;
        this.isCreating = false;
      }));
  }
  updateSurcharge = (code) => {
    return authRequest
      .put(apiUrl.UPDATE_SURCHARGE_URL.replace(':code', code), {Value: +this.surchargeCost}).then(action((result) => {
        this.isEditSurcharge = false;
        return this.getSingleOrder(code);
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
      }));
  }
  handleChangeSurchargeCost = (e) => {
    if (e.target.value) {
      this.surchargeCost = (e.target.value).replace(/,|\./gi, '');
    }
  }
  openSurcharge = (value, cost) => {
    this.isEditSurcharge = value;
    this.surchargeCost = cost
  }
  onCancelModal = () => {
    this.isShowModal = false;
  }
  @action
  showModal = () => {
    console.log("Show model");
    this.isShowModal = true;
  }
  @action
  OnchangeHub = (value) => {
    this.hubID = value;
  }
  @action
  handleMenuClick = (e) => {
    if (e.key === `1`) {
      // this.props.createTask(this.code);
    } else if (e.key === `2`) {
      this.statusHub = 2;
      this.isShowModal = true;
      this.hubID = ObjectPath.get(this.dataOrder, "Sender.Hub.ID");
    } else if (e.key === `3`) {
      this.statusHub = 3;
      this.isShowModal = true;
      this.hubID = ObjectPath.get(this.dataOrder, "Receiver.Hub.ID");
    }
  }

  @action
  handleSubmitModal = (orderCode) => {
    if (this.statusHub === 2) {
      this.updateOrderHub(orderCode, this.hubID);
    } else if (this.statusHub === 3) {
      this.updateOrderHubReleased(orderCode, this.hubID);
    }
  }
}

export default new DetailOrderStore()