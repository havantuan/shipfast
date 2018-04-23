import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../../request';
import apiUrl from '../../config/apiUrl';
import {defaultPagination} from '../../config';
import ObjectPath from 'object-path';
import {convertToPagination, convertToSorter} from '../../helpers/utility';
import meStore from "../meStore";

export class PickingListStore {

  @observable fetching = false;
  @observable dataSource = [];
  @observable currentRow = undefined;
  @observable isFetchingCurrentRow = false;
  @observable fetchCurrentRowSuccess = false;
  @observable isFetchingRowID = 0;
  @observable filter = {};
  @observable pagination = defaultPagination;
  @observable order = [];

  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order)
  };

  @action
  handleTableChange = (pagination, filters, sort) => {
    this.pagination = convertToPagination(pagination, this.pagination);
    this.order = convertToSorter(sort);
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
      query PickingLists($Page: Int = 1, $Limit: Int = 10, $Order: [Sort], $SrcHubID: Int, $DestHubID: Int, $OrderCodeOrPickingListCode: String, $Status: Int, $Type: EnumPickingListType) {
          PickingLists(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, SrcHubID: $SrcHubID, DestHubID: $DestHubID, OrderCodeOrPickingListCode: $OrderCodeOrPickingListCode, Status: $Status, Type: $Type) {
              Items {
                Code
                CreatedAt {
                  Pretty
                }
                SourceHub {
                  DisplayName
                  Code
                  Name
                }
                DestinationHub {
                  DisplayName
                  Code
                  Name
                }
                Entries {
                  Order {
                    Code
                  }
                }
                Status {
                  Code
                  Color
                  Name
                }
                Type {
                  Name
                }
                Weight
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
      DestHubID: meStore.getCurrentHub()
    };
    if (filter) {
      let {OrderCodeOrPickingListCode, Status, Type, SrcHubID} = filter;
      variables.OrderCodeOrPickingListCode = OrderCodeOrPickingListCode || null;
      variables.Status = Status || null;
      variables.Type = Type || null;
      variables.SrcHubID = SrcHubID || null;
    }

    this.fetching = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const key = result.data.PickingLists;
        this.dataSource = key.Items;
        this.pagination = {
          ...pagination,
          total: ObjectPath.get(key, 'Pager.TotalOfItems', 0)
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
  fetchByCode = (code) => {
    let query = `
        query PickingList($Code: String!) {
            PickingList(Code: $Code) {
                Code
                CreatedAt {
                  Pretty
                }
                DestinationHub {
                  DisplayName
                }
                Entries {
                  Order {
                    Code
                    Name
                    NetWeight
                    Quantity
                    ServiceType {
                      Name
                    }
                    StatusCode {
                      Code
                      Color
                      Name
                    }
                  }
                  Status {
                    Code
                    Color
                    Name
                  }
                }
                QRCode
                ServiceType {
                  Name
                }
                SourceHub {
                  DisplayName
                }
                Status {
                  Code
                  Color
                  Name
                }
                Type {
                  Name
                }
                UpdatedAt {
                  Pretty
                }
                Weight
            }
        }
    `;

    let variables = {
      Code: code
    };

    this.isFetchingCurrentRow = true;
    this.fetchCurrentRowSuccess = false;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        this.currentRow = result.data.PickingList;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isFetchingCurrentRow = false;
        this.fetchCurrentRowSuccess = true;
      }));
  };

  @action
  clear = () => {
    this.filter = {};
    this.dataSource = [];
  }

}

export default new PickingListStore();