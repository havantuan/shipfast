import React, {Component} from 'react';
import {Button, Col, Form, Input, Row} from 'antd';
import basicStyle from "../../../../../config/basicStyle";
import EnumTaskType from "../../../Common/EnumProvider/taskType";
import City from "../../../Common/Location/City";
import Ward from "../../../Common/Location/Ward";
import District from "../../../Common/Location/District";
import TaskStatuses from "../../../Common/StatusProvider/TaskStatuses";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../../stores/index';
import SelectDate from "../../../Common/SelectDate/SelectDate";
import {defaultOptionsConfig} from "../../../../../config";
import Expand from "../../../../../components/Expand/index";

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
@inject(Keys.myTask, Keys.me)
@observer
export default class MyTasksTableControl extends Component {

  constructor(props) {
    super(props);
    this.state = {
      CityID: null,
      DistrictID: null,
    };
    this.myTask = props.myTask;
  }

  onCityIDChange = (CityID) => {
    this.setState({
      CityID,
      DistrictID: null
    });
  };

  onDistrictIDChange = (DistrictID) => {
    this.setState({
      DistrictID
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          OrderCodeOrTaskCode,
          Query,
          Type,
          CityID,
          DistrictID,
          WardID,
          StatusCodes,
          CreatedDate,
          ExpiredDate,
          SucceedDate
        } = values;
        let credentials = {
          OrderCodeOrTaskCode,
          Query,
          Type,
          CityID: CityID ? +CityID : undefined,
          DistrictID: DistrictID ? +DistrictID : undefined,
          WardID: WardID ? +WardID : undefined,
          StatusCodes: StatusCodes ? StatusCodes.map(val => +val) : undefined,
          CreatedFrom: CreatedDate ? CreatedDate[0] : undefined,
          CreatedTo: CreatedDate ? CreatedDate[1] : undefined,
          ExpiredFrom: ExpiredDate ? ExpiredDate[0] : undefined,
          ExpiredTo: ExpiredDate ? ExpiredDate[1] : undefined,
          SucceedFrom: SucceedDate ? SucceedDate[0] : undefined,
          SucceedTo: SucceedDate ? SucceedDate[1] : undefined
        };
        this.props.myTask.onFilter(credentials);
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
                  label={'Mã CV/Mã Đơn'}
                >
                  {getFieldDecorator('OrderCodeOrTaskCode')(
                    <Input placeholder="Mã công việc/ Mã đơn hàng"/>
                  )}
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Thời gian tạo'}
                >
                  {getFieldDecorator('CreatedDate', {
                    initialValue: this.myTask.createdDateSelected
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
                  label={'Địa chỉ'}
                >
                  {getFieldDecorator('Query')(
                    <Input placeholder={"Tên/SĐT của địa chỉ"}/>
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
                    <EnumTaskType
                      placeholder="Giao hàng"
                      valueByCode={true}
                    />
                  )}
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Hoàn thành'}
                >
                  {getFieldDecorator('SucceedDate')(
                    <SelectDate/>
                  )}
                </FormItem>
              </Col>
            </Row>

            {
              this.myTask.expandSearch &&
              <Row>
                <Col span={24}>
                  <Row gutter={basicStyle.gutter}>
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

                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Tỉnh/Thành'}
                      >
                        {getFieldDecorator('CityID')(
                          <City
                            placeholder="Tỉnh/Thành"
                            onValueChange={this.onCityIDChange}
                            form={this.props.form}
                            resetFields={['DistrictID', 'WardID']}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>

                  <Row gutter={basicStyle.gutter}>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Phường/Xã'}
                      >
                        {getFieldDecorator('WardID')(
                          <Ward
                            form={this.props.form}
                            placeholder="Phường/Xã"
                            DistrictID={this.state.DistrictID}
                          />
                        )}
                      </FormItem>
                    </Col>

                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Quận/Huyện'}
                      >
                        {getFieldDecorator('DistrictID')(
                          <District
                            placeholder="Quận/Huyện"
                            onValueChange={this.onDistrictIDChange}
                            form={this.props.form}
                            CityID={this.state.CityID}
                            resetFields={['WardID']}
                          />
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
                expandable={this.myTask.expandSearch}
                onClick={this.myTask.onToggleExpandSearch}
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
                    loading={this.myTask.fetching}
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
