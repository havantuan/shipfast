import React from 'react';
import createOrderStore from "../../../../stores/createOrderStore";
import OrderTabs from "./OrderTabs";

function UpdateOrder() {
  createOrderStore.setUpdateMode(true);
  return (
    <OrderTabs/>
  )
}

export default UpdateOrder;