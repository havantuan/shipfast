import React from "react";
import {Route, Switch} from "react-router-dom";
import asyncComponent from "../../helpers/AsyncFunc";
import permissionsConfig from "../../permissions/permissions";
import routerConfig from "../../config/routerSystem";
import {RestrictedRoute} from './RestrictedRoute';

export class AppRouterSystem extends React.Component {

  render() {
    const {url} = this.props;
    return (
      <Switch>
        <RestrictedRoute
          exact
          path={`${url}`}
          component={asyncComponent(() => import("../Page/404"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.staff}`}
          component={asyncComponent(() => import("../Site/Admin/Staff/StaffTable"))}
          // permission={permissionsConfig.readStaff}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.createStaff}`}
          component={asyncComponent(() => import("../Site/Admin/Staff/CreateStaff"))}
          permission={permissionsConfig.createStaff}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.createStaffFromUser}`}
          component={asyncComponent(() => import("../Site/Admin/Staff/User/CreateStaff"))}
          permission={permissionsConfig.createStaff}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.role}`}
          component={asyncComponent(() => import("../Site/Admin/Role/RoleTable"))}
          permission={permissionsConfig.grantPermissionRole}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.updateStaff}`}
          component={asyncComponent(() => import("../Site/Admin/Staff/UpdateStaff"))}
          permission={permissionsConfig.updateStaff}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.userConfig}`}
          component={asyncComponent(() => import("../Site/System/User/UserConfig"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.createRoute}`}
          component={asyncComponent(() => import("../Site/Admin/Route/CreateRoute"))}
          permission={permissionsConfig.createRoute}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.Route}`}
          component={asyncComponent(() => import("../Site/Admin/Route/RouteTable"))}
          permission={permissionsConfig.readRoute}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.updateRoute}`}
          component={asyncComponent(() => import("../Site/Admin/Route/UpdateRoute"))}
          permission={permissionsConfig.updateRoute}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.activeHub}`}
          component={asyncComponent(() => import("../Site/Admin/Hub/HubTable"))}
          permission={permissionsConfig.updateStateHub}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.discount}`}
          component={asyncComponent(() => import("../Site/Admin/Discount/DiscountTable"))}
          // permission={permissionsConfig.updateHub}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.notification}`}
          component={asyncComponent(() => import("../Site/Admin/Notification/NotificationTable"))}
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

export default AppRouterSystem;
