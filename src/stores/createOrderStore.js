import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../request';

import apiUrl from '../config/apiUrl';
import ObjectPath from 'object-path';

export class CreateOrderStore {

  @observable fetching = false;
  @observable product = true;
  @observable volume = false;
  @observable insurrance = false;
  @observable ReceiverDistrictID = null;
  @observable SenderDistrictID = null;
  @observable SenderInventoryID = null;
  @observable ServiceTypeID = null;
  @observable senderFormVisible = false;
  @observable isCreating = false;
  @observable isUpdating = false;
  @observable isUpdateMode = false;
  @observable modalVisible = false;
  @observable dataSource = [];
  @observable estimatedPriceData = null;
  @observable isExpand = false;

  @action
  onToggleExpand = () => {
    this.isExpand = !this.isExpand;
  };

  @action
  create = (data) => {
    this.isCreating = true
    return authRequest
      .post(apiUrl.CREATE_ORDER_URL, data).then(action((result) => {
        console.log('result', result)
        return result
      })).catch(action(e => {
        errorMessage(e);
        throw  e;
      }));
  }
  @action
  createByStaff = (data) => {
    this.isCreating = true
    return authRequest
      .post(apiUrl.CREATE_ORDER_URL_STAFF, data).then(action((result) => {
        console.log('result', result)
        return result
      })).catch(action(e => {
        errorMessage(e);
        throw  e;
      }));
  }
  @action
  clearData = () => {
    this.fetching = false;
    this.product = true;
    this.volume = false;
    this.insurrance = false;
    this.ReceiverDistrictID = null;
    this.SenderDistrictID = null;
    this.SenderInventoryID = null;
    this.ServiceTypeID = null;
    this.senderFormVisible = false;
    this.isCreating = false;
    this.isUpdating = false;
    this.isUpdateMode = false;
    this.modalVisible = false;
    this.dataSource = [];
    this.estimatedPriceData = null;
  }
  update = (code, data) => {
    return authRequest
      .put(apiUrl.UPDATE_ORDER_WITH_CODE_URL.replace(':code', code), data).then(action((result) => {
        console.log('result', result)
        return result
      })).catch(action(e => {
        errorMessage(e);
        throw  e;
      }));
  }
  @action
  handleToggleModal = () => {
    this.modalVisible = !this.modalVisible
  }
  @action
  handleToggleSenderForm = () => {
    this.senderFormVisible = !this.senderFormVisible
  }

  @action
  handleOpenSenderForm = () => {
    this.senderFormVisible = true;
  };

