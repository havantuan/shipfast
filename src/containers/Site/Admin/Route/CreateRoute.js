import React from 'react';
import RouteForm from './RouteForm';
import updateRouteStore from "../../../../stores/updateRouteStore";

function CreateRoute() {
  updateRouteStore.onChangeMode(false);
  return (
    <RouteForm/>
  )
}

export default CreateRoute;