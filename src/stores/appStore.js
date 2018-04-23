import {action, observable, reaction} from 'mobx';
import sideBarMenuConfig from "../config/sideBarMenu";
import sideBarMenuUserConfig from "../config/sideBarMenuUser";
import sideBarMenuSystemConfig from "../config/sideBarMenuSystem";

const site = process.env.SITE;
const sideBarConfig = (site === 'KH' && sideBarMenuUserConfig)
  || (site === 'HUB' && sideBarMenuConfig)
  || (site === 'SYSTEM' && sideBarMenuSystemConfig);

function getView(width) {
  let newView = 'MobileView';
  if (width > 1220) {
    newView = 'DesktopView';
  } else if (width > 767) {
    newView = 'TabView';
  }
  return newView;
}

function isAllHubsMode() {
  return window.localStorage.getItem('hubPrimaryID') === '0' && site === 'HUB'
}

export class AppStore {
  @observable collapsed = window.localStorage.getItem('collapsed') === 'true';
  @observable site = process.env.SITE;
  @observable view = getView(window.innerWidth);
  @observable height = window.innerHeight;
  @observable appLoaded = false;
  @observable openDrawer = false;
  @observable page504 = false;
  @observable openKeys = isAllHubsMode() ? ['group_5'] : [];
  // openKeys = Object.keys(sideBarConfig.accountant).map(key => sideBarConfig.accountant[key].key) || [];
  @observable current = '1';
  menuData = sideBarConfig.accountant || {};
  @observable token = window.localStorage.getItem('accessToken');
  @observable refreshToken = window.localStorage.getItem('refreshToken');

  constructor() {
    reaction(
      () => this.token,
      token => {
        if (token) {
          window.localStorage.setItem('accessToken', token);
        } else {
          window.localStorage.removeItem('accessToken');
        }
      }
    );
  }

  @action
  setToken(token) {
    window.localStorage.setItem('accessToken', token);
    this.token = token;
  }

  @action
  setPage504(val) {
    if (this.page504 !== val) {
      this.page504 = val;
    }
  }

  @action
  setAppLoaded() {
    this.appLoaded = true;
  }

  @action
  toggleCollapsed = () => {
    if (this.collapsed === false) {
      this.openKeys = [];
    }
    this.setCollapsed(!this.collapsed);
  }
  @action
  setCollapsed = (val) => {
    this.collapsed = val;
    window.localStorage.setItem('collapsed', this.collapsed);
  }


  @action
  toggleAll = (width, height) => {
    const view = getView(width);
    const collapsed = view !== 'DesktopView';
    if (this.view !== view || height !== this.height) {
      const tmp = height ? height : this.height;
      this.setCollapsed(collapsed);
      this.view = view;
      this.height = tmp;
    }
  }


  @action
  toggleOpenDrawer = () => {
    this.openDrawer = !this.openDrawer
  }


  @action
  changeOpenKeys = (openKeys) => {
    this.openKeys = openKeys
  }


  @action
  changeCurrent = (current) => {
    this.current = current
  }


  @action
  changeMenuData = (menu) => {
    this.menuData = menu
  }

  @action
  clearMenu = () => {
    this.openKeys = isAllHubsMode() ? ['group_5'] : [];
  };
}

export default new AppStore()