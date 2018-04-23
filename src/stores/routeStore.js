import {action, observable} from 'mobx';
import {defaultPagination} from "../config";
import {authRequest, errorMessage} from '../request';
import apiUrl from "../config/apiUrl";
import {convertToPagination, convertToSorter} from "../helpers/utility";

export class RouteStore {

  @observable pagination = defaultPagination;
  @observable filter = {};
  @observable sorter = [];
  @observable fetching = false;
  @observable dataSource = [];
  @observable cityID = null;

  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order);
  };

  clear() {
    this.filter = {};
    this.pagination = defaultPagination;
    this.dataSource = [];
    this.order = [];
  }

  @action
  onCityIDChange = (cityID) => {
    this.cityID = cityID;
  };

  @action
  handleTableChange = (pagination, filters, sort) => {
    this.pagination = convertToPagination(pagination, this.pagination);
    this.sorter = convertToSorter(sort);
    this.reload();
  };

  @action
  onFilter = (filter) => {
    this.filter = filter;
    this.pagination = defaultPagination;
    this.reload();
  };

  @action
  fetch = (filter, pagination, order = []) => {
    let query = `
        query Routes($Page: Int = 1, $Limit: Int = 10, $Order: [Sort], $Query: String, $CityID: Int, $DistrictID: Int, $WardID: Int, $HubID: Int) {
            Routes(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, Query: $Query, CityID: $CityID, DistrictID: $DistrictID, WardID: $WardID, HubID: $HubID) {
                Items {
                  Code
                  Name
                  ID
                  Districts {
                    Name
                    Code
                  }
                  Wards {
                    Name
                    Code
                  }
                  Hub {
                    ID
                    DisplayName
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
    };
    if (filter) {
      let {Query, CityID, DistrictID, WardID, HubID} = filter;
      variables.Query = Query || null;
      variables.HubID = HubID || null;
      variables.CityID = CityID || null;
      variables.DistrictID = DistrictID || null;
      variables.WardID = WardID || null;
    }

    this.fetching = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const keys = result.data.Routes;
        this.dataSource = keys.Items;
        this.pagination = {
          ...pagination,
          total: keys.Pager ? keys.Pager.TotalOfItems : 0
        };
        this.filter = filter;
        this.order = order;
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
    this.pagination = defaultPagination;
    this.filter = {};
    this.sorter = [];
    this.cityID = null;
  };

}

export default new RouteStore();