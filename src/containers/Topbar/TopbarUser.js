import React, {Component} from 'react';
import {Icon, Layout, Button, Input} from 'antd';
import './index.less';
import {TopbarUser} from '../../components/topbar';
import './Style.css';
import {Keys} from '../../stores/index';
import {inject, observer} from "mobx-react";
import routerUserConfig from "../../config/routerUser";
import {WebSite} from "../../helpers/WebSite";
// import UploadOrder from "./UploadOrder";
const Search = Input.Search;
const {Header} = Layout;
@inject(Keys.app, Keys.uploadOrder, Keys.myOrder, Keys.router)
@observer
export default class TopbarForUser extends Component {

  constructor(props) {
    super(props);
    this.app = this.props.app;
  }

  orderDetail = (orderCode) => {
    if (orderCode && orderCode.trim().length > 0) {
      this.props.router.push(routerUserConfig.searchOrder.replace(":query", orderCode.trim()));
    }

  };

  render() {
    const {toggleCollapsed} = this.app;
    const collapsed = this.app.collapsed && !this.app.openDrawer;
    return (
      <Header style={{background: '#fff', padding: 0}}>

        <div className={'header'}>
          {/*<Logo collapsed={collapsed}/>*/}
          <Icon
            className="trigger"
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={toggleCollapsed}
          />

          {
            WebSite.IsKh() &&
            <Search
              style={{width: '350px',}}
              placeholder="Nhập mã đơn hàng,SĐT người nhận,vv..."
              onSearch={this.orderDetail}
              enterButton
            />
          }

          <div className={'right'}>
            <span className={`${'action'}`}>
            <Button
              className="hotline"
              icon="phone"
            >Hotline: 1900 969 629</Button>
            </span>
            <span className={`${'action'}`}>
            <a href="https://shipfast.vn/ung-dung/" target="_blank">
              <Button
              className="hotline"
              icon="android-o"
            >Tải ứng dụng</Button>
              </a>
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

// export default connect(
//     state => ({
//         ...state.App.toJS(),
//     }),
//     {toggleCollapsed}
// )(withRouter(TopbarForUser));