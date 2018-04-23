import React from 'react';
import {Tabs, Icon, Badge} from 'antd';
import PageTabsCardLayout from "../../../../layouts/PageTabsCardLayout";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import WrongProductTable from "./WrongProductTable";
import LostProductTable from "./LostProductTable";
import DamagesProductTable from "./DamagesProductTable";
import MistakeProductTable from "./MistakeProductTable";
import ExcessWeightTable from "./ExcessWeightTable";

@inject(Keys.eventStatusStatistic)
@observer
export default class OrderConfirmation extends React.PureComponent {

  renderTitle = (icon, name, key) => {
    const {dataSource} = this.props.eventStatusStatistic;
    if (dataSource && dataSource[key]) {
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
          <Tabs.TabPane
            tab={this.renderTitle('exclamation-circle-o', 'Sai trạng thái', 'WrongProduct')}
            key={'1'}
          >
            <WrongProductTable/>
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={this.renderTitle('frown-o', 'Thất lạc', 'LostProduct')}
            key={'2'}
          >
            <LostProductTable/>
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={this.renderTitle('close-circle-o', 'Hư hỏng', 'DamagesProduct')}
            key={'3'}
          >
            <DamagesProductTable/>
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={this.renderTitle('pause-circle-o', 'Nhầm đơn hàng', 'MistakeProduct')}
            key={'4'}
          >
            <MistakeProductTable/>
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={this.renderTitle('warning', 'Vượt cân', 'ExcessWeight')}
            key={'5'}
          >
            <ExcessWeightTable/>
          </Tabs.TabPane>
        </Tabs>
      </PageTabsCardLayout>
    )
  }

}