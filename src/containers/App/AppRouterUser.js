import React from "react";
import {Route, Switch} from "react-router-dom";
import asyncComponent from "../../helpers/AsyncFunc";
import routerUserConfig from "../../config/routerUser";
import {RestrictedRoute} from './RestrictedRoute';

export class AppRouterUser extends React.Component {

  render() {
    return (
      <Switch>
        <RestrictedRoute
          exact
          path={`${routerUserConfig.orderCreate}`}
          component={asyncComponent(() => import("../Site/Customer/Order/OrderCreate"))}
        />
        <RestrictedRoute
          exact
          path={`${routerUserConfig.userConfig}`}
          component={asyncComponent(() => import("../Site/System/User/UserConfig"))}
        />
        <RestrictedRoute
          exact
          path={`${routerUserConfig.inventory}`}
          component={asyncComponent(() => import("../Site/Customer/Inventory/InventoryTable"))}
        />
        <RestrictedRoute
          exact
          path={`${routerUserConfig.listOrder}`}
          component={asyncComponent(() => import("../Site/Customer/Order/index"))}
        />
        <RestrictedRoute
          exact
          path={`${routerUserConfig.payConfig}`}
          component={asyncComponent(() => import("../Site/System/User/PayConfig"))}
        />
        <RestrictedRoute
          exact
          path={`${routerUserConfig.map}`}
          component={asyncComponent(() => import("../Site/System/Map/MapDriver"))}
        />
        <RestrictedRoute
          exact
          path={`${routerUserConfig.updateOrder}`}
          component={asyncComponent(() => import("../Site/Customer/Order/UpdateOrder"))}
        />
        <RestrictedRoute
          exact
          path={`${routerUserConfig.customerDebt}`}
          component={asyncComponent(() => import("../Site/Customer/Audits/index"))}
        />
        <RestrictedRoute
          exact
          path={`${routerUserConfig.crossDetail}`}
          component={asyncComponent(() => import("../Site/Customer/Audits/DetailCross"))}
        />
        <RestrictedRoute
          exact
          path={`${routerUserConfig.searchOrder}`}
          component={asyncComponent(() => import("../Site/Customer/Order/OrderSearch"))}
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