  @action
  toggleInsurrance = () => {
    this.insurrance = !this.insurrance;
  }
  @action
  onSenderDistrictIDChange = (ID) => {
    this.SenderDistrictID = ID;
  }
  @action
  onServiceTypeChange = (ServiceTypeID) => {
    this.ServiceTypeID = ServiceTypeID;
  }
  @action
  setUpdateMode = (isUpdate = true) => {
    this.isUpdateMode = isUpdate;
  };
  @action
  onReceiverDistrictIDChange = (DistrictID) => {
    this.ReceiverDistrictID = DistrictID;
  }
  @action
  expandField = (fieldName) => {
    this[fieldName] = !this[fieldName];
  }
  getOrderByCode = (code) => {

    let query = `
        query Order($code: String!) {
          Order (Code: $code) {
          DiscountCode
            Code
            Name
            NetWeight
            NetWeightInGram
            PackageValue
            Vases {
              ID
            }
            Length
            Width
            Height
            CanCheck {
              Value
            }
            DeliveryNote
            Cod
            ServiceType {
              ID
              Code
            }
            PaymentType {
              Value
            }
            Receiver {
              Address
              Name
              Phone
              District {
                ID
              }
              ToBeModifiedAddress
              Ward {
                ID
              }
            }
            Sender {
              Address
              Name
              Phone
              District {
                ID
              }
              ToBeModifiedAddress
              Ward {
                ID
              }
              Inventory {
                ID
              }
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
        const keys = result.data.Order;
        this.dataSource = keys;
        this.insurrance = ObjectPath.has(keys, 'Vases') && Array.isArray(keys.Vases) && keys.Vases.some(val => val.ID === 4);
        if ((ObjectPath.get(keys, 'Length') && ObjectPath.get(keys, 'Length') !== 0) ||
          (ObjectPath.get(keys, 'Width') && ObjectPath.get(keys, 'Width') !== 0) ||
          (ObjectPath.get(keys, 'Height') && ObjectPath.get(keys, 'Height') !== 0)) {
          this.volume = true;
        }
        this.SenderDistrictID = ObjectPath.get(keys, 'Sender.District.ID', null);
        this.ReceiverDistrictID = ObjectPath.get(keys, 'Receiver.District.ID', null);
        this.getEstimatedPriceDataByDataSource();
        console.log(this.result);
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  getEstimatedPriceDataByDataSource = () => {
    let dataSource = this.dataSource;
    let variables = {};
    if (dataSource) {
      variables.SenderHubID = 0;
      variables.ReceiverDistrictID = ObjectPath.get(dataSource, 'Receiver.District.ID', null);
      variables.Width = ObjectPath.get(dataSource, 'Width', null);
      variables.ServiceTypeID = ObjectPath.get(dataSource, 'ServiceType.ID', null);
      variables.NetWeight = ObjectPath.get(dataSource, 'NetWeightInGram', null);
      variables.PackageValue = ObjectPath.get(dataSource, 'PackageValue', null);
      variables.DiscountCode = ObjectPath.get(dataSource, 'DiscountCode', null);
      // variables.PaymentType = ObjectPath.get(dataSource, 'PaymentType.Value', null);
      variables.VasIDs = ObjectPath.get(dataSource, 'Vases.ID', null);
      variables.SenderDistrictID = ObjectPath.get(dataSource, 'Sender.District.ID', null);
      variables.Length = ObjectPath.get(dataSource, 'Length', null);
      variables.Height = ObjectPath.get(dataSource, 'Height', null);
      variables.Cod = ObjectPath.get(dataSource, 'Cod', null);
      // variables.IsPickupInHub = false;
      // variables.SurchargeCost = ObjectPath.get(dataSource, 'SurchargeCost', null);
      this.getestimatedPriceData(variables);
    }
  };

  @action
  getestimatedPriceData = (filter) => {
    let query = `
        query EstimatedCost($SenderHubID: Int, $ReceiverDistrictID: Int!, $Width: Int, $ServiceTypeID: Int!, $NetWeight: Float!, $PackageValue: Int, $DiscountCode: String, $PaymentType: Int, $VasIDs: [Int], $SenderDistrictID: Int!, $Length: Int, $Height: Int, $Cod: Int, $IsPickupInHub: Boolean, $SurchargeCost: Int){            
          EstimatedCost(SenderHubID: $SenderHubID, ReceiverDistrictID: $ReceiverDistrictID, Width: $Width, ServiceTypeID: $ServiceTypeID, NetWeight: $NetWeight, PackageValue: $PackageValue, DiscountCode: $DiscountCode, PaymentType: $PaymentType, VasIDs: $VasIDs, SenderDistrictID: $SenderDistrictID, Length: $Length, Height: $Height, Cod: $Cod, IsPickupInHub: $IsPickupInHub, SurchargeCost: $SurchargeCost) {
              Discount
              TotalCost    
              MaxTime
              MinTime
               Costs {
                Code
                Name
                Value
              }
          }
        }
        `;
    let variables = {};
    if (filter) {
      let {SenderHubID, ReceiverDistrictID, Width, ServiceTypeID, NetWeight, PackageValue, DiscountCode, PaymentType, VasIDs, SenderDistrictID, Length, Height, Cod, IsPickupInHub, SurchargeCost} = filter;
      variables.SenderHubID = SenderHubID || null;
      variables.ReceiverDistrictID = ReceiverDistrictID || null;
      variables.Width = Width || null;
      variables.ServiceTypeID = ServiceTypeID || null;
      variables.NetWeight = NetWeight || null;
      variables.PackageValue = PackageValue || null;
      variables.DiscountCode = DiscountCode || null;
      variables.PaymentType = PaymentType || null;
      variables.VasIDs = VasIDs || null;
      variables.SenderDistrictID = SenderDistrictID || null;
      variables.Length = Length || null;
      variables.Height = Height || null;
      variables.Cod = Cod || null;
      variables.IsPickupInHub = IsPickupInHub || false;
      variables.SurchargeCost = SurchargeCost || null;
    }
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        this.estimatedPriceData = result.data.EstimatedCost;
      })).catch(action(e => {
        errorMessage(e)
        throw e;
      })).finally(action(() => {
      }));
  }

}

export default new CreateOrderStore()