import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";
import meStore from "../meStore";
import {filterDateTime, setDefaultDate} from "../../helpers/utility";

export class TaskStatisticStore {

  @observable dataSource = {};
  @observable fetching = false;

  @action
  fetch = () => {
    let createdDate = setDefaultDate('CreatedFrom', 'CreatedTo');
    let query = `
        query TaskStatistics($HubID: Int, $HubIDs: [Int], $CreatedFrom: DateTime${filterDateTime(createdDate.CreatedFrom)}, $CreatedTo: DateTime${filterDateTime(createdDate.CreatedTo)}) {
          TaskStatistics(HubID: $HubID, HubIDs: $HubIDs, CreatedFrom: $CreatedFrom, CreatedTo: $CreatedTo) {
            TotalDelivery
            TotalDeliveryWaittingDelivery
            TotalDeliveryWaittingProcess
            TotalPickup
            TotalPickupWaittingPickup
            TotalPickupWaittingProcess
            TotalReturn
            TotalReturnWaittingProcess
            TotalReturnWaittingReturn
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
        this.dataSource = result.data.TaskStatistics;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

}

export default new TaskStatisticStore();