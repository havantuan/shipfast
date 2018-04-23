import React, {PureComponent} from 'react';
import {Tag, Tooltip} from 'antd';

class StatusToolTip extends PureComponent {
  render() {
    let {value} = this.props;
    if (!value) {
      return (<Tag/>)
    }
    return (
      <Tooltip title={value.Name}>
        <Tag color={this.props.color ? this.props.color : "#7698e0"}>{value.Code}</Tag>
      </Tooltip>
    )
  }
}

export default StatusToolTip;