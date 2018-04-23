import React, {PureComponent} from 'react';

import {Button, Dropdown, Icon, Menu, Spin} from 'antd';
import {observer} from 'mobx-react';
import {EventOrderStatusStore} from "../../../../../stores/common/eventOrderStatusStore";

@observer
export default class EventAcceptStatuses extends PureComponent {

  constructor(props) {
    super(props);
    this.eventOrderStatus = new EventOrderStatusStore();
  }

  componentDidMount() {
    if (this.props.code) {
      this.eventOrderStatus.getDataSource(this.props.code);
    }
  }

  handleMenuClick = (e) => {
    this.props.onChange(e.key);
  };

  render() {
    let {counter, rows} = this.props;
    let {dataSource, fetching} = this.eventOrderStatus;

    const menu = (
      <Menu onClick={this.handleMenuClick}>
        {dataSource && dataSource.AcceptStatuses && dataSource.AcceptStatuses.map(item =>
          <Menu.Item key={`${item.Code}`}>
            {`${item.Name}`}
          </Menu.Item>
        )}
      </Menu>
    );

    return (
      <Spin spinning={fetching}>
        <Dropdown overlay={menu} trigger={['click']}>
          <Button
            size={"small"}
          >
            Hành động {counter || 0}/{rows || 1} <Icon type="down"/>
          </Button>
        </Dropdown>
      </Spin>
    )
  }

}