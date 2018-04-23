import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";

export class SingleAssignConfirmStore {

  @observable dataSource = {};
  @observable fetching = false;

  @action
  fetch = (code) => {
    let query = `
      query AssignConfirm($Code: String!) {
        AssignConfirm(Code: $Code) {
            AssignStaff {
              Name
            }
            Code
            CreatedAt {
              Pretty
            }
            QRCode
            Staff {
              Code
              Name
              QRCode
            }
            Tasks {
             Type {
              Code
              Name
            }
              Address
              Code
              CustomerName
              CustomerPhone              
              QRCode
              StatusCode {
                Name
              }
              Orders {       
                Cod
                Code             
                TotalCost
                PaymentType {
                    Name
                }
                Name
                CreatedAt {          
                  Pretty
                }
                Receiver {       
                  Phone    
                  AccountReceivable      
                }
                 Sender {
                  Phone
                  AccountReceivable       
                }
                ServiceType {          
                  Name          
                }
                DeliveryNote
                Quantity
                NetWeight
              }
            }
        }
      }
  `;

    this.fetching = true;
    let variables = {Code: code};

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        this.dataSource = result.data.AssignConfirm;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

}

export default new SingleAssignConfirmStore();