import React, {PureComponent} from 'react';
import {Tag} from 'antd';

class StatusTag extends PureComponent {
  render() {
    let {value} = this.props;
    if (!value) {
      return <span/>
    }

    return (
      <Tag color={value.Color}>{value.Name}</Tag>
    )
  }
}

export default StatusTag;