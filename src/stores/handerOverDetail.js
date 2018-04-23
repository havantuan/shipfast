import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../request';
import apiUrl from '../config/apiUrl';

export class HanderOverDetail {
  @observable fetching = false;
  @observable dataSource = {};
  @action
  clear = () => {
    this.dataSource = {};
  }
  @action
  fetchByID = (Code) => {
    let query = `
          query DataSource($Code: String!) {
                HandOver(Code: $Code) {
                  Entries {
                    Order {
                      Code  
                      Name  
                      Cod
                      DeliveryNote
                      Height
                      InHub
                      Length
                      NetWeight
                      PackageValue      
                      Quantity
                      TotalCost
                      Width
                      StatusCode {
                        Color
                        Name
                        Code
                      }
                        ServiceType {           
                        Name    
                      }
                        PaymentType {
                        Code
                        Name
                      }
                      CanCheck {
                        Name
                      }
                      HandOverStatusCodes {
                        Name
                      }
                    }
                    AccountReceivable
                    ID
                    IsKPI
                    FromStatusCode {
                      Color
                      Name
                    }
                    ToStatusCodeCode {
                      Color
                      Name
                    }
                  }                  
                  AssignStaff {
                      Address
                      Code
                      Email
                      Name
                      Phone    
                  }
                  AccountReceivables
                  Code
                  Deliveries
                  ID
                  Pickups                      
                  Returns
                  CreatedAt {    
                    Pretty
                  }
                  Hub {
                    Code
                    Address    
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
                  QRCode
                }
            }
        `;

    let variables = {Code};
    this.fetching = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        this.dataSource = result.data.HandOver;
        this.fetching = false;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
      }));
  };

}

export default new HanderOverDetail()