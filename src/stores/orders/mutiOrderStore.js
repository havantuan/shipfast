import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../../request';
import apiUrl from '../../config/apiUrl';
import ObjectPath from 'object-path';
import meStore from "../meStore";
import {getCurrentSite} from "../../helpers/utility";

export class MutiOrderStore {

  @observable fetching = false;
  @observable fetched = false;
  @observable dataSource = [];
  @observable filter = {};
  @observable code = [];
  @observable pagination = {
    total: 0
  };
  @action
  reload = () => {
    this.fetch(this.filter)
  };

  @action
  onFilter = (filter) => {
    this.filter = filter;
    this.pagination = {total: 0};
    return this.reload();
  };
  @action
  fetch = (code) => {
    let query = `
        query Orders($code: [String], $CustomerID: Int) {
          Orders (Codes: $code, CustomerID: $CustomerID) {
            Items {
              PaymentType {
                Name
              }
              Cod
              Code
              Customer {
                KHType {
                  Code
                  Name
                  Value
                }
              }
              Name
              DeliveryNote
              NetWeight
              PackageValue
              QRCode
              Quantity
             	ServiceType {
                  Name
                }
                 CanCheck {
                    Name
                  }
              Receiver {
                AccountReceivable         
                Address                                           
                Name
                Phone
              }
              Sender {
                AccountReceivable
                Address                
                Name
                Phone
                 City {
                Name
                Code
              }
              }
              PackageValue
              TotalCost
            }
            Limit
            NumberOfPages
            Page
            TotalOfItems
          }
        }
        `;

    let variables = {
      code,
      CustomerID: getCurrentSite() === 'KH' ? meStore.getUserID() : null
    };

    this.fetching = true;
    this.fetched = false;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Orders;
        this.dataSource = data.Items;
        this.pagination = {
          total: ObjectPath.get(data, 'Pager.TotalOfItems', 0)
        };
        this.fetched = true;
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  clear = () => {
    this.fetched = false;
    this.dataSource = {};
    this.filter = {};
  }

}

export default new MutiOrderStore()