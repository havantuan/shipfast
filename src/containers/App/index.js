import React, {Component} from 'react';
import {Layout} from 'antd';
import {Debounce} from 'react-throttle';
import {WindowResizeListener} from 'react-window-resize-listener';
import {siteConfig} from '../../config.js';
// hub
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
// kh
import TopbarUser from '../Topbar/TopbarUser';
import moment from 'moment';
import 'moment/locale/vi';
import {Keys} from '../../stores/index';
import {inject, observer} from "mobx-react";
import {AppRouterSystem} from './AppRouterSystem';
import {AppRouterUser} from './AppRouterUser';
import {AppRouter} from './AppRouter';
import {WebSite} from '../../helpers/WebSite';
import DetailOrder from '../Site/System/Order/DetailOrder';

// system

moment.locale('vi');

const {Content, Footer} = Layout;

@inject(Keys.app)
@observer
export class App extends Component {

  componentWillMount() {
    document.title = WebSite.IsHub() ? 'Hub ShipFast' : (WebSite.IsSystem() ? 'Admin ShipFast' : 'ShipFast');
  }

  render() {
    const {url} = this.props.match;

    return (

      <Layout>
        <Debounce time="1000" handler="onResize">
          <WindowResizeListener
            onResize={windowSize =>
              this.props.app.toggleAll(
                windowSize.windowWidth,
                windowSize.windowHeight
              )}
          />
        </Debounce>

        <Sidebar url={url}/>
        <Layout>

          {
            WebSite.IsHub() ? <Topbar url={url}/> : <TopbarUser url={url}/>
          }
          <Layout>
            <DetailOrder/>
            <Content style={{margin: '24px 24px 0', height: '100%'}}>
              {WebSite.IsKh() && <AppRouterUser url={url}/>}
              {WebSite.IsHub() && <AppRouter url={url}/>}
              {WebSite.IsSystem() && <AppRouterSystem url={url}/>}
            </Content>
            <Footer
              style={{
                background: '#ffffff',
                textAlign: 'center',
                borderTop: '1px solid #ededed'
              }}
            >
              {siteConfig.footerText}
            </Footer>
          </Layout>
        </Layout>
      </Layout>

    );
  }
}