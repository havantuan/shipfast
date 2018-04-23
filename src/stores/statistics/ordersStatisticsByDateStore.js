import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";
import {filterDateTime, onChangeDateTime} from "../../helpers/utility";

function defaultDate(defaultKey) {
  let time = onChangeDateTime(defaultKey, true);
  return {
    StartTime: time[0],
    EndTime: time[1]
  }
}

export class OrdersStatisticsByDateStore {

  @observable dataSource = [];
  @observable fetching = false;
  defaultKey = '7DaysAgo';
  @observable filter = {
    OrderStatisticsType: 'Create',
    ...defaultDate(this.defaultKey)
  };

  @action
  onChangeOrderStatisticsType = (value) => {
    this.onFilter({
      OrderStatisticsType: value
    })
  };

  @action
  reload = () => {
    this.fetch(this.filter);
  };

  @action
  onFilter = (filter) => {
    this.filter = {
      ...this.filter,
      ...filter
    };
    this.fetch(this.filter);
  };

  @action
  fetch = (filter) => {
    let query = `
      query OrdersStatisticsByDate($OrderStatisticsType: EnumOrderStatisticsType, $UserID: Int, $StartTime: DateTime${filterDateTime(filter.StartTime)}, $EndTime: DateTime${filterDateTime(filter.EndTime)}) {
          OrdersStatisticsByDate(OrderStatisticsType: $OrderStatisticsType, UserID: $UserID, StartTime: $StartTime, EndTime: $EndTime) {
            Count
            Time
          }
      }
    `;
    let variables = {};
    if (filter) {
      let {OrderStatisticsType, UserID} = filter;
      variables.OrderStatisticsType = OrderStatisticsType || null;
      variables.UserID = UserID || null;
    }

    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        this.dataSource = result.data.OrdersStatisticsByDate;
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

export default new OrdersStatisticsByDateStore();