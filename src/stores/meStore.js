import {action, observable} from "mobx";
import {authRequest, errorMessage, successMessage} from '../request';

import apiUrl from '../config/apiUrl';

export class MeStore {

  @observable loading = false;
  @observable isChangingPrimaryHub = false;
  @observable primaryHubID = 0;
  @observable isChangePassWord = false;
  @observable current = undefined;
  @observable statusCode = undefined;

  @action
  setLoading = (loading) => {
    this.loading = loading
  }

  getInfo() {
    return this.current
  }

  @action
  forgetUser() {
    this.current = undefined;
    this.statusCode = undefined;
  }

  isLogin() {
    return !this.current;
  }

  getUserID = () => {
    return this.current ? this.current.ID : undefined;
  }

  hubs = () => {
    return this.current ? this.current.Hubs : undefined;
  }

  scannerKey = () => {
    return this.current ? this.current.ScannerKey : undefined;
  }

  getName = () => {
    return this.current ? this.current.Name : undefined;
  }

  getHubIDs = () => {
    return (this.current && this.current.Hubs) ? this.current.Hubs.map(val => val.ID) : [];
  };

  @action
  setScannerKey = (key) => {
    this.loading = true;
    return authRequest
      .put(apiUrl.UPDATE_STAFF_SCANNER_KEY_URL.replace(':id', this.current.ID), {ScannerKey: key}).then(action((result) => {
        console.log(result);
        this.current.ScannerKey = key;

      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.loading = false;
      }));
  }

  @action
  setPrimaryHub = (hubID) => {
    this.isChangingPrimaryHub = true;
    return authRequest
      .put(apiUrl.UPDATE_STAFF_PRIMARY_HUB_URL.replace(':id', this.current.ID), {ID: hubID}).then(action((result) => {
        console.log(result);

        this.primaryHubID = hubID;
      })).catch(action(e => {
        errorMessage(e);
        throw  e;
      })).finally(action(() => {
        this.isChangingPrimaryHub = false;
      }));
  }

  getCurrentHub = () => {
    if (window.localStorage.getItem('hubPrimaryID') === '0') {
      return null;
    }
    let Hubs = this.hubs() || [];
    let hubPrimary = {};
    if (Hubs && Hubs.length > 0) {
      hubPrimary = Hubs.find((val) => val.Primary === true);
      if (!hubPrimary) {
        hubPrimary = Hubs[0];
      }
    }
    return hubPrimary.ID || 0;
  }

  @action
  resetPassword = (data) => {
    this.isChangingPrimaryHub = true;

    return authRequest
      .put(apiUrl.RESET_PASSWORD_URL, data).then(action((result) => {
        successMessage('Đổi mật khẩu thành công')
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isChangingPrimaryHub = false;
      }));
  }

  fetchMe() {

    this.setLoading(true)
    let query = `
            query getMe {
                Me {
                  ID
                  Name
                  Phone
                  Email
                  ScannerKey
                  Hubs {
                    ID
                    DisplayName
                    Primary
                  }
                  Permissions
                  Roles
                  DefaultInventoryID
                }
            }
        `;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query
      }).then(action((result) => {
        this.current = result.data.Me;
        console.log(this.current);
        return result;
      })).catch(action(err => {
        if (err && err.response && err.response.status) {
          this.statusCode = err.response.status
        }
        throw err;
      })).finally(action(() => {
        this.loading = false;
      }));
  }

}

export default new MeStore()