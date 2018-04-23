import React, {Component} from 'react';

import {Button, Col, Form, Input, Row} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import AppTypes from "../../Common/EnumProvider/appTypes";


@Form.create()
@inject(Keys.notification)
@observer
export default class NotificationTableControl extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {Query, ID, AppType} = values;
        let credentials = {
          Query,
          ID: ID,
          AppType: AppType,
        };
        this.props.notification.onFilter(credentials);
      }
    });
  };

  constructor(props) {
    super();
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>

        <Row gutter={basicStyle.gutter}>

          <Col md={{span: 8}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('Query')(
              <Input placeholder="Tìm kiếm: ID, tiêu đề hoặc chi tiết"/>
            )}
          </Col>
          <Col md={{span: 6}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('ID')(
              <Input placeholder="Nhập vào mã thông báo"/>
            )}
          </Col>
          <Col md={{span: 6}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('AppType')(
              <AppTypes placeholder="Đối tượng nhận thông báo" valueByCode={true}/>
            )}
          </Col>
          <Col md={{span: 2}} sm={{span: 2}} xs={{span: 24}}>
            <Button
              icon={'search'}
              type="primary"
              htmlType="submit"
            >Lọc</Button>
          </Col>
        </Row>

      </Form>
    )
  }

}