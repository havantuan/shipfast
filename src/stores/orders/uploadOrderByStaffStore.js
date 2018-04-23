import {action, observable} from "mobx";
import apiUrl from "../../config/apiUrl";
import appStore from "../appStore";
import {authRequest, errorMessage} from '../../request';
import ObjectPath from 'object-path';

export class UploadOrderByStaffStore {
  @observable isShowModal = false;
  @observable fetching = false;
  @observable uploading = false;
  @observable fileList = [];
  @observable response = undefined;
  @observable errors = undefined;
  @observable importConfig = {};
  @observable selectedRowKeys = [];
  @observable isImporting = false;
  @observable importResponse = undefined;
  @observable userID = undefined;
  @observable inventory = undefined;

  @action
  showModal = () => {
    this.isShowModal = true;
  };

  @action
  cancelModal = () => {
    this.isShowModal = false;
  };

  @action
  cancelUpload = () => {
    this.isShowModal = false;
    this.fileList = [];
    this.response = undefined;
    this.errors = undefined;
  };

  @action
  removeFile = (file) => {
    this.fileList = [];
  };

  @action
  beforeUpload = (file) => {
    this.fileList = [file];
    this.response = undefined;
    this.errors = undefined;
    this.importResponse = undefined;
    this.handleUploadByStaff();
  };

  @action
  fetch = () => {
    this.fetching = true;
    return authRequest
      .get(apiUrl.IMPORT_CONFIG_URL).then(action((result) => {
        this.importConfig = ObjectPath.get(result, 'data.CustomerOrder', {});
        return result
      })).catch(action(e => {
        errorMessage(e);
        throw  e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  onSelectChange = (selectedRowKeys) => {
    this.selectedRowKeys = selectedRowKeys;
  };

  @action
  handleUploadByStaff = () => {
    const formData = new FormData();
    if (this.fileList.slice().length === 0) {
      return;
    }
    formData.append('file', this.fileList[0]);
    // this.fileList.slice().forEach((file) => {
    //   formData.append('files[]', file);
    // });
    this.uploading = true;

    const accessToken = appStore.token;
    const token_type = 'Bearer';
    return fetch(apiUrl.STAFF_IMPORT_EXCEL_URL, {
      method: 'POST',
      headers: {
        Authorization: `${token_type} ${accessToken}`
      },
      body: formData
    }).then(res => {
      let statusCode = res.status;
      return res.json().then(json => {
        return {json, statusCode}
      })
    }).then(data => {
      if (data.statusCode >= 200 && data.statusCode <= 399) {
        this.response = data.json ? data.json.data : null;
        return data.json
      }
      if (data.statusCode === 401) {
        appStore.setToken(null);
      }
      throw data;
    }).catch(err => {
      // errorMessage(err);
      if (err && err.json && err.json.errors) {
        this.errors = err.json.errors;
      }
      throw err;
    }).finally(action(() => {
      this.fileList = [];
      this.uploading = false;
    }));
  };

  @action
  handleSave = (values) => {
    let data = this.selectedRowKeys.map(val => {
      return this.response[val]
    });
    this.importOrderJSONByStaff({
      ...values,
      Orders: data,
      UserID: this.userID
    });
  };

  @action
  importOrderJSONByStaff = (data) => {
    console.log('%c order json...', 'background: #00b33c; color: #fff;', data);
    this.isImporting = true;
    return authRequest
      .post(apiUrl.STAFF_IMPORT_ORDER_JSON_URL, data).then(action((result) => {
        console.log('%c result.data', 'background: #00b33c; color: #fff;', result.data);
        this.importResponse = result.data;
        this.response = this.response.filter((val, idx) => this.selectedRowKeys.slice().indexOf(idx) === -1);
        this.selectedRowKeys = [];
        return result
      })).catch(action(e => {
        errorMessage(e);
        throw  e;
      })).finally(action(() => {
        this.isImporting = false;
      }));
  };

  @action
  onChangeUserID = (userID) => {
    this.clear();
    this.userID = userID;
  };

  @action
  onChangeInventory = (value) => {
    this.inventory = value;
  };

  @action
  clear = () => {
    this.fileList = [];
    this.response = undefined;
    this.errors = undefined;
    this.importConfig = {};
    this.selectedRowKeys = [];
    this.importResponse = undefined;
    this.userID = undefined;
    this.inventory = undefined;
  };

}

export default new UploadOrderByStaffStore();