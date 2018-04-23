import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";
import meStore from "../meStore";
import {filterDateTime, setDefaultDate} from "../../helpers/utility";

export class EventStatusStatisticStore {

  @observable dataSource = {};
  @observable fetching = false;

  totalValue = (data, arrayKey) => {
    let total = 0;
    if (data) {
      arrayKey.forEach(val => {
        if (data[val]) {
          total += data[val];
        }
      })
    }
    return total;
  };

  @action
  fetch = () => {
    let createdDate = setDefaultDate('CreatedFrom', 'CreatedTo');
    let query = `
        query EventStatusStatistics($HubID: Int, $HubIDs: [Int], $CreatedFrom: DateTime${filterDateTime(createdDate.CreatedFrom)}, $CreatedTo: DateTime${filterDateTime(createdDate.CreatedTo)}) {
          EventStatusStatistics(HubID: $HubID, HubIDs: $HubIDs, CreatedFrom: $CreatedFrom, CreatedTo: $CreatedTo) {
            DamagesProduct
            ExcessWeight
            HandOver
            LostProduct
            MistakeProduct
            ReDelivery
            RePickup
            ReReturn
            WaitingForPickingListCreating
            WaitingProduct
            WrongProduct
          }
          PickingLists(Status: 100, DestHubID: $HubID) {
            TotalOfItems
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
        let keys = result.data.EventStatusStatistics;
        let pickingLists = result.data.PickingLists;
        if (keys) {
          keys.OrdersConfirmation = this.totalValue(keys, ['ReDelivery', 'RePickup', 'ReReturn']);
          keys.OrdersComplaint = this.totalValue(keys, ['DamagesProduct', 'ExcessWeight', 'LostProduct', 'MistakeProduct', 'WrongProduct']);
        }
        this.dataSource = {
          ...keys,
          PickingLists: pickingLists.TotalOfItems || 0
        };
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

}

export default new EventStatusStatisticStore();