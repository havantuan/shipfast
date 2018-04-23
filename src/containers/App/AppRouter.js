import React from "react";
import {Route, Switch, withRouter} from "react-router-dom";
import asyncComponent from "../../helpers/AsyncFunc";
import permissionsConfig from "../../permissions/permissions";
import routerConfig from "../../config/router";
import {RestrictedRoute} from './RestrictedRoute';

@withRouter
export class AppRouter extends React.Component {

  render() {
    const {url} = this.props;
    return (
      <Switch>
        <RestrictedRoute
          exact
          path={`${url}`}
          component={asyncComponent(() => import("../Site/System/Dashboard/index"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.hub}`}
          component={asyncComponent(() => import("../Site/System/Hub/HubTable"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.listOrder}`}
          component={asyncComponent(() => import("../Site/System/Order/index"))}
          permission={permissionsConfig.readOrder}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.task}`}
          component={asyncComponent(() => import("../Site/System/Task/TaskMain"))}
          permission={permissionsConfig.assignTaskStaff}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.wareHouse}`}
          component={asyncComponent(() => import("../Site/System/Order/DetailOrder"))}
          permission={permissionsConfig.readOrder}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.createReceipt}`}
          component={asyncComponent(() => import("../Site/System/Receipt/CreateRecipt"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.seller}`}
          component={asyncComponent(() => import("../Site/System/Seller/SellerList"))}
          permission={permissionsConfig.readCustomer}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.printMuti}`}
          component={asyncComponent(() => import("../Site/System/Order/Print/PrintMuti"))}
          permission={permissionsConfig.readOrder}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.userConfig}`}
          component={asyncComponent(() => import("../Site/System/User/UserConfig"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.updateTask}`}
          component={asyncComponent(() => import("../Site/System/HandOver/HandOverOrder"))}
          permission={permissionsConfig.handOverOrder}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.map}`}
          component={asyncComponent(() => import("../Site/System/Map/MapDriver"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.listTask}`}
          component={asyncComponent(() => import("../Site/System/Task/Table/index"))}
          permission={permissionsConfig.readTask}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.detailTask}`}
          component={asyncComponent(() => import("../Site/System/Task/Table/TaskDetail"))}
          permission={permissionsConfig.readTask}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.taskAssignList}`}
          component={asyncComponent(() => import("../Site/System/TaskAssign/TaskAssignTable"))}
          permission={permissionsConfig.assignTaskStaff}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.orderingOrders}`}
          component={asyncComponent(() => import("../Site/System/Order/Ordering/OrderingOrdersTable"))}
          permission={permissionsConfig.assignHubOrder}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.list}`}
          component={asyncComponent(() => import("../Site/System/PickingList/ListTable"))}
          permission={permissionsConfig.readPickingList}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.createList}`}
          component={asyncComponent(() => import("../Site/System/PickingList/CreateList/CreateList"))}
          permission={permissionsConfig.createPickingList}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.receiveList}`}
          component={asyncComponent(() => import("../Site/System/PickingList/ReceiveList/ReceiveListTable"))}
          permission={permissionsConfig.receivePickingList}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.receiveListWithCode}`}
          component={asyncComponent(() => import("../Site/System/PickingList/ReceiveList/ReceiveListTable"))}
          permission={permissionsConfig.receivePickingList}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.listDetail}`}
          component={asyncComponent(() => import("../Site/System/PickingList/ListDetail"))}
          permission={permissionsConfig.readPickingList}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.revenue}`}
          component={asyncComponent(() => import("../Site/System/Revenue/index"))}
          permission={permissionsConfig.createOrder}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.handerOverList}`}
          component={asyncComponent(() => import("../Site/System/HandOver/List/HandOverTable"))}
          permission={permissionsConfig.handOverOrder}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.payConfig}`}
          component={asyncComponent(() => import("../Site/System/User/PayConfig"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.detailHandOver}`}
          component={asyncComponent(() => import("../Site/System/HandOver/List/HandOverDetail"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.myTasks}`}
          component={asyncComponent(() => import("../Site/System/Task/MyTasks/MyTasksTable"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.Container}`}
          component={asyncComponent(() => import("../Site/System/Container/ContainerTable"))}
          permission={permissionsConfig.readContainer}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.detailContainer}`}
          component={asyncComponent(() => import("../Site/System/Container/DetailContainer"))}
          permission={permissionsConfig.readContainer}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.orderWatting}`}
          component={asyncComponent(() => import("../Site/System/Order/OrderWatting/OrderWattingTable"))}
          permission={permissionsConfig.readPickingList}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.createSeller}`}
          component={asyncComponent(() => import("../Site/System/Seller/CreateSeller"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.updateSeller}`}
          component={asyncComponent(() => import("../Site/System/Seller/UpdateSeller"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.crossCustomer}`}
          component={asyncComponent(() => import("../Site/System/Cross/CrossTable"))}
          permission={permissionsConfig.viewCustomerCross}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.crossCustomerCreate}`}
          component={asyncComponent(() => import("../Site/System/Cross/CrossCreate"))}
          permission={permissionsConfig.createCustomerCross}
        />

        <RestrictedRoute
          exact
          path={`${routerConfig.crossDetail}`}
          component={asyncComponent(() => import("../Site/System/Cross/DetailCrossContainer"))}
          permission={permissionsConfig.viewCustomerCross}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.taskOrder}`}
          component={asyncComponent(() => import("../Site/System/TaskOrder/TaskOrder"))}
          permission={permissionsConfig.viewCustomerCross}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.orderConfirmation}`}
          component={asyncComponent(() => import("../Site/System/ConfirmStatus/OrderConfirmation"))}
          permission={permissionsConfig.updateStatusOrder}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.orderComplaint}`}
          component={asyncComponent(() => import("../Site/System/ConfirmStatus/ComplaintHandling"))}
          permission={permissionsConfig.updateStatusOrder}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.searchOrder}`}
          component={asyncComponent(() => import("../Site/System/Order/OrderSearch"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.orderChart}`}
          component={asyncComponent(() => import("../Site/System/ChartStatistic/OrderChart"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.userChart}`}
          component={asyncComponent(() => import("../Site/System/ChartStatistic/UserChart"))}
        />
          <RestrictedRoute
            exact
            path={`${routerConfig.discount}`}
            component={asyncComponent(() => import("../Site/System/Discount/DiscountTable"))}
          />
        {/* lastest route */}
        <Route
          exact
          path={"*"}
          component={asyncComponent(() => import("../Page/404"))}
        />
      </Switch>
    );
  }
}