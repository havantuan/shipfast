import React from 'react';
import {Tabs, Icon} from 'antd';
import OrderForm from "./OrderForm";
import UploadOrder from "../UploadOrder/index";
import './Style.css';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import PageTabsCardLayout from "../../../../layouts/PageTabsCardLayout";

@inject(Keys.createOrder)
@observer
export default class OrderTabs extends React.PureComponent {

  render() {
    let {isUpdateMode} = this.props.createOrder;

    return (
      <PageTabsCardLayout>
        <Tabs type="card">
          <Tabs.TabPane
            tab={<span><Icon type="plus-circle-o"/>{isUpdateMode ? 'Cập nhật' : 'Tạo'} đơn hàng</span>}
            key={'1'}
          >
            <OrderForm/>
          </Tabs.TabPane>

          <Tabs.TabPane tab={<span><Icon type="upload"/>Tải đơn hàng</span>} key={'2'}>
            <UploadOrder/>
          </Tabs.TabPane>
        </Tabs>
      </PageTabsCardLayout>
    )
  }

}