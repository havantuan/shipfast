import {action, computed, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";
import {filterDateTime, setDefaultDate} from "../../helpers/utility";
import moment from "moment";

export class UsersStatisticsByDateStore {

  @observable dataSource = [];
  @observable fetching = false;
  @observable filter = {};

  @computed
  get timeSelected() {
    let {StartTime, EndTime} = this.filter;
    if (StartTime && EndTime) {
      return [StartTime, EndTime];
    }
  }

  @action
  onChangeTime = (time) => {
    this.filter = {
      StartTime: time[0],
      EndTime: time[1]
    };
    return this.reload();
  };

  @action
  fetchByTimeDefault = () => {
    this.filter = setDefaultDate('StartTime', 'EndTime');
    return this.reload();
  };

  @action
  reload = () => {
    return this.fetch(this.filter);
  };

  @action
  fetch = (filter) => {
    let query = `
      query UsersStatisticsByDate($StartTime: DateTime${filterDateTime(filter.StartTime)}, $EndTime: DateTime${filterDateTime(filter.EndTime)}) {
          UsersStatisticsByDate(StartTime: $StartTime, EndTime: $EndTime) {
            Count
            Time
          }
      }
    `;

    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query
      }).then(action((result) => {
        this.dataSource = result.data.UsersStatisticsByDate;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  clear = () => {
    this.dataSource = [];
    this.filter = {};
  };

}

export default new UsersStatisticsByDateStore();