import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Dropdown, Icon, Menu} from 'antd';
import routerConfig from "../../config/router";
import {Keys} from '../../stores/index';
import {inject, observer} from "mobx-react";

@inject(Keys.auth, Keys.me)
@observer
export default class TopbarUser extends Component {
  constructor(props) {
    super(props);
    this.handleVisibleChange = this.handleVisibleChange.bind(this);
    this.hide = this.hide.bind(this);
    this.onMenuClick = this.onMenuClick.bind(this);
    this.state = {
      visible: false,
    };
  }

  hide() {
    this.setState({visible: false});
  }

  handleVisibleChange() {
    this.setState({visible: !this.state.visible});
  }

  onMenuClick({item, key, keyPath}) {
    switch (key) {
      case 'logout':
        this.props.auth.logout();
        break;
      default:
        return;
    }
  }

  render() {
    const menu = (
      <Menu className={'menu'} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item disabled>
          <Link to={`${routerConfig.userConfig}`}>Cấu hình tài khoản</Link>
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="logout">
          <Icon type="logout"/>Thoát
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu}>
        <span className={`${'action'} ${'account'}`}>
          {/*<Avatar size="small" className={'avatar'} src={currentUser.avatar} />*/}
          <span className={'name'}>{this.props.me.getName()}</span>
        </span>
      </Dropdown>
    );
  }
}

// export default connect(null, {logout})(TopbarUser);
