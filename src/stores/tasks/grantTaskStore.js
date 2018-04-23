import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../../request';
import apiUrl from '../../config/apiUrl';
import {defaultPagination} from '../../config';
import ObjectPath from 'object-path';
import {convertToPagination, convertToSorter} from '../../helpers/utility';
import {message} from 'antd';
import taskAssignGroupStore from "./taskAssignGroupStore";
import {successMessage} from "../../request/utils";
import meStore from "../meStore";

export class GrantTaskStore {

  @observable fetching = false;
  @observable dataSource = [];
  @observable currentRow = undefined;
  @observable isFetchingCurrentRow = false;
  @observable isFetchingRowID = 0;
  @observable filter = {};
  @observable pagination = defaultPagination;
  @observable order = [];
  @observable isGranting = false;
  @observable isCheckedAll = false;
  @observable checkedList = {};
  @observable indeterminate = false;
  @observable checkAll = false;
  codes = [];
  fullCodes = [];
  @observable isAssign = false;
  @observable staffID = null;

  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order)
  };

  resetValues = () => {
    this.checkedList = {};
    this.indeterminate = false;
    this.codes = [];
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
  onFilter = (filter) => {
    this.filter = filter;
    this.pagination = defaultPagination;
    return this.reload();
  };

  @action
  fetch = (filter, pagination, order = []) => {
    let query = `
      query Tasks($Page: Int = 1, $Limit: Int = 10, $Order: [Sort], $hubID: Int, $Query: String, $OrderCodeOrTaskCode: String, $CityID: Int, $DistrictID: Int, $WardID: Int, $StaffID: Int, $StatusCode: Int, $Type: EnumTaskType) {
          Tasks(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, HubID: $hubID,Query: $Query, OrderCodeOrTaskCode: $OrderCodeOrTaskCode, CityID: $CityID, DistrictID: $DistrictID, WardID: $WardID, StaffID: $StaffID, StatusCode: $StatusCode, Type: $Type) {
              Items {
                Address
                Code
                CreatedAt {
                  ISO
                  Pretty
                }
                Orders {
                  Code                       
                }
                StatusCode {
                  Name
                  Code
                }
                TotalWeight
                Type {
                  Code
                  Name
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
      Page: current,
      Limit: pageSize,
      Order: order || null,
      hubID: meStore.getCurrentHub(),
    };
    if (filter) {
      let {Query, CityID, DistrictID, WardID, StaffID, OrderCodeOrTaskCode, Type} = filter;
      variables.Query = Query || null;
      variables.OrderCodeOrTaskCode = OrderCodeOrTaskCode || null;
      variables.CityID = CityID || null;
      variables.DistrictID = DistrictID || null;
      variables.WardID = WardID || null;
      variables.StaffID = StaffID || null;
      variables.StatusCode = 100;
      variables.Type = Type || null;
    }

    this.fetching = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const codes = result.data.Tasks;
        this.dataSource = codes.Items;
        this.pagination = {
          ...pagination,
          total: ObjectPath.get(codes, 'Pager.TotalOfItems', 0)
        };
        this.order = order;
        //-----
        this.fullCodes = this.dataSource.map(val => val.Code);
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  handleGrantTask = () => {
    if (!this.staffID) {
      message.error('Vui lòng chọn nhân viên cần giao việc');
      return;
    }
    if (this.codes && this.codes.length === 0) {
      message.error('Vui lòng nhập mã công việc hoặc mã đơn hàng');
      return;
    }
    this.grantTaskByStaff(this.staffID, {Codes: this.codes});
  };

  @action
  grantTaskByStaff = (id, data) => {
    this.isGranting = true;
    return authRequest
      .put(apiUrl.GRANT_TASK_URL.replace(':id', id), data).then(action((result) => {
        successMessage('Đã giao việc cho nhân viên');
        this.resetValues();
        this.reload();
        taskAssignGroupStore.fetch(id);
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isGranting = false;
      }));
  };

  @action
  handleRejectTask = (codes) => {
    this.rejectTask(this.staffID, {Codes: codes});
  };

  @action
  rejectTask = (id, data) => {
    this.isGranting = true;
    return authRequest
      .put(apiUrl.REJECT_TASK_URL.replace(':id', id), data).then(action((result) => {
        successMessage('Đã hủy việc thành công');
        this.resetValues();
        this.reload();
        taskAssignGroupStore.fetch(id);
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isGranting = false;
      }));
  };

  @action
  onCheckAll = (checked) => {
    let dataSource = {};
    this.dataSource.forEach((e, i) => {
      dataSource[i] = true;
    });
    this.checkedList = checked ? dataSource : {};
    this.indeterminate = false;
    this.checkAll = checked;
    this.isAssign = checked;
    this.codes = checked ? this.fullCodes : [];
  };

  @action
  onChange = (checked, value, index) => {
    let tmp = {...this.checkedList};
    tmp[index] = checked;
    let count = 0;
    Object.keys(tmp).forEach(key => {
      if (tmp[key]) count++;
    });
    this.checkedList = tmp;
    this.indeterminate = !!count && (count < this.dataSource.length);
    this.checkAll = count === this.dataSource.length;
    this.isAssign = count !== 0;

    if (this.codes.some(item => item === value)) {
      this.codes = this.codes.filter(val => val !== value);
    }
    else {
      this.codes = [...this.codes, value];
    }
  };

  @action
  onChangeStaffID = (staffID) => {
    if (staffID) {
      this.staffID = staffID ? +staffID : null;
      taskAssignGroupStore.fetch(this.staffID);
    }
    else {
      this.staffID = null;
      taskAssignGroupStore.clearData();
    }
  }

}

export default new GrantTaskStore();