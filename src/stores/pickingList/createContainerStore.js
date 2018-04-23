import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../../request';
import apiUrl from '../../config/apiUrl';
import {checkExist} from '../../helpers/utility';
import {successMessage} from "../../request/utils";
import meStore from "../meStore";
import {message} from 'antd';

export class CreateContainerStore {

  @observable fetching = false;
  @observable dataSource = [];
  @observable isFetchingCurrentRow = false;
  @observable isCreating = false;
  @observable tableData = [];
  @observable codesTable = [];

  @action
  fetch = () => {
    let query = `
        query PickingLists($InContainer: Boolean, $SrcHubID: Int) {
            PickingLists(InContainer: $InContainer, SrcHubID: $SrcHubID) {
                Items {
                  Code
                  CreatedAt {
                    Pretty
                  }
                  SourceHub {
                    Code
                  }
                }
            }
        }
    `;

    let variables = {
      InContainer: false,
      SrcHubID: meStore.getCurrentHub()
    };

    this.fetching = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const key = result.data.PickingLists;
        this.dataSource = key.Items;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  fetchPickingByCode = (Code) => {
    let query = `
        query PickingList($Code: String!) {
            PickingList(Code: $Code) {
                Code
                CreatedAt {
                  Pretty
                }
                SourceHub {
                  Code
                }
                Entries {
                  Order {
                    Code
                  }
                }
                Type {
                  Name
                }
                Weight
            }
        }
    `;
    let variables = {Code};

    this.isFetchingCurrentRow = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        let data = result.data.PickingList;
        this.tableData.push(data);
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isFetchingCurrentRow = false;
      }));
  };

  @action
  addPickingListCodes = (code) => {
    code = code.toUpperCase();
    if (checkExist(this.codesTable.slice(), code)) {
      message.error(`Quét mã bảng kê ${code} thất bại`);
      return;
    }
    this.codesTable = this.codesTable.concat(code);
    this.dataSource = this.dataSource.filter(val => val.Code.toUpperCase() !== code);
    this.fetchPickingByCode(code);
  };

  @action
  removePickingListCodes = (pickingList) => {
    if (pickingList === undefined) return;
    let code = pickingList.Code.toUpperCase();
    if (checkExist(this.codesTable.slice(), code) === false) {
      return;
    }
    this.codesTable = this.codesTable.filter(val => val !== code);
    this.tableData = this.tableData.filter(val => val.Code.toUpperCase() !== code);
    this.dataSource.push(pickingList);
  };

  @action
  create = (data) => {
    this.isCreating = true;
    return authRequest
      .post(apiUrl.CREATE_CONTAINER_URL, data).then(action((result) => {
        this.codesTable = [];
        this.tableData = [];
        successMessage('Đóng chuyến thư thành công');
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isCreating = false;
      }));
  };

}

export default new CreateContainerStore();