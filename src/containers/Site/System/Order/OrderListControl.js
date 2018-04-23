import React, {Component} from 'react';
import {Button, Col, Form, Input, Row} from 'antd';
import City from '../../Common/Location/City';
import District from '../../Common/Location/District';
import Ward from '../../Common/Location/Ward';
import basicStyle from "../../../../config/basicStyle";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import OrderGroupStatuses from "../../Common/OrderProvider/OrderGroupStatuses";
import OrderStatuses from "../../Common/OrderProvider/OrderStatuses";
import Expand from "../../../../components/Expand/index";
import {defaultOptionsConfig} from "../../../../config";
import SelectDate from "../../Common/SelectDate/SelectDate";
import StaffList from "../../Common/Staff/StaffList";
import ServiceType from "../../Common/ServiceTypeProvider/ServiceType";

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

@Form.create()
@inject(Keys.order, Keys.me)
@observer
export default class OrderListControl extends Component {

  constructor() {
    super();
    this.state = {
      SenderCityID: null,
      SenderDistrictID: null,
      ReceiverCityID: null,
      ReceiverDistrictID: null,
      OrderGroupCode: null,
      groupStatusCodes: null
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          Code,
          SenderQuery,
          ReceiverQuery,
          SenderCityID,
          SenderDistrictID,
          ReceiverCityID,
          ReceiverDistrictID,
          SenderWardID,
          ReceiverWardID,
          GroupStatusCodes,
          StatusCodes,
          StaffID,
          CustomerQuery,
          ServiceTypeID,
          CreatedDate
        } = values;
        let credentials = {
          Codes: Code ? [Code] : undefined,
          SenderQuery,
          ReceiverQuery,
          SenderCityID: (SenderCityID && +SenderCityID) || undefined,
          SenderDistrictID: (SenderDistrictID && +SenderDistrictID) || undefined,
          ReceiverCityID: (ReceiverCityID && +ReceiverCityID) || undefined,
          ReceiverDistrictID: (ReceiverDistrictID && +ReceiverDistrictID) || undefined,
          SenderWardID: (SenderWardID && +SenderWardID) || undefined,
          ReceiverWardID: (ReceiverWardID && +ReceiverWardID) || undefined,
          GroupStatusCodes: Array.isArray(GroupStatusCodes) ? GroupStatusCodes.map(val => +val) : undefined,
          StatusCodes: Array.isArray(StatusCodes) ? StatusCodes.map(val => +val) : undefined,
          StaffID: StaffID ? +StaffID : null,
          CustomerQuery,
          ServiceTypeID: ServiceTypeID ? +ServiceTypeID : undefined,
          CreatedFrom: CreatedDate ? CreatedDate[0] : undefined,
          CreatedTo: CreatedDate ? CreatedDate[1] : undefined,
        };
        this.props.order.onFilter(credentials);
      }
    });
  };

  handleChangeGroupStatusCodes = (value) => {
    let groupStatusCodes = Array.isArray(value) ? value.map(val => +val) : undefined;
    this.setState({groupStatusCodes});
  };

  onCityIDSenderChange = (CityID) => {
    this.setState({
      SenderCityID: CityID,
      SenderDistrictID: null
    });
  };

  onCityIDReceiverChange = (CityID) => {
    this.setState({
      ReceiverCityID: CityID,
      ReceiverDistrictID: null
    });
  };

  onDistrictIDSenderChange = (DistrictID) => {
    this.setState({
      SenderDistrictID: DistrictID
    });
  };

  onDistrictIDReceiverChange = (DistrictID) => {
    this.setState({
      ReceiverDistrictID: DistrictID
    });
  };

  exportExcel = () => {
    let values = this.props.form.getFieldsValue();

    let {
      Code,
      SenderQuery,
      ReceiverQuery,
      SenderCityID,
      SenderDistrictID,
      ReceiverCityID,
      ReceiverDistrictID,
      SenderWardID,
      ReceiverWardID,
      GroupStatusCodes,
      StatusCodes,
      StaffID,
      CustomerQuery,
      ServiceTypeID,
      CreatedDate
    } = values;
    let credentials = {
      Codes: Code ? [Code] : undefined,
      SenderQuery,
      ReceiverQuery,
      SenderCityID: (SenderCityID && +SenderCityID) || undefined,
      SenderDistrictID: (SenderDistrictID && +SenderDistrictID) || undefined,
      ReceiverCityID: (ReceiverCityID && +ReceiverCityID) || undefined,
      ReceiverDistrictID: (ReceiverDistrictID && +ReceiverDistrictID) || undefined,
      SenderWardID: (SenderWardID && +SenderWardID) || undefined,
      ReceiverWardID: (ReceiverWardID && +ReceiverWardID) || undefined,
      GroupStatusCodes: Array.isArray(GroupStatusCodes) ? GroupStatusCodes.map(val => +val) : undefined,
      StatusCodes: Array.isArray(StatusCodes) ? StatusCodes.map(val => +val) : undefined,
      // CreatedFrom: this.props.order.filter.CreatedFrom,
      // CreatedTo: this.props.order.filter.CreatedTo,
      StaffID: StaffID ? +StaffID : null,
      CustomerQuery,
      ServiceTypeID: ServiceTypeID ? +ServiceTypeID : undefined,
      CreatedFrom: CreatedDate ? CreatedDate[0] : undefined,
      CreatedTo: CreatedDate ? CreatedDate[1] : undefined,
    };
    this.props.order.exportExcelOrder(credentials);
  };


  render() {
    const {getFieldDecorator} = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit} className={'custom-form'}>
        <Row gutter={basicStyle.gutter}>
          <Col md={18} sm={24}>
            <Row gutter={basicStyle.gutter}>
              <Col span={24}>
                <FormItem
                  {...onlyFormItemLayout}
                  label={'Nhóm trạng thái'}
                >
                  {getFieldDecorator('GroupStatusCodes')(
                    <OrderGroupStatuses
                      mode={'multiple'}
                      maxTagCount={3}
                      placeholder={'Chọn nhóm trạng thái'}
                      onChange={this.handleChangeGroupStatusCodes}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={basicStyle.gutter}>
              <Col md={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Trạng thái'}
                >
                  {getFieldDecorator('StatusCodes')(
                    <OrderStatuses
                      groupStatusCodes={this.state.groupStatusCodes}
                      mode={'multiple'}
                      maxTagCount={1}
                      placeholder={'Chọn trạng thái'}
                    />
                  )}
                </FormItem>
              </Col>

              <Col md={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Thời gian tạo'}
                >
                  {getFieldDecorator('CreatedDate', {
                    initialValue: this.props.order.timeSelected
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
                  label={'Mã đơn hàng'}
                >
                  {getFieldDecorator('Code')(
                    <Input placeholder="Mã đơn hàng"
                    />
                  )}
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Khách hàng'}
                >
                  {getFieldDecorator('CustomerQuery')(
                    <Input placeholder={'Mã, Tên, SĐT Khách hàng'}/>
                  )}
                </FormItem>
              </Col>
            </Row>

            {
              this.props.order.expandSearch &&
              <Row>
                <Col span={24}>
                  <Row gutter={basicStyle.gutter}>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Nhân viên'}
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
                        label={'Dịch vụ'}
                      >
                        {getFieldDecorator('ServiceTypeID')(
                          <ServiceType/>
                        )}
                      </FormItem>
                    </Col>
                  </Row>

                  <Row gutter={basicStyle.gutter}>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Người gửi'}
                      >
                        {getFieldDecorator('SenderQuery')(
                          <Input placeholder={'Tên, SĐT người gửi'}/>
                        )}
                      </FormItem>
                    </Col>

                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Người nhận'}
                      >
                        {getFieldDecorator('ReceiverQuery')(
                          <Input placeholder={'Tên, số ĐT người nhận'}/>
                        )}
                      </FormItem>
                    </Col>
                  </Row>

                  <Row gutter={basicStyle.gutter}>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Tỉnh/Thành gửi'}
                      >
                        {getFieldDecorator('SenderCityID')(
                          <City
                            placeholder="Tỉnh/Thành gửi"
                            onValueChange={this.onCityIDSenderChange}
                            form={this.props.form}
                            resetFields={['SenderDistrictID', 'SenderWardID']}
                          />
                        )}
                      </FormItem>
                    </Col>

                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Tỉnh/Thành nhận'}
                      >
                        {getFieldDecorator('ReceiverCityID')(
                          <City
                            placeholder="Tỉnh/Thành nhận"
                            onValueChange={this.onCityIDReceiverChange}
                            form={this.props.form}
                            resetFields={['ReceiverDistrictID', 'ReceiverWardID']}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>

                  <Row gutter={basicStyle.gutter}>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Quận/Huyện gửi'}
                      >
                        {getFieldDecorator('SenderDistrictID')(
                          <District
                            placeholder="Quận/Huyện gửi"
                            onValueChange={this.onDistrictIDSenderChange}
                            form={this.props.form}
                            CityID={this.state.SenderCityID}
                            resetFields={['SenderWardID']}
                          />
                        )}
                      </FormItem>
                    </Col>

                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Quận/Huyện nhận'}
                      >
                        {getFieldDecorator('ReceiverDistrictID')(
                          <District
                            placeholder="Quận/Huyện nhận"
                            onValueChange={this.onDistrictIDReceiverChange}
                            form={this.props.form}
                            CityID={this.state.ReceiverCityID}
                            resetFields={['ReceiverWardID']}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>

                  <Row gutter={basicStyle.gutter}>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Phường/Xã gửi'}
                      >
                        {getFieldDecorator('SenderWardID')(
                          <Ward
                            form={this.props.form}
                            placeholder="Phường/Xã gửi"
                            DistrictID={this.state.SenderDistrictID}
                          />
                        )}
                      </FormItem>
                    </Col>

                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Phường/Xã nhận'}
                      >
                        {getFieldDecorator('ReceiverWardID')(
                          <Ward
                            form={this.props.form}
                            placeholder="Phường/Xã nhận"
                            DistrictID={this.state.ReceiverDistrictID}
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
                style={{width: '100%'}}
                expandable={this.props.order.expandSearch}
                onClick={this.props.order.onToggleExpandSearch}
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
                    style={{...basicStyle.greenButton, width: '100%'}}
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

