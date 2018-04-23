import React, {Component} from 'react';
import './Style.css';
import OrderTable from "./OrderTable";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import {withRouter} from "react-router-dom";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import ContentHolder from "../../../../components/utility/ContentHolder";

@inject(Keys.order)
@observer
@withRouter
export default class OrderSearch extends Component {

  constructor(props) {
    super(props);
    this.order = props.order;
    this.query = this.props.match.params.query;
  }

  componentDidMount() {
    this.order.onFilter({Query: this.query, onTopBar: true})
  }

  render() {
    return (
      <PageHeaderLayout title={`Kết quả tìm kiếm cho từ khóa: "${this.query}"`}>
        <ContentHolder>
          <OrderTable/>
        </ContentHolder>
      </PageHeaderLayout>

    )
  }

}


