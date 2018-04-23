import {action, observable} from "mobx";
import {authRequest, errorMessage, successMessage} from '../../request';
import apiUrl from '../../config/apiUrl';
import grantTaskStore from "./grantTaskStore";
import ObjectPath from 'object-path';

export class TaskAssignGroupStore {

  @observable fetching = false;
  @observable dataSource = [];
  @observable isConfirming = false;
  @observable assignCode = null;
  @observable label = [];
  @observable taskCodes = [];

  @action
  fetch = (staffID) => {
    let query = `
        query TaskAssignGroup($StaffID: Int!) {
            TaskAssignGroup(StaffID: $StaffID) {
                Pickup {
                    Address
                    Code
                    CustomerName
                    CustomerPhone
                    StaffCode
                    TotalWeight
                    Orders {
                      Code
                      NetWeight
                      Receiver {
                        AccountReceivable
                      }
                    }
                    ExpiredAt{
                      Deadline
                      ISO
                    }
                    StatusCode{
                      Name
                      Code
                      Color
                    }
                }
                Return {
                    Address
                    Code
                    CustomerName
                    CustomerPhone
                    StaffCode
                    TotalWeight
                    Orders{
                      Code
                      NetWeight
                      Receiver {
                        AccountReceivable
                      }
                    }
                    ExpiredAt{
                      Deadline
                      ISO
                    }
                    StatusCode{
                      Name
                      Code
                      Color
                    }
                }
                Delivery {
                    Address
                    Code
                    CustomerName
                    CustomerPhone
                    StaffCode
                    TotalWeight
                    Orders{
                      Code
                      NetWeight
                      Receiver {
                        AccountReceivable
                      }
                    }
                    ExpiredAt{
                      Deadline
                      ISO
                    }
                    StatusCode{
                      Name
                      Code
                      Color
                    }
                }
            }
        }
    `;

    let variables = {StaffID: staffID};

    this.fetching = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const key = result.data.TaskAssignGroup;
        let dataSource = key;
        // ------
        let data = [];
        let labelIndex = [];
        let taskCodes = [];
        if (dataSource) {
          Object.keys(dataSource).forEach(key => {
            if (dataSource[key].length > 0) {
              let label = [{status: key, total: dataSource[key].length}];
              labelIndex = labelIndex.concat(data.length);
              data = data.concat(label, dataSource[key]);
              let codes = dataSource[key].map(val => val.Code);
              taskCodes = taskCodes.concat(codes);
            }
          });
        }
        this.dataSource = data;
        this.label = labelIndex;
        this.taskCodes = taskCodes;
        this.assignCode = null;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  clearData = () => {
    this.dataSource = [];
  };

  @action
  taskAssignConfirm = (id, data) => {
    this.isConfirming = true;
    let staffID = grantTaskStore.staffID;
    return authRequest
      .post(apiUrl.TASK_ASSIGN_CONFIRM_URL.replace(':id', id), data).then(action((result) => {
        successMessage('Đã giao việc cho nhân viên');
        this.fetch(staffID);
        this.assignCode = ObjectPath.get(result, 'data.Code');
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isConfirming = false;
      }));
  };

}

export default new TaskAssignGroupStore();