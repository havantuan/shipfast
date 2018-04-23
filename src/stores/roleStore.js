import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../request/index';
import apiUrl from "../config/apiUrl";
import staffStore from './staffStore';
import permissionStore from './permissionStore';
import ObjectPath from 'object-path';

export class RoleStore {

  @observable dataSource = [];
  @observable fetching = false;
  @observable isUpdating = false;
  @observable isShowModal = false;
  @observable selectedRowKeys = [];
  @observable currentRow = undefined;
  @observable isFetchingCurrentRow = false;
  @observable isFetchingRowID = 0;

  @action
  onSelectedChange = (rowKeys) => {
    this.selectedRowKeys = rowKeys;
  };

  clear() {
    this.filter = {};
    this.dataSource = []
  }

  @action
  fetch = () => {
    let query = `
    {
      Roles {
          Name
          ID
          Code
          Permissions {
              Name
              Code
              ID
          }
      }
    }
    `;

    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query
      }).then(action((result) => {
        this.dataSource = result.data.Roles;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  grantRoleByStaffID = (id) => {
    this.isUpdating = true;
    let IDs = this.selectedRowKeys;
    return authRequest
      .put(apiUrl.GRANT_ROLE_URL.replace(':id', id), {IDs}).then(action((result) => {
        staffStore.closeModal();
        staffStore.reload();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isUpdating = false;
      }));
  };

  @action
  showModal = (data) => {
    this.isShowModal = true;
    this.currentRow = data;
    this.isFetchingRowID = data ? data.ID : 0;
    let permissions = ObjectPath.get(data, 'Permissions', []);
    let permissionIDs = permissions.map(val => val.ID);
    permissionStore.onSelectedChange(permissionIDs);
  };

  @action
  cancelModal = () => {
    this.isShowModal = false;
    this.currentRow = null;
  };

}

export default new RoleStore();