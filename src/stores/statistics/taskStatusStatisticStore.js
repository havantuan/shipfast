import {action, computed, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";
import meStore from "../meStore";
import {filterDateTime, setDefaultDate} from "../../helpers/utility";
import moment from "moment";

export class TaskStatusStatisticStore {

  @observable dataSource = {};
  @observable fetching = false;
  @observable createdDate = {
    ...setDefaultDate('CreatedFrom', 'CreatedTo')
  };

  @computed
  get createdDateSelected() {
    let {CreatedFrom, CreatedTo} = this.createdDate;
    if (CreatedFrom && CreatedTo) {
      return [CreatedFrom, CreatedTo];
    }
  }

  @action
  onChangeCreatedDate = (time) => {
    this.createdDate = {
      CreatedFrom: time[0],
      CreatedTo: time[1]
    };
    return this.fetch();
  };

  @action
  fetch = () => {
    let {CreatedFrom, CreatedTo} = this.createdDate;
    let query = `
        query TaskStatusStatistics($HubID: Int, $HubIDs: [Int], $CreatedFrom: DateTime${filterDateTime(CreatedFrom)}, $CreatedTo: DateTime${filterDateTime(CreatedTo)}) {
          TaskStatusStatistics(HubID: $HubID, HubIDs: $HubIDs, CreatedFrom: $CreatedFrom, CreatedTo: $CreatedTo) {
            Count
            StatusCode {
              Code
              Color
              Name
            }
          }
        }
    `;

    let variables = {
      HubID: meStore.getCurrentHub(),
      HubIDs: meStore.getCurrentHub() ? null : meStore.getHubIDs()
    };

    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        this.dataSource = result.data.TaskStatusStatistics;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

}

export default new TaskStatusStatisticStore();