import React from 'react';
import {Provider} from 'mobx-react';
import createBrowserHistory from 'history/createBrowserHistory';
import {syncHistoryWithStore} from 'mobx-react-router';
import {Routes} from './router';
import {Router} from "react-router";
import '../src/style/styles.less';
import {stores} from './stores';

const browserHistory = createBrowserHistory();

const history = syncHistoryWithStore(browserHistory, stores.router);


const DashApp = () =>
  <Provider {...stores}>
    <Router history={history}>
      <Routes/>
    </Router>
  </Provider>;

export {DashApp};
