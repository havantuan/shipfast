import {action, observable} from "mobx";
// import {requestToRestApi} from "../helpers/utility";
import {authRequest} from '../request';
import routerStore from './routerStore';
import {notification} from '../components'
import routerConfig from '../config/router';
import meStore from './meStore';
import apiUrl from '../config/apiUrl';
import appStore from './appStore';
import {WebSite} from '../helpers/WebSite';
import routerUserConfig from "../config/routerUser";
import routerSystemConfig from "../config/routerSystem";

export class AuthStore {

  @observable loading = false;

  @action
  login = (username, password) => {
    this.loading = false;
    authRequest
      .postForm(apiUrl.LOGIN, {
        client_id: 'test',
        client_secret: 'test',
        grant_type: 'password',
        username,
        password
      }).then(action(data => {

      window.localStorage.setItem('authentication', JSON.stringify(data));
      appStore.setToken(data.access_token);
      return meStore.fetchMe();
    })).then(action(data => {
      if (WebSite.IsKh()) {
        routerStore.push(routerUserConfig.listOrder)
      }
      else if (WebSite.IsSystem()) {
        routerStore.push(routerSystemConfig.Route)
      }
      else {
        routerStore.push(routerConfig.dashboard);
      }
      return data;
    })).catch(action(e => {
      this.errorNotification('Sai tài khoản hoặc mật khẩu.', e);
      throw e;
    })).finally(action(() => {
      this.loading = false;
    }));
  }

  @action
  forgotPassword = (data) => {
    this.loading = false;
    authRequest
      .put(apiUrl.FORGOT_PASSWORD_URL, data).then(action(data => {
      notification('success', 'Thành công', 'Đổi mật khẩu thành công.');
      routerStore.push(routerConfig.signIn);
    })).catch(action(e => {
      this.errorNotification('Sai tài khoản hoặc mật khẩu.', e);
      throw e;
    })).finally(action(() => {
      this.loading = false;
    }));
  }

  @action
  create = (data) => {
    this.loading = false;
    authRequest
      .post(apiUrl.CREATE_USER_URL, data).then(action(data => {
      notification('success', 'Thành công', 'Tạo tài khoản thành công.');
      routerStore.push(routerConfig.signIn);
    })).catch(action(e => {
      this.errorNotification('Tạo tài khoản thất bại.', e);
      throw e;
    })).finally(action(() => {
      this.loading = false;
    }));
  }

  @action
  errorNotification = (message, payload) => {
    if (payload && payload.json && payload.json.errors) {
      let {errors} = payload.json;
      errors.map(val =>
        notification('error', 'Thất bại', val.message)
      );
    }
    else {
      notification('error', 'Thất bại', message || 'Vui lòng thử lại sau');
    }
  };

  @action
  setLoading(loading) {
    this.loading = loading
  }

  @action
  logout() {
    appStore.setToken(undefined);
    return authRequest
      .get(apiUrl.REVOKE).finally(() => {
        meStore.forgetUser();
      });
  }

  refresh() {
    // return requestToRestApi(apiUrl.LOGIN, {
    //   client_id: 'test',
    //   client_secret: 'test',
    //   grant_type: 'refresh_token',
    //   refresh_token: meStore.refreshToken
    // })
  }
}

const authStore = new AuthStore();
export default authStore;