import React, {Component} from 'react';
import {Button, Col, Input, Form, Row} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import StaffList from "../../Common/Staff/StaffList";
import HubsList from "../../Common/HubProvider/hubList";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import {defaultOptionsConfig} from "../../../../config";
import SelectDate from "../../Common/SelectDate/SelectDate";
import Expand from "../../../../components/Expand/index";
import TaskOrderGroupStatuses from "../../Common/TaskOrderGroupStatus/TaskOrderGroupStatuses";
import EnumTaskType from "../../Common/EnumProvider/taskType";

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
const onlyFormItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 4},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 20},
  },
};
const FormItem = Form.Item;
@Form.create()
@inject(Keys.TaskOrder, Keys.groupTaskOrderStatus)
@observer
export default class TaskOrderTableControl extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Form values: ', values);
      if (!err) {
        let {HubID, StaffID, ReceiverQuery, TasksOrdersGroupStatuses, Type, AssignedDate, UpdatedDate} = values;
        let credentials = {
          StaffID: StaffID ? +StaffID : null,
          HubID: HubID ? +HubID : null,
          ReceiverQuery: ReceiverQuery,
          TasksOrdersGroupStatuses: Array.isArray(TasksOrdersGroupStatuses) ? TasksOrdersGroupStatuses.map(val => +val) : undefined,
          Type,
          AssignedFrom: AssignedDate ? AssignedDate[0] : undefined,
          AssignedTo: AssignedDate ? AssignedDate[1] : undefined,
          UpdatedFrom: UpdatedDate ? UpdatedDate[0] : undefined,
          UpdatedTo: UpdatedDate ? UpdatedDate[1] : undefined
        };
        this.props.TaskOrder.onFilter(credentials);
      }
    });
  };

  exportExcel = () => {
    let values = this.props.form.getFieldsValue();
    let {StaffID, HubID, TasksOrdersGroupStatuses, ReceiverQuery, Type, AssignedDate, UpdatedDate} = values;
    let credentials = {
      StaffID: StaffID ? +StaffID : null,
      AssignedFrom: AssignedDate ? AssignedDate[0] : undefined,
      AssignedTo: AssignedDate ? AssignedDate[1] : undefined,
      UpdatedFrom: UpdatedDate ? UpdatedDate[0] : undefined,
      UpdatedTo: UpdatedDate ? UpdatedDate[1] : undefined,
      TasksOrdersGroupStatuses: Array.isArray(TasksOrdersGroupStatuses) ? TasksOrdersGroupStatuses.map(val => +val) : undefined,
      HubID: HubID ? +HubID : null,
      ReceiverQuery: ReceiverQuery,
      Type
    };
    this.props.TaskOrder.exportExcelTask(credentials);
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    let {filter} = this.props.TaskOrder;
    let groupStatuses = [];
    if (filter && filter.TasksOrdersGroupStatuses) {
      groupStatuses = filter.TasksOrdersGroupStatuses.map(val => `${val}`);
    }

    return (
      <Form onSubmit={this.handleSubmit} className={'custom-form'}>
        <Row gutter={basicStyle.gutter}>
          <Col md={18} sm={24}>
            <Row gutter={basicStyle.gutter}>
              <Col sm={24} xs={24}>
                <FormItem
                  {...onlyFormItemLayout}
                  label={'Nhóm trạng thái '}
                >
                  {
                    getFieldDecorator('TasksOrdersGroupStatuses', {
                      initialValue: groupStatuses
                    })(
                      <TaskOrderGroupStatuses
                        mode={'multiple'}
                        maxTagCount={3}
                        placeholder={'Chọn nhóm trạng thái'}
                      />
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={basicStyle.gutter}>
              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Nhập tên nhân viên'}
                >
                  {getFieldDecorator('StaffID')(
                    <StaffList
                      form={this.props.form}
                      all={true}
                    />
                  )}
                </FormItem>
              </Col>
              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Thời gian giao việc'}
                >
                  {getFieldDecorator('AssignedDate', {
                    initialValue: this.props.TaskOrder.assignedDateSelected
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
                  label={'Điểm gửi hàng'}
                >
                  {getFieldDecorator('HubID')(
                    <HubsList
                      show={true}
                      placeholder="Nhập điểm gửi hàng"/>
                  )}
                </FormItem>
              </Col>
              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Loại công việc'}
                >
                  {getFieldDecorator('Type')(
                    <EnumTaskType
                      valueByCode
                      placeholder={'Loại công việc'}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            {
              this.props.TaskOrder.expandSearch &&
              <Row gutter={basicStyle.gutter}>
                <Col sm={12} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={'Người nhận'}
                  >
                    {getFieldDecorator('ReceiverQuery')(
                      <Input placeholder="Người nhận"/>
                    )}
                  </FormItem>
                </Col>

                <Col sm={12} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={'Cập nhật'}
                  >
                    {getFieldDecorator('UpdatedDate')(
                      <SelectDate/>
                    )}
                  </FormItem>
                </Col>
              </Row>
            }
          </Col>

          <Col md={6} xs={24}>
            <FormItem>
              <Expand
                style={{width: '100%', marginBottom: 0}}
                expandable={this.props.TaskOrder.expandSearch}
                onClick={this.props.TaskOrder.onToggleExpandSearch}
              />
            </FormItem>

            <Row gutter={5}>
              <Col span={12}>
                <FormItem>
                  <Button
                    style={{width: '100%'}}
                    icon={'search'}
                    type="primary"
                    htmlType="submit"
                  >
                    Tìm kiếm
                  </Button>
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem>
                  <Button
                    icon={'file-excel'}
                    style={basicStyle.greenButton}
                    onClick={this.exportExcel}
                  >
                    Xuất excel
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
