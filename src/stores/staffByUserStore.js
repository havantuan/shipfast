import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../request';
import apiUrl from '../config/apiUrl';
import routerStore from "./routerStore";
import routerSystemConfig from "../config/routerSystem";

export class StaffByUserStore {

  @observable fetching = false;
  @observable isCreating = false;
  @observable isUpdateMode = false;
  @observable isUpdating = false;
  @observable stepIndex = 0;
  @observable temporaryData = {};
  @observable fetchingSingleData = false;
  @observable singleData = {};

  @action
  update = (id, data) => {
    this.isUpdating = true;
    return authRequest
      .put(apiUrl.UPDATE_STAFF_URL.replace(':id', id), data).then(action((result) => {
        routerStore.push(routerSystemConfig.staff);
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isUpdating = false;
      }));
  };

  @action
  create = (id, data) => {
    this.isCreating = true;
    return authRequest
      .post(apiUrl.CREATE_STAFF_FROM_USER_URL.replace(':id', id), data).then(action((result) => {
        routerStore.push(routerSystemConfig.staff);
        return result
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isCreating = false;
      }));
  };

  @action
  fetchByID = (id) => {
    let query = `
        query Staff($id: Int) {
          Staff (ID: $id) {
            Email
            Address
            Hubs {
              Address
              Code
              City {
                Code
                ID
                Name
              }
              DisplayName
              ID
              Name
            }
            ID
            IDCard {
              DateOfIssue
              IDNumber
              PlaceOfIssue
            }
            Name
            Phone
            StudentCard {
              DateOfIssue
              IDNumber
              PlaceOfIssue
            }
            Vehicle {
              NumberPlate
              Type {
                Code
                Name
                Value
              }
              Weight
            }
          }
        }
    `;
    let variables = {id};

    this.fetchingSingleData = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Staff;
        this.singleData = data;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetchingSingleData = false;
      }));
  };

  @action
  setUpdateMode = (isUpdate = true) => {
    this.isUpdateMode = isUpdate;
  };

  @action
  onNextStep = () => {
    this.stepIndex = this.stepIndex + 1;
  };

  @action
  onPrevStep = () => {
    this.stepIndex = this.stepIndex > 1 ? this.stepIndex - 1 : 0;
  };

  @action
  onTemporaryDataChange = (data = {}) => {
    this.temporaryData = {
      ...this.temporaryData,
      ...data
    };
  };

  @action
  clearData = () => {
    if (this.isUpdateMode) {
      this.singleData = {};
      this.temporaryData = {};
      this.stepIndex = 0;
    }
  };

}

export default new StaffByUserStore()