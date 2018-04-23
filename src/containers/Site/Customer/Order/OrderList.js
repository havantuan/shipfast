import React, {Component} from 'react';
import './Style.css';
import OrderListControl from "./OrderListControl";
import OrderTable from "./OrderTable";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';

@inject(Keys.myOrder)
@observer
export default class OrderList extends Component {

  constructor(props) {
    super(props);
    this.myOrder = props.myOrder;
  }

  componentDidMount() {
    this.myOrder.reload();
  }

  render() {
    return (
      <div>
        <OrderListControl
          handleSubmit={this.myOrder.onFilter}
        />

        <OrderTable/>
      </div>

    )
  }

}


