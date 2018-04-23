import Permission from "../../permissions/index";
import {Redirect, Route, withRouter} from "react-router-dom";
import React from "react";

import {Keys} from '../../stores/index';
import {inject, observer} from "mobx-react";
import routerConfig from '../../config/router';
import PermissionDenied from '../Page/403';

@inject(Keys.me, Keys.app)
@withRouter
@observer
export class RestrictedRoute extends React.Component {

  render() {
    const {component: Component, permission, ...rest} = this.props;
    if (this.props.app.token && this.props.me.current) {
      console.log("Is login");
      return <Route
        {...rest}
        render={props =>
          Permission.allowPermission(permission) || permission === undefined
            ? <Component {...props} />
            : <PermissionDenied/>
        }
      />
    } else {
      return <Route {...rest} render={props => <Redirect to={routerConfig.home}/>}/>;
    }

  }
}