import React, {Component} from 'react';
import {Button, Col, Form, Input, Row} from 'antd';
import basicStyle from "../../../../../config/basicStyle";
import SelectDate from "../../../Common/SelectDate/SelectDate";
import {defaultOptionsConfig} from "../../../../../config";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../stores/index";
import StaffList from "../../../Common/Staff/StaffList";

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
@inject(Keys.handerOver)
@observer
export default class HandOverTableControl extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Form values: ', values);
      if (!err) {
        let {Query, AssignStaffID, StaffID, HubID, CreatedDate} = values;
        let credentials = {
          Query,
          AssignStaffID: AssignStaffID ? +AssignStaffID : null,
          StaffID: StaffID ? +StaffID : null,
          HubID: HubID ? +HubID : null,
          CreatedFrom: CreatedDate ? CreatedDate[0] : undefined,
          CreatedTo: CreatedDate ? CreatedDate[1] : undefined
        };
        this.props.handerOver.onFilter(credentials);
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
                  label={'Tìm kiếm'}
                >
                  {getFieldDecorator('Query')(
                    <Input placeholder="Tìm kiếm theo mã"/>
                  )}
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Thời gian tạo'}
                >
                  {getFieldDecorator('CreatedDate', {
                    initialValue: this.props.handerOver.timeSelected
                  })(
                    <SelectDate
                      title={'Thời gian tạo'}
                      placeholder={'Khoảng thời gian tạo'}
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
                      placeholder="Nhân viên"
                      form={this.props.form}
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
                      placeholder="Người giao việc"
                      form={this.props.form}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Col>

          <Col md={6} xs={24}>
            <FormItem>
              <Button
                style={{width: '100%'}}
                icon={'search'}
                htmlType="submit"
                type={'primary'}
                className={'btnSearch'}
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
