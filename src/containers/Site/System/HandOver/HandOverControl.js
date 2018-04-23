import React, {PureComponent} from 'react';
import {Button, Col, Form, Input, Row, message} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import './Style.css';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import StaffList from "../../Common/Staff/StaffList";

const FormItem = Form.Item;

@Form.create()
@inject(Keys.assignHandOver, Keys.me)
@observer
export default class HandOverControl extends PureComponent {

  onKeyDown = (e) => {
    // 9 - Tab
    // 13 - Enter
    let scannerKey = this.props.me.scannerKey();
    if (e.which === scannerKey && scannerKey !== 13) {
      this.onSubmit();
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.onSubmit();
  };

  onSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let {StaffID, Code} = values;
        if (!StaffID) {
          message.error('Vui lòng chọn nhân viên cần giao việc');
          return;
        }
        if (!Code) {
          message.error('Vui lòng nhập mã đơn hàng');
          return;
        }
        let credentials = {
          StaffID: +StaffID,
          Code
        };
        this.props.assignHandOver.handOver(credentials);
        this.props.form.setFieldsValue({"Code": null});
      }
    });
  };

  handleChange = (staffID) => {
    if (staffID) {
      this.props.assignHandOver.onFilter(staffID);
    }
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onKeyDown={this.onKeyDown} onSubmit={this.handleSubmit}>

        <Row gutter={basicStyle.gutter}>
          <Col md={{span: 8}} sm={{span: 12}} xs={{span: 24}}>
            <FormItem>
              {getFieldDecorator('StaffID')(
                <StaffList
                  onValueChange={this.handleChange}
                />
              )}
            </FormItem>
          </Col>

          <Col md={{span: 8}} sm={{span: 12}} xs={{span: 24}}>
            <FormItem>
              {getFieldDecorator('Code')(
                <Input
                  placeholder="Mã đơn hàng"
                  size={'default'}
                />
              )}
            </FormItem>
          </Col>

          <Col md={{span: 2}} sm={{span: 2}} xs={{span: 24}}>
            <Button
              icon={'inbox'}
              type="primary"
              htmlType="submit"
              className="purple-button"
            >
              {'Hàng đã về kho'}
            </Button>
          </Col>
        </Row>

      </Form>
    );
  }

}