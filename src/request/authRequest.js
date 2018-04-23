import qs from "qs";
import moment from "moment";
import appStore from '../stores/appStore';

import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import authStore from '../stores/authStore';

Promise.prototype.finally = function (cb) {
  const res = () => this;
  const fin = () => Promise.resolve(cb()).then(res);
  return this.then(fin, fin);
};
const superagent = superagentPromise(_superagent, global.Promise);

export class AuthRequest {

  getUrl(url) {
    let timeZone = decodeURIComponent(moment().format('Z'));
    return url + (url.indexOf('?') < 0 ? '?' : '&' ) + `TimeZone=${timeZone}`;
  }

  tokenPlugin = req => {
    if (appStore.token) {
      req.set('Authorization', `Bearer ${appStore.token}`);
      req.set('Accept', 'application/json');
    }
  };
  jsonContentType = req => {
    req.set('Content-Type', 'application/json');

  };

  handleErrors = err => {
    if (err && err.response && err.response.status) {

      console.log("handleErrors");
      let statusCode = err.response.status
      if (statusCode === 401 && appStore.token) {
        authStore.logout();
      } else if (statusCode === 504) {
        appStore.setPage504(true);
      } else {
        appStore.setPage504(false);
      }
    }
    return err;
  };

  responseBody = res => {
    appStore.setPage504(false);
    return res.body;
  };

  get = (url, data, params) => superagent
    .get(this.getUrl(url), {params: {data}})
    .use(this.tokenPlugin)
    .end(this.handleErrors)
    .then(this.responseBody);
  post = (url, data, params) => superagent
    .post(this.getUrl(url), data)
    .use(this.tokenPlugin)
    .use(this.jsonContentType)
    .end(this.handleErrors)
    .then(this.responseBody);
  postForm = (url, data, params) => superagent
    .post(this.getUrl(url), qs.stringify(data))
    .use(this.tokenPlugin)
    .end(this.handleErrors)
    .then(this.responseBody);
  put = (url, data, params) => superagent
    .put(this.getUrl(url), data)
    .use(this.tokenPlugin)
    .use(this.jsonContentType)
    .end(this.handleErrors)
    .then(this.responseBody);
  delete = (url, data, params) => superagent
    .del(this.getUrl(url), data)
    .use(this.tokenPlugin)
    .use(this.jsonContentType)
    .end(this.handleErrors)
    .then(this.responseBody)


}

const authRequest = new AuthRequest();
export {authRequest};