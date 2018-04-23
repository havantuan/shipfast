import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../request';

import apiUrl from '../config/apiUrl';
import meStore from './meStore';

export class UpdateCustomerStore {

  @observable fetching = false;
  @observable dataSource = undefined;

  @action
  setFetching = (fetching) => {
    this.fetching = fetching
  }


  @action
  updateUserInfo = (data) => {
    this.fetching = true;

    return authRequest
      .put(apiUrl.UPDATE_INFORMATION_URL, data).then(action((result) => {
        return meStore.fetchMe();
      })).catch(action(e => {
        errorMessage(e)
      })).finally(action(() => {
        this.fetching = false;
      }));
  }

}

export default new UpdateCustomerStore()