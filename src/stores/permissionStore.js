import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../request/index';
import apiUrl from "../config/apiUrl";
import roleStore from "./roleStore";

export class PermissionStore {

  @observable dataSource = [];
  @observable fetching = false;
  @observable isUpdating = false;
  @observable selectedRowKeys = [];

  @action
  onSelectedChange = (rowKeys) => {
    this.selectedRowKeys = rowKeys;
  };

  @action
  fetch = () => {
    let query = `
    {
      Permissions {
        Name
        ID
        Code
      }
    }
    `;

    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query
      }).then(action((result) => {
        this.dataSource = result.data.Permissions;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  grantPermissionByRoleID = (id) => {
    this.isUpdating = true;
    let IDs = this.selectedRowKeys;
    return authRequest
      .put(apiUrl.GRANT_PERMISSION_URL.replace(':id', id), {IDs}).then(action((result) => {
        roleStore.cancelModal();
        roleStore.fetch();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isUpdating = false;
      }));
  };

}

export default new PermissionStore();