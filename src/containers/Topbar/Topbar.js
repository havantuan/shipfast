import React, {Component} from 'react';
import {Icon, Input, Layout} from 'antd';
import routerConfig from "../../config/router";
import './index.less';
import {TopbarBarCode, TopbarHubs, TopbarUser,} from '../../components/topbar';
import {Keys} from '../../stores/index';
import {inject, observer} from "mobx-react";

const {Header} = Layout;
const Search = Input.Search;

@inject(Keys.app, Keys.router,Keys.detailOrder)
@observer
export default class Topbar extends Component {

  orderDetail = (orderCode) => {
    if (orderCode && orderCode.trim().length > 0) {
      this.props.router.push(routerConfig.searchOrder.replace(":query", orderCode.trim()));
    }
  };

  constructor(props) {
    super(props);
    this.app = this.props.app;
  }

  render() {
    const {toggleCollapsed} = this.app;
    const collapsed = this.app.collapsed && !this.openDrawer;
    return (
      <Header style={{background: '#fff', padding: 0}}>

        <div className={'header'}>
          <Icon
            className="trigger"
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={toggleCollapsed}
          />
          <Search
            style={{width: '350px',}}
            placeholder="Nhập mã đơn hàng, tên KH, SĐT,..."
            onSearch={this.orderDetail}
            enterButton
          />
          <div className={'right'}>
            <span className={`${'action'}`}>
              <TopbarHubs/>
            </span>
            <span className={`${'action'}`}>
              <TopbarBarCode/>
            </span>
            <span className={`${'action'} ${'account'}`}>
              <TopbarUser/>
            </span>
          </div>
        </div>

      </Header>
    );
  }
}