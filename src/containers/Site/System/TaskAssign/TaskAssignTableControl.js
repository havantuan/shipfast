import React, {Component} from 'react';
import {Button, Col, Form, Input, Row} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import StaffList from "../../Common/Staff/StaffList";
import SelectDate from "../../Common/SelectDate/SelectDate";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import {defaultOptionsConfig} from "../../../../config";

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 16},
  },
};

@Form.create()
@inject(Keys.assignConfirm)
@observer
export default class TaskAssignTableControl extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log("%cvalues........... ", 'color: #00b33c', values)
        let {
          Query,
          StaffID,
          AssignStaffID,
          CreatedDate
        } = values;
        let credentials = {
          Query,
          StaffID: StaffID ? +StaffID : null,
          AssignStaffID: AssignStaffID ? +AssignStaffID : null,
          CreatedFrom: CreatedDate ? CreatedDate[0] : undefined,
          CreatedTo: CreatedDate ? CreatedDate[1] : undefined
        };
        console.log("%ccredentials", 'color: #00b33c', credentials)
        this.props.handleSubmit(credentials);
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className={'custom-form'}>
        <Row gutter={basicStyle.gutter}>
          <Col md={18} sm={24}>
            <Row gutter={basicStyle.gutter}>
              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Mã giao việc'}
                >
                  {getFieldDecorator('Query')(
                    <Input
                      placeholder="Nhập mã giao việc"
                      size="default"
                    />
                  )}
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Thời gian tạo'}
                >
                  {getFieldDecorator('CreatedDate', {
                    initialValue: this.props.assignConfirm.createdDateSelected
                  })(
                    <SelectDate
                      defaultSelected={defaultOptionsConfig.date}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={basicStyle.gutter}>
              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Nhân viên'}
                >
                  {getFieldDecorator('StaffID')(
                    <StaffList
                      placeholder="Chọn nhân viên"
                    />
                  )}
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Người giao việc'}
                >
                  {getFieldDecorator('AssignStaffID')(
                    <StaffList
                      placeholder="Chọn người giao việc"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Col>

          <Col sm={6} xs={24}>
            <FormItem>
              <Button
                icon={'search'}
                type={'primary'}
                style={{width: '100%'}}
                htmlType="submit"
              >
                Tìm kiếm
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }

}
