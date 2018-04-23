import {action, observable} from 'mobx';
import {authRequest, errorMessage, successMessage} from '../request';
import apiUrl from "../config/apiUrl";
import ObjectPath from 'object-path';

export class UpdateRouteStore {

  @observable fetching = false;
  @observable dataSource = {};
  @observable isUpdateMode = false;
  @observable isCreating = false;
  @observable isUpdating = false;
  @observable cityID = null;
  @observable districtIDs = [];

  @action
  onCityIDChange = (cityID) => {
    this.cityID = cityID;
    this.districtIDs = [];
  };

  @action
  create = (data) => {
    this.isCreating = true;
    return authRequest
      .post(apiUrl.CREATE_ROUTE_URL, data).then(action((result) => {
        successMessage('Tạo tuyến mới thành công');
        this.clear();
        return result
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isCreating = false;
      }));
  };

  @action
  update = (id, data) => {
    this.isUpdating = true;
    return authRequest
      .put(apiUrl.UPDATE_ROUTE_URL.replace(':id', id), data).then(action((result) => {
        successMessage('Cập nhật tuyến thành công');
        this.clear();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isUpdating = false;
      }));
  };

  @action
  fetch = (id) => {
    let query = `
      query Route($id: Int) {
        Route (ID: $id) {
            Code
            Name
            City {
              ID
            }
            Districts {
              FullName
              Name
              ID
            }
            Wards {
              ID
            }
            Hub {
              ID
              Name 
            }
        }
      }
    `;

    let variables = {id};

    this.fetching = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const key = result.data.Route;
        this.dataSource = key;
        let cityID = ObjectPath.get(key, 'City.ID');
        let districts = ObjectPath.get(key, 'Districts');
        this.onCityIDChange(cityID);
        this.districtIDs = (Array.isArray(districts) && districts.length > 0) ? districts.map(val => `${val.ID}`) : [];
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  clear = () => {
    this.dataSource = {};
    this.cityID = null;
    this.districtIDs = [];
  };

  @action
  onChangeMode = (value = false) => {
    this.isUpdateMode = value;
  };

}

export default new UpdateRouteStore();