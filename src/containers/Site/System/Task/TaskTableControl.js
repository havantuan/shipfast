import React, {PureComponent} from 'react';
import {Button, Col, Form, Input, Row, message} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import './Style.css';
import Permission from "../../../../permissions/index";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import StaffList from "../../Common/Staff/StaffList";

const FormItem = Form.Item;

@Form.create()
@inject(Keys.grantTask, Keys.taskAssignGroup, Keys.me)
@observer
export default class TaskTableControl extends PureComponent {

  constructor(props) {
    super(props);
    this.grantTask = props.grantTask;
    this.taskAssignGroup = props.taskAssignGroup;
    this.me = props.me;
  }

  onKeyDown = (e) => {
    // 9 - Tab
    // 13 - Enter
    let scannerKey = this.me.scannerKey();
    if (e.which === scannerKey && scannerKey !== 13) {
      this.submitForm();
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.submitForm();
  };

  submitForm = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let {
          StaffID,
          Code
        } = values;
        if (!StaffID) {
          message.error('Vui lòng chọn nhân viên cần giao việc');
          return;
        }
        if (!Code) {
          message.error('Vui lòng nhập mã công việc hoặc mã đơn hàng');
          return;
        }
        this.grantTask.grantTaskByStaff(+StaffID, {Codes: [Code]}).then((data) => {
          this.props.form.resetFields(['Code']);
        });
      }
    });
  };

  resetTaskControl = () => {
    this.props.form.setFieldsValue({"Code": null});
  };

  handleChange = (value) => {
    this.grantTask.onChangeStaffID(value);
  };

  componentWillUnmount() {
    this.taskAssignGroup.clearData();
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} onKeyDown={this.onKeyDown}>

        <Row gutter={basicStyle.gutter}>
          <Col md={{span: 8}} sm={{span: 12}} xs={{span: 24}}>
            <FormItem>
              {getFieldDecorator('StaffID')(
                <StaffList onValueChange={this.handleChange}/>
              )}
            </FormItem>
          </Col>

          <Col md={{span: 8}} sm={{span: 12}} xs={{span: 24}}>
            <FormItem>
              {getFieldDecorator('Code')(
                <Input placeholder="Mã công việc/ Mã đơn hàng" size={'default'}/>
              )}
            </FormItem>
          </Col>

          <Col md={{span: 2}} sm={{span: 2}} xs={{span: 24}}>
            {Permission.allowAssignTaskStaff() ?
              <Button
                icon={'rocket'}
                type="primary"
                htmlType="submit"
                className="purple-button"
                loading={this.grantTask.isGranting}
              >
                Giao việc
              </Button>
              : ''}
          </Col>
        </Row>

      </Form>
    );
  }

}