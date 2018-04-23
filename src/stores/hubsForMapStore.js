import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../request';

import apiUrl from '../config/apiUrl';
import {getCurrentSite} from '../helpers/utility';

export class HubsForMapStore {

  @observable fetching = false;
  @observable dataSource = [];
  @observable items = undefined;
  @observable location = {lat: 21.036616, lng: 105.780538};
  @observable isActive = null;
  @observable isOpen = {};

  @action
  onChangeLocation = (val) => {
    let isOpen = {};
    isOpen[val.ID] = true;
    this.location = {lat: val.Lat, lng: val.Lng};
    this.isOpen = isOpen;
    this.isActive = val.ID;
  };

  @action
  onToggleOpen = (index) => {
    let tmp = {...this.isOpen};
    tmp[index] = this.isOpen[index] ? !this.isOpen[index] : true;
    this.isOpen = tmp;
  };

  @action
  fetch = () => {
    let query = `
       query DataSources ($Accessibility: EnumAccessibility) {
            Hubs (Accessibility: $Accessibility) {
                Items {
                    Address
                    City {
                      Name
                    }
                    DisplayName
                    District {
                      Name
                    }
                    ID
                    Phone
                    State {
                        Name
                    }
                    Lat
                    Lng
                    Ward {
                      Name
                    }
                }
            }
       }
    `;
    let variables = {
      Accessibility: getCurrentSite() === 'KH' ? 'Public' : null
    };
    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const keys = result.data.Hubs;
        this.dataSource = keys.Items;
        if (this.dataSource) {
          this.location = {
            lat: this.dataSource[0].Lat,
            lng: this.dataSource[0].Lng
          }
        }
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  }

}

export default new HubsForMapStore()