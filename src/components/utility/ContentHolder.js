import React from 'react';
import {Card} from 'antd';

export default props => (
  <Card bordered={false} loading={props.loading} bodyStyle={{padding: '15px 10px'}}>
    {props.children}
  </Card>
);
