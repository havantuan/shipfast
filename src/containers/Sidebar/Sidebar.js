import React, {Component} from 'react';
import clone from 'clone';
import {Link} from 'react-router-dom';
import {Icon, Layout, Menu, Badge} from 'antd';
import Permission from "../../permissions/index";

import Logo from '../../components/utility/logo';
import {Keys} from '../../stores/index';
import {inject, observer} from "mobx-react";
import {WebSite} from "../../helpers/WebSite";

const SubMenu = Menu.SubMenu;
const {Sider} = Layout;
const getIcon = (icon) => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={"icon"}/>;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon}/>;
  }
  return icon;
};

@inject(Keys.app, Keys.eventStatusStatistic)
@observer
export default class Sidebar extends Component {
  getAncestorKeys = key => {
    const map = {
      sub3: ['sub2'],
    };
    return map[key] || [];
  };

  constructor(props) {
    super(props);
    this.app = props.app;
    this.eventStatusStatistic = props.eventStatusStatistic;
    this.handleClick = this.handleClick.bind(this);
    this.onOpenChange = this.onOpenChange.bind(this);
  }

  componentWillUnmount() {
    this.app.clearMenu();
  }

  handleClick(e) {
    this.app.changeCurrent(e.key);
    if (this.app.view === 'MobileView') {
      this.app.toggleCollapsed();
      this.app.toggleOpenDrawer();
    }
  }

  onOpenChange(newOpenKeys) {
    // const {app, changeOpenKeys} = this.props;
    // const latestOpenKey = newOpenKeys.find(
    //   key => !(app.openKeys.indexOf(key) > -1)
    // );
    // const latestCloseKey = app.openKeys.find(
    //   key => !(newOpenKeys.indexOf(key) > -1)
    // );
    // let nextOpenKeys = [];
    // if (latestOpenKey) {
    //   nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    // }
    // if (latestCloseKey) {
    //   nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    // }
    // changeOpenKeys(nextOpenKeys);

    const latestOpenKey = newOpenKeys.find(key => this.app.openKeys.indexOf(key) === -1);
    let rootSubmenuKeys = Object.keys(this.app.menuData).map(val => val);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.app.changeOpenKeys(newOpenKeys);
    } else {
      this.app.changeOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  }

  count = (name) => {
    if (WebSite.IsKh()) {
      return false;
    }
    const {dataSource} = this.eventStatusStatistic;
    return dataSource ? dataSource[name] : 0;
  };

  isShow = (menu) => {
    if (WebSite.IsKh()) {
      return true;
    }
    else {
      if (menu.permission === undefined || Permission.allowPermission(menu.permission)) {
        if (WebSite.IsHub() && window.localStorage.getItem('hubPrimaryID') === '0') {
          return menu.isShowAllHubs === true;
        }
        return true;
      }
      return false;
    }
  };

  render() {
    // const { url, app, toggleOpenDrawer, bgcolor } = this.props;
    const {url, app} = this.props;
    const collapsed = clone(app.collapsed) && !clone(app.openDrawer);
    // const {openDrawer} = app;
    const mode = collapsed === true ? 'vertical' : 'inline';
    // const onMouseEnter = event => {
    //   if (openDrawer === false) {
    //     toggleOpenDrawer();
    //   }
    //   return;
    // };
    // const onMouseLeave = () => {
    //   if (openDrawer === true) {
    //     toggleOpenDrawer();
    //   }
    //   return;
    // };
    // const scrollheight = app.height;
    return (
      <Sider
        trigger={null}
        collapsible={false}
        collapsed={collapsed}
        width="230"
        // onMouseEnter={onMouseEnter}
        // onMouseLeave={onMouseLeave}
      >
        <Logo collapsed={collapsed}/>

        <Menu
          onClick={this.handleClick}
          theme="dark"
          mode={mode}
          // defaultOpenKeys={app.openKeys}
          openKeys={app.openKeys ? app.openKeys.slice() : []}
          selectedKeys={[app.current]}
          onOpenChange={this.onOpenChange}
          className="isoDashboardMenu"
        >
          {Object.keys(app.menuData).map((el, i) => {
            let menu = app.menuData[el];
            if (this.isShow(menu) && menu.submenu) {
              return (
                <SubMenu
                  key={menu.key}
                  title={
                    menu.icon ? (
                      <span>
                        {getIcon(menu.icon)}
                        <span>{menu.title}</span>
                      </span>
                    ) : (
                      menu.title
                    )
                  }
                >
                  {
                    [].concat(Object.values(menu.submenu)).map((submenuItem, index) => {
                      return this.isShow(submenuItem) && (
                        <Menu.Item
                          key={`${menu.key}_${submenuItem.key}`}
                        >
                          <Link
                            to={`${url}${submenuItem.url}`}
                          >
                            {/*<i className={submenuItem.icon}/>*/}
                            <span>
                              {submenuItem.title}
                              {
                                submenuItem.countName && !!this.count(submenuItem.countName) &&
                                <Badge className={'side-count'} count={this.count(submenuItem.countName)}/>
                              }
                            </span>
                          </Link>
                        </Menu.Item>
                      )
                    })
                  }
                </SubMenu>
              )
            } else if (this.isShow(menu)) {
              return (
                <Menu.Item
                  key={menu.key}
                >
                  <Link to={`${url}${menu.url}`}>
                    {getIcon(menu.icon)}

                    <span>
                      {menu.title}
                      {
                        menu.countName && !!this.count(menu.countName) &&
                        <Badge className={'side-count'} count={this.count(menu.countName)}/>
                      }
                    </span>
                  </Link>
                </Menu.Item>
              )
            }
            return true;
          })}
        </Menu>

      </Sider>
    );
  }
}

// const mapStateToProps = state => {
//   return {
//     app: state.App.toJS(),
//   }
// };

// export default connect(
//   mapStateToProps,
//   {toggleOpenDrawer, changeOpenKeys, changeCurrent, toggleCollapsed}
// )(Sidebar);
