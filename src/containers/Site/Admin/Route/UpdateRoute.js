import React from 'react';
import RouteForm from './RouteForm';
import updateRouteStore from "../../../../stores/updateRouteStore";

function UpdateRoute() {
  updateRouteStore.onChangeMode(true);
  return (
    <RouteForm/>
  )
}

export default UpdateRoute;