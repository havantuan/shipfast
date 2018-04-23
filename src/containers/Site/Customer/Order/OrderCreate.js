import React from 'react';
import createOrderStore from "../../../../stores/createOrderStore";
import OrderTabs from "./OrderTabs";

function CreateOrder() {
  createOrderStore.setUpdateMode(false);
  return (
    <OrderTabs/>
  )
}

export default CreateOrder;