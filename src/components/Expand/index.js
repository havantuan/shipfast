import React, {Component} from 'react';
import {Button} from 'antd';

export default class Expand extends Component {
  render() {
    const {onClick, style = {}, expandable} = this.props;
    return (
      <Button
        style={style}
        type={'default'}
        icon={expandable ? 'up' : 'down'}
        onClick={onClick}
      >
        {expandable ? 'Thu nhỏ tìm kiếm' : 'Mở rộng tìm kiếm'}
      </Button>
    )
  }

}