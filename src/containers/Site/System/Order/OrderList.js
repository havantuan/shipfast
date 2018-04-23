import React, {Component} from 'react';
import ContentHolder from '../../../../components/utility/ContentHolder';
import OrderListControl from "./OrderListControl";
import OrderTable from "./OrderTable";
import PageLayout from '../../../../layouts/PageLayout';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';

@inject(Keys.order)
@observer
export default class OrderList extends Component {

  constructor(props) {
    super(props);
    this.order = props.order;
  }

  componentDidMount() {
    this.order.reload();
  }

  render() {
    let {pagination} = this.order;

    return (
      <PageLayout>
        <ContentHolder>
          <OrderListControl/>

          <OrderTable
            data={this.order}
            pagination={pagination}
            handleTableChange={this.order.handleTableChange}
            statusCode={this.order.StatusCode}
            getData={this.order.reload}
          />
        </ContentHolder>
      </PageLayout>
    )
  }

}
