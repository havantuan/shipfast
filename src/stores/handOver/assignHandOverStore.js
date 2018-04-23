import {action, observable} from "mobx";
import {authRequest, errorMessage, successMessage} from '../../request/index';
import apiUrl from '../../config/apiUrl';
import {checkExist, convertToPagination, convertToSorter} from "../../helpers/utility";
import {defaultPagination} from "../../config";
import {message} from 'antd';
import meStore from "../meStore";
import ObjectPath from 'object-path';
import eventStatusStatisticStore from "../statistics/eventStatusStatisticStore";

export class AssignHandOverStore {

  @observable fetching = false;
  @observable dataSource = [];
  @observable filter = {};
  @observable order = [];
  @observable pagination = defaultPagination;
  @observable isConfirmingHandOver = false;
  @observable handOverConfirmed = false;
  @observable isConfirmingOverWeight = false;
  @observable checkedList = {};
  @observable indeterminate = false;
  @observable codesSelected = [];
  @observable checkAll = false;
  @observable isAssign = false;
  @observable codesTable = [];
  @observable label = [];
  statuses = {};
  overWeightOrderCode = null;
  @observable tableData = [];
  @observable isFetchingTable = false;
  @observable codeConfirmSuccess = null;

  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order)
  };

  @action
  resetValues = () => {
    this.checkedList = {};
    this.indeterminate = false;
    this.codesSelected = [];
    this.checkAll = false;
    this.isAssign = false;
  };

  @action
  handleTableChange = (pagination, filters, sort) => {
    this.pagination = convertToPagination(pagination, this.pagination);
    this.order = convertToSorter(sort);
    this.resetValues();
    this.reload();
  };

  @action
  onFilter = (staffID) => {
    if (!isNaN(staffID)) {
      this.filter = {
        StaffID: +staffID
      };
      this.pagination = defaultPagination;
      this.reload();
    }
    else {
      this.filter = {
        StaffID: null
      };
    }
    this.dataSource = [];
    this.resetValues();
    this.codesTable = [];
    this.label = [];
    this.statuses = [];
    this.codeConfirmSuccess = null;
  };

  @action
  fetch = (filter, pagination, order = []) => {
    let query = `
      query Orders($Page: Int, $Limit: Int, $Order: [Sort], $StaffID: Int, $ActionType: EnumActionType, $HubID: Int) {
        Orders(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, StaffID: $StaffID, ActionType: $ActionType, HubID: $HubID) {
          Items {
            Code
            StatusCode {
              Code
              Name
              Color
            }
          }
          Pager {
            Limit
            NumberOfPages
            Page
            TotalOfItems
          }
        }
      }
    `;
    let {pageSize, current} = pagination;

    let variables = {
      Page: current || null,
      Limit: pageSize || null,
      Order: order || null,
      HubID: meStore.getCurrentHub()
    };

    if (filter) {
      let {StaffID} = filter;
      variables.StaffID = StaffID || null;
      variables.ActionType = 'HandOver';
    }
    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Orders;
        this.dataSource = data.Items.filter(val => {
          return checkExist(this.codesTable, val.Code) === false;
        });
        this.pagination = {
          ...pagination,
          total: data.Pager.TotalOfItems
        };
        this.order = order;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  fetchOrdersByCodes = (Codes) => {
    let query = `
        query OrdersByCodes($Codes: [String]) {
          Orders(Codes: $Codes) {
            Items {
              Code
              HandOverStatusCodes {
                Code
                Name
                Color
              }
              StatusCode {
                Code
                Color
                Name
              }
              TaskType {
                Code
                Name
                Value
              }
              NetWeight
            }
          }
        }
    `;
    let variables = {Codes};
    this.isFetchingTable = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Orders;
        this.dataProcessing(data.Items);
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isFetchingTable = false;
      }));
  };

  @action
  dataProcessing = (dataSource) => {
    let check = dataSource.some(val => {
      return val.HandOverStatusCodes.length === 0
    });
    if (check) {
      let items = dataSource.filter(val => {
        return val.HandOverStatusCodes.length === 0
      });
      items.forEach(val => {
        message.error(`Trạng thái đơn hàng ${val.Code} không hợp lệ`);
      });
      let tmp = dataSource.filter(val => {
        return val.HandOverStatusCodes.length > 0
      });
      dataSource = [...tmp];
    }
    let data = [];
    let labelIndex = [];
    let Delivery = dataSource.filter(val => {
      return val.TaskType.Code.toUpperCase() === "DELIVERY";
    });
    let Pickup = dataSource.filter(val => {
      return val.TaskType.Code.toUpperCase() === "PICKUP";
    });
    let Return = dataSource.filter(val => {
      return val.TaskType.Code.toUpperCase() === "RETURN";
    });
    if (Delivery && Delivery.length > 0) {
      let label = [{Status: 'DELIVERY', Total: Delivery.length}];
      labelIndex = labelIndex.concat(data.length);
      data = data.concat(label, Delivery);
    }
    if (Pickup && Pickup.length > 0) {
      let label = [{Status: 'PICKUP', Total: Pickup.length}];
      labelIndex = labelIndex.concat(data.length);
      data = data.concat(label, Pickup);
    }
    if (Return && Return.length > 0) {
      let label = [{Status: 'RETURN', Total: Return.length}];
      labelIndex = labelIndex.concat(data.length);
      data = data.concat(label, Return);
    }
    this.tableData = data;
    this.label = labelIndex;
    this.codeConfirmSuccess = null;
  };

  @action
  confirmHandOverForStaff = (staffID, data) => {
    this.isConfirmingHandOver = true;
    this.handOverConfirmed = false;
    return authRequest
      .post(apiUrl.HANDOVER_CONFIRM_URL.replace(':id', staffID), data).then(action((result) => {
        this.handOverConfirmed = true;
        this.tableData = [];
        this.codeConfirmSuccess = ObjectPath.get(result, 'data.Code', null);
        successMessage('Xác nhận bàn giao đơn hàng thành công');
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isConfirmingHandOver = false;
      }));
  };

  @action
  confirmOrderOverWeight = (code) => {
    this.isConfirmingOverWeight = true;
    return authRequest
      .put(apiUrl.CONFIRM_ORDER_OVER_WEIGHT_URL.replace(':code', code)).then(action((result) => {
        successMessage(`Đã xác nhận đơn hàng ${code} vượt cân`);
        eventStatusStatisticStore.fetch();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isConfirmingOverWeight = false;
        let tmp = this.tableData.filter((val) => val.Code !== this.overWeightOrderCode);
        let label = [...this.label];
        let index = 0;
        tmp.forEach(val => {
          if (val.Status) {
            index++;
            if (val.Status.toUpperCase() === 'PICKUP') {
              val.Total -= 1;
              if (label[index]) {
                label.forEach((e, i) => {
                  if (i >= index) {
                    label[i] -= 1;
                  }
                })
              }
            }
          }
        });
        this.tableData = tmp;
        this.label = label;
        this.overWeightOrderCode = null;
      }));
  };

  @action
  clear = () => {
    this.dataSource = [];
    this.tableData = [];
    this.filter = {};
    this.checkedList = {};
    this.indeterminate = false;
    this.codesSelected = [];
    this.checkAll = false;
    this.isAssign = false;
    this.codesTable = [];
    this.pagination = defaultPagination;
    this.codeConfirmSuccess = undefined;
  };

  @action
  addCodes = (codes) => {
    if (codes && codes.length > 0) {
      let tmp = [...this.codesTable];
      codes.forEach(val => {
        if (!checkExist(this.codesTable, val)) {
          tmp.push(val);
        }
      });
      this.codesTable = tmp;
      this.fetchOrdersByCodes(this.codesTable);
      this.dataSource = this.dataSource.slice().filter(val => !checkExist(tmp, val.Code));
      this.resetValues();
    }
  };

  @action
  confirmStatus = () => {
    this.addCodes(this.codesSelected);
  };

  @action
  onChange = (checked, value, index) => {
    let tmp = {...this.checkedList};
    tmp[index] = checked;
    let count = 0;
    Object.keys(tmp).forEach(index => {
      if (tmp[index]) count++;
    });
    this.checkedList = tmp;
    this.indeterminate = !!count && (count < this.dataSource.length);
    this.checkAll = count === this.dataSource.length;
    this.isAssign = count !== 0;

    if (checkExist(this.codesSelected, value)) {
      this.codesSelected = this.codesSelected.filter(val => val !== value);
    }
    else {
      this.codesSelected = [...this.codesSelected, value];
    }
  };

  @action
  onCheckAllChange = (checked) => {
    let dataSource = {};
    this.dataSource.forEach((e, i) => {
      return dataSource[i] = true;
    });
    let fullCodes = this.dataSource.map(item => item.Code);
    this.checkedList = checked ? dataSource : {};
    this.indeterminate = false;
    this.checkAll = checked;
    this.isAssign = checked;
    this.codesSelected = checked ? fullCodes : [];
  };

  @action
  handOver = (values) => {
    let orderCode = values.Code.toUpperCase();
    this.dataSource = this.dataSource.filter(val => {
      return val.Code.toUpperCase() !== orderCode
    });
    this.codesSelected = this.codesSelected.filter(val => {
      return val.toUpperCase() !== orderCode
    });
    this.addCodes([values.Code]);
  };

  @action
  deleteRowsTable = (code) => {
    this.codesTable = this.codesTable.slice().filter(val => val !== code);
  };

  @action
  rejectHandOver = (code, type) => {
    let tmp = this.tableData.filter(val => {
      return val.Code !== code
    });
    let label = [...this.label];
    let index = 0;
    tmp.forEach(val => {
      if (val.Status) {
        index++;
        if (val.Status.toUpperCase() === type.toUpperCase()) {
          val.Total -= 1;
          if (label[index]) {
            label.forEach((e, i) => {
              if (i >= index) label[i] -= 1
            })
          }
        }
      }
    });
    this.tableData = tmp;
    this.label = label;
    this.deleteRowsTable(code);
  };

  @action
  handleConfirmHandOver = () => {
    let data = this.tableData.filter(val => {
      return val.Total === undefined && val.Status === undefined
    });
    let entries = data.map(val => {
      return {
        OrderCode: val.Code,
        StatusCode: this.statuses[val.Code]
      }
    });
    let staffID = this.filter.StaffID;
    this.confirmHandOverForStaff(staffID, {
      Entries: entries,
      HubID: meStore.getCurrentHub()
    });
  };

  @action
  handleConfirmOverWeight = (orderCode) => {
    this.overWeightOrderCode = orderCode;
    this.confirmOrderOverWeight(orderCode);
  };

}

export default new AssignHandOverStore();