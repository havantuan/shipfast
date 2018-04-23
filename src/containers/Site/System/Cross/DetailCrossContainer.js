import React from 'react';
import {Tabs, Icon} from 'antd';
import PageTabsCardLayout from "../../../../layouts/PageTabsCardLayout";
import DetailCross from "./DetailCross";
import CrossHistory from "./CrossHistory";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import {withRouter} from "react-router-dom";

@withRouter
@inject(Keys.detailcross)
@observer
export default class DetailCrossContainer extends React.PureComponent {

  constructor(props) {
    super(props);
    this.code = props.match.params.code;
  }

  componentDidMount() {
    this.props.detailcross.reload(this.code);
  }

  componentWillUnmount() {
    this.props.detailcross.clear();
  }

  render() {
    return (
      <PageTabsCardLayout>
        <Tabs type="card">
          <Tabs.TabPane tab={<span><Icon type="book"/>Quản lý đối soát</span>} key={'1'}>
            <DetailCross/>
          </Tabs.TabPane>

          <Tabs.TabPane tab={<span><Icon type="calendar"/>Hành trình</span>} key={'2'}>
            <CrossHistory/>
          </Tabs.TabPane>
        </Tabs>
      </PageTabsCardLayout>
    )
  }

}