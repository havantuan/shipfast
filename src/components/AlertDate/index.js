import React from 'react';
import {Alert, Tag} from 'antd';

export class AlertDate extends React.Component {
  render() {
    const {name, value} = this.props;

    return (
      <Alert
        className={'alert-date'}
        message={(
          <div>
            <span style={{paddingRight: 10}}>{name}:</span>
            {value && <Tag color={'#f5222d'}>{value}</Tag>}
          </div>
        )}
        type="error"
      />
    )
  }

}