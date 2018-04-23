import React from 'react';
import {Icon, Tabs} from 'antd';
import PageTabsCardLayout from "../../../../layouts/PageTabsCardLayout";
import OrderList from "./OrderList";
import Print from "./Print/Print";

export default class Order extends React.PureComponent {

  render() {
    return (
      <PageTabsCardLayout>
        <Tabs type="card">
          <Tabs.TabPane tab={<span><Icon type="table"/>Danh sách đơn hàng</span>} key={'1'}>
            <OrderList/>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<span><Icon type="printer"/>In nhãn đơn hàng</span>} key={'2'}>
            <Print/>
          </Tabs.TabPane>
        </Tabs>
      </PageTabsCardLayout>
    )
  }

}