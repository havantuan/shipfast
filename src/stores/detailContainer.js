import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../request';

import apiUrl from '../config/apiUrl';

export class DetailContainer {
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
                Container(Code: $Code) {
                      VehicleNumberPlates  
                      Code
                      QRCode
                        Note
                        
                        Weight
                        CreatedAt {
                          Pretty
                        }
                        UpdatedAt {       
                            Pretty
                         }
                         UpdatedAt {    
                          Pretty
                        }
                        DestinationHub {
                          Code
                          Name
                        }
                        PickingLists {                           
                           Code
                          ContainerCode
                          Weight
                          ServiceType {
                            Name     
                          }
                          CreatedAt{
                            Pretty
                          }
                          Orders {
                            Cod    
                          }
                         Type {
                           Code
                           Name
                         }
                          UpdatedAt {       
                            Pretty
                          }
                           Status {
                          Color
                          Name
                          Code
                        }
                         SourceHub {
                        Name
                        Code
                      }
                      DestinationHub {
                        Name
                        Code
                      }    
                        }
                        SourceHub {
                          ID
                          Name
                          Phone
                        }
                        Status {
                          Color
                          Name
                          Code
                        }
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
        this.dataSource = result.data.Container;
        this.fetching = false;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
      }));
  };

}

export default new DetailContainer()