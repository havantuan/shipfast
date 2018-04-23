import React from 'react';
import {Tabs, Icon, Badge} from 'antd';
import PageTabsCardLayout from "../../../../layouts/PageTabsCardLayout";
import RePickupTable from "./RePickupTable";
import ReDeliveryTable from "./ReDeliveryTable";
import ReReturnTable from "./ReReturnTable";
import WaitingReturnTable from "./WaitingReturnTable";
import Permission from '../../../../permissions/index';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

@inject(Keys.eventStatusStatistic)
@observer
export default class OrderConfirmation extends React.PureComponent {

  renderTitle = (icon, name, key = null) => {
    const {dataSource} = this.props.eventStatusStatistic;
    if (key && dataSource && dataSource[key]) {
      return (
        <Badge count={dataSource[key]}>
          <span style={{paddingRight: '15px'}}><Icon type={icon}/>{name}</span>
        </Badge>
      )
    }
    else {
      return (
        <span><Icon type={icon}/>{name}</span>
      )
    }
  };

  render() {
    return (
      <PageTabsCardLayout>
        <Tabs type="card">
          {
            Permission.allowRePickupOrder() &&
            <Tabs.TabPane tab={this.renderTitle('arrow-left', 'Xử lý thu', 'RePickup')} key={'1'} >
              <RePickupTable/>
            </Tabs.TabPane>
          }

          {
            Permission.allowReDeliverOrder() &&
            <Tabs.TabPane tab={this.renderTitle('arrow-right', 'Xử lý phát', 'ReDelivery')} key={'2'}>
              <ReDeliveryTable/>
            </Tabs.TabPane>
          }

          {
            Permission.allowReturnOrder() &&
            <Tabs.TabPane tab={this.renderTitle('swap', 'Xử lý hoàn', 'ReReturn')} key={'3'}>
              <ReReturnTable/>
            </Tabs.TabPane>
          }

          {
            Permission.allowReturnOrder() &&
            <Tabs.TabPane tab={this.renderTitle('retweet', 'Chờ xác nhận hoàn')} key={'4'}>
              <WaitingReturnTable/>
            </Tabs.TabPane>
          }
        </Tabs>
      </PageTabsCardLayout>
    )
  }

}