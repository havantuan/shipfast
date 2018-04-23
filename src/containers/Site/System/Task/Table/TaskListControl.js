import React, {Component} from 'react';
import {Button, Col, Form, Input, Row} from 'antd';
import basicStyle from "../../../../../config/basicStyle";
import EnumTaskType from "../../../Common/EnumProvider/taskType";
import TaskStatuses from "../../../Common/StatusProvider/TaskStatuses";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../../stores/index';
import SelectDate from "../../../Common/SelectDate/SelectDate";
import {defaultOptionsConfig} from "../../../../../config";
import Expand from "../../../../../components/Expand/index";
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
@inject(Keys.task)
@observer
export default class TaskListControl extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          Code, Query, StaffID, Type, StatusCodes, CreatedDate, ExpiredDate
        } = values;
        let credentials = {
          Query,
          Code,
          StaffID: StaffID ? +StaffID : undefined,
          Type,
          StatusCodes: Array.isArray(StatusCodes) ? StatusCodes.map(val => +val) : undefined,
          CreatedFrom: CreatedDate ? CreatedDate[0] : undefined,
          CreatedTo: CreatedDate ? CreatedDate[1] : undefined,
          ExpiredFrom: ExpiredDate ? ExpiredDate[0] : undefined,
          ExpiredTo: ExpiredDate ? ExpiredDate[1] : undefined
        };
        this.props.task.onFilter(credentials);
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
                  label={'Mã Công việc'}
                >
                  {getFieldDecorator('Code')(
                    <Input placeholder="Mã công việc"/>
                  )}
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Thời gian tạo'}
                >
                  {getFieldDecorator('CreatedDate', {
                    initialValue: this.props.task.createdDateSelected
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
                  label={'Loại công việc'}
                >
                  {getFieldDecorator('Type')(
                    <EnumTaskType placeholder="Giao hàng" valueByCode/>
                  )}
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Trạng thái'}
                >
                  {getFieldDecorator('StatusCodes')(
                    <TaskStatuses
                      mode={'multiple'}
                      maxTagCount={1}
                      placeholder={'Chọn trạng thái'}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            {
              this.props.task.expandSearch &&
              <Row>
                <Col span={24}>
                  <Row gutter={basicStyle.gutter}>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Khách hàng'}
                      >
                        {getFieldDecorator('Query')(
                          <Input placeholder="Tên/SĐT khách hàng"/>
                        )}
                      </FormItem>
                    </Col>

                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Hạn công việc'}
                      >
                        {getFieldDecorator('ExpiredDate')(
                          <SelectDate/>
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
                    </Col>
                  </Row>
                </Col>
              </Row>
            }

          </Col>

          <Col md={6} xs={24}>
            <FormItem>
              <Expand
                style={{width: '100%', marginBottom: 0}}
                expandable={this.props.task.expandSearch}
                onClick={this.props.task.onToggleExpandSearch}
              />
            </FormItem>

            <Row gutter={5}>
              <Col span={24}>
                <FormItem>
                  <Button
                    style={{width: '100%'}}
                    icon={'search'}
                    type="primary"
                    htmlType="submit"
                    loading={this.props.task.fetching}
                  >
                    Tìm kiếm
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    )
  }

}
