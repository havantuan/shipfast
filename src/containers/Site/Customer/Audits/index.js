import React from 'react';
import {Spin} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import CashFlowInformation from "./cashFlowInformation";
import SearchFlow from "./SearchFlow";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';

@inject(Keys.customerDebt, Keys.me)
@observer
export default class Audits extends React.PureComponent {

  constructor(props) {
    super(props);
    this.customerDebt = this.props.customerDebt
  }

  componentDidMount() {
     this.customerDebt.fetch(this.props.me.getUserID(), '');
  }

  render() {
    let {dataSource, fetching} = this.props.customerDebt;
    return (
      <PageHeaderLayout title="Quản lý đối soát">
        <ContentHolder>
          <Spin spinning={fetching}>
            <CashFlowInformation dataSource={dataSource}/>
          </Spin>
          <SearchFlow/>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}


