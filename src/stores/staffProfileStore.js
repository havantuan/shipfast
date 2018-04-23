import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../request';
import apiUrl from '../config/apiUrl';
import meStore from './meStore';

export class StaffProfileStore {

  @observable fetching = false;
  @observable dataSource = [];
  @observable isUpdating = false;

  @action
  update = (data) => {
    this.isUpdating = true
    return authRequest
      .put(apiUrl.UPDATE_STAFF_PROFILE_URL.replace(':id', meStore.getUserID()), data).then(action((result) => {
        this.isShowModel = false;
        return this.fetch();
      })).catch(action(e => {
        console.log(e)
        errorMessage(e);
      })).finally(action(() => {
        this.isUpdating = false;
      }));
  }

  @action
  fetch = () => {

    let query = `
        query Staff($id: Int) {
          Staff (ID: $id) {
            Address
            Email
            IDCard {
              IDNumber
            }
            Name
            Phone
          }
        }
        `;

    let variables = {
      id: meStore.getUserID(),
    };
    this.fetching = true
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const keys = result.data.Staff;
        this.dataSource = keys;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  }

}

export default new StaffProfileStore()