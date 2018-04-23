import React, {Component} from 'react';
import {Button, Col, Form, Input, Row} from 'antd';
import basicStyle from "../../../../../../config/basicStyle";
import routerConfig from "../../../../../../config/router";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../../../stores/index';
import ObjectPath from 'object-path';
import EnumTaskType from "../../../../Common/EnumProvider/taskType";
import SelectDate from "../../../../Common/SelectDate/SelectDate";
import {defaultOptionsConfig} from "../../../../../../config";
import TaskStatuses from "../../../../Common/StatusProvider/TaskStatuses";
import Expand from "../../../../../../components/Expand/index";
import StaffList from "../../../../Common/Staff/StaffList";

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
@inject(Keys.printTasks, Keys.router)
@observer
export default class PrintTaskControl extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
    this.printTasks = props.printTasks;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          Code, SenderQuery, ReceiverQuery, StaffID, Type, StatusCodes, CreatedDate, ExpiredDate
        } = values;
        let credentials = {
          SenderQuery,
          ReceiverQuery,
          Code,
          StaffID: StaffID ? +StaffID : undefined,
          Type,
          StatusCodes: Array.isArray(StatusCodes) ? StatusCodes.map(val => +val) : undefined,
          CreatedFrom: CreatedDate ? CreatedDate[0] : undefined,
          CreatedTo: CreatedDate ? CreatedDate[1] : undefined,
          ExpiredFrom: ExpiredDate ? ExpiredDate[0] : undefined,
          ExpiredTo: ExpiredDate ? ExpiredDate[1] : undefined
        };
        this.printTasks.onFilter(credentials);
      }
    });
  };

  redirectToPrint = () => {
    let arr_code = this.printTasks.selectedRowKeys;
    window.open(routerConfig.printMultipleOfTask.replace(":code", arr_code.toString()));
  };

  render() {
    const {orangeButton} = basicStyle;
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
                    initialValue: this.printTasks.createdDateSelected
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
              this.printTasks.expandSearch &&
              <Row>
                <Col span={24}>
                  <Row gutter={basicStyle.gutter}>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Người gửi'}
                      >
                        {getFieldDecorator('SenderQuery')(
                          <Input placeholder="Tên/SĐT người gửi"/>
                        )}
                      </FormItem>
                    </Col>

                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Người nhận'}
                      >
                        {getFieldDecorator('ReceiverQuery')(
                          <Input placeholder="Tên/SĐT người nhận"/>
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
                        label={'Hạn công việc'}
                      >
                        {getFieldDecorator('ExpiredDate')(
                          <SelectDate/>
                        )}
                      </FormItem>
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
                expandable={this.printTasks.expandSearch}
                onClick={this.printTasks.onToggleExpandSearch}
              />
            </FormItem>

            <Row gutter={5}>
              <Col md={12} xs={24}>
                <FormItem>
                  <Button
                    style={{width: '100%'}}
                    icon={'search'}
                    type="primary"
                    htmlType="submit"
                    loading={this.printTasks.fetching}
                  >
                    Tìm kiếm
                  </Button>
                </FormItem>
              </Col>

              <Col md={12} xs={24}>
                <FormItem>
                  <Button
                    style={{width: '100%', ...orangeButton}}
                    icon={'printer'}
                    type="default"
                    loading={this.printTasks.fetching}
                    onClick={this.redirectToPrint}
                  >
                    {`In ${this.printTasks.selectedRowKeys.length}/${ObjectPath.get(this.printTasks.pagination, 'total')}`}
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
