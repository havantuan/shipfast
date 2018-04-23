import {action, observable, computed} from "mobx";
import {authRequest, errorMessage} from '../request';
import apiUrl from '../config/apiUrl';
import {defaultPagination} from '../config';
import {convertToPagination, filterDateTime, setDefaultDate} from '../helpers/utility';
import moment from "moment";
export class LetterContainerStore {

  @observable fetching = false;
  @observable dataSource = [];
  @observable items = undefined;
  @observable filter = {
    ...setDefaultDate('CreatedFrom', 'CreatedTo')
  };
  @observable pagination = defaultPagination
  @observable order = [];
  @action
  clear = () => {
    this.filter = {
      ...setDefaultDate('CreatedFrom', 'CreatedTo')
    };
    this.pagination = defaultPagination;
    this.dataSource = [];
    this.order = [];
  }
  @computed
  get timeSelected() {
    let {CreatedFrom, CreatedTo} = this.filter;
    if (CreatedFrom && CreatedTo) {
      return [CreatedFrom, CreatedTo];
    }
  }

  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order)
  }

  @action
  handleTableChange = (pagination, filters, sort) => {
    this.pagination = convertToPagination(pagination, this.pagination);
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
        query DataSources($Page: Int = 1, $Limit: Int = 10, $Code: String,$VehicleNumberPlate: String, $CreatedTo: DateTime${filterDateTime(filter.CreatedTo)}, $CreatedFrom: DateTime${filterDateTime(filter.CreatedFrom)}) {
            Containers(Pageable: {Page: $Page, Limit: $Limit}, Code: $Code, VehicleNumberPlate: $VehicleNumberPlate, CreatedTo: $CreatedTo, CreatedFrom :$CreatedFrom) {
                Items {
                    ID
                    Code    
                    Weight
                    CreatedAt {      
                      Pretty
                    }
                    DestinationHub {
                        Code
                      Name
                      Phone
                    }
                    SourceHub {
                      Code
                      Name
                      Phone
                    }
                    Status {
                       Code
                      Color
                      Name
                    }
                    PickingLists {
                      Code           
                    }
                    VehicleNumberPlates
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
    };
    if (filter) {
      let {Code, VehicleNumberPlate} = filter;
      variables.Code = Code || null;
      variables.VehicleNumberPlate = VehicleNumberPlate || null;
    }
    this.fetching = true
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Containers;
        this.dataSource = data.Items;
        this.pagination.total = data.Pager.TotalOfItems;
        this.pagination = pagination;
        this.order = order;
        this.filter = filter;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  }

}

export default new LetterContainerStore()