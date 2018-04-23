import React, {Component} from 'react';
import {Button, Col, Form, Row, Input} from 'antd';
import basicStyle from "../../../../config/basicStyle";

@Form.create()
export default class DetailCrossTableControl extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Form values: ', values);
      if (!err) {
        let {Query} = values;
        let credentials = {
          Query,
        };
        this.props.handleSubmit(credentials);
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row gutter={basicStyle.gutter}>
          <Col md={{span: 8}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('Query')(
              <Input placeholder={"Nhập Mã - Tên, SĐT Người nhận"}/>
            )}
          </Col>

          <Col md={{span: 2}} sm={{span: 2}} xs={{span: 24}}>
            <Button
              type="primary"
              htmlType="submit"
            >Lọc</Button>
          </Col>
        </Row>

      </Form>
    )
  }

}
