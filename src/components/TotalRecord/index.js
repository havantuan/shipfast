import React, {Component} from 'react';
import {Alert} from 'antd';

export default class TotalRecord extends Component {
  render() {
    const {total, name} = this.props;
    return (
      <div className={"tableAlert"}>
        <Alert message={`Tìm thấy ${total ? total : 0} ${name}`} type="info" showIcon style={{borderRadius: 0}}/>
      </div>
    )
  }

}