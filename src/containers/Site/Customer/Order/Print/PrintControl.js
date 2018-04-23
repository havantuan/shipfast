import React, {Component} from 'react';
import {Button, Col, Form, Input, Row} from 'antd';
import basicStyle from "../../../../../config/basicStyle";
import routerConfig from "../../../../../config/router";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../../stores/index';
import OrderGroupStatuses from "../../../Common/OrderProvider/OrderGroupStatuses";
import SelectDate from "../../../Common/SelectDate/SelectDate";
import {defaultOptionsConfig} from "../../../../../config";
import OrderStatuses from "../../../Common/OrderProvider/OrderStatuses";
import Expand from "../../../../../components/Expand/index";
import City from "../../../Common/Location/City";
import District from "../../../Common/Location/District";
import Ward from "../../../Common/Location/Ward";
import {trimPrefix} from "../../../../../helpers/utility";
import ServiceType from "../../../Common/ServiceTypeProvider/ServiceType";

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
@inject(Keys.router, Keys.myLabelOrder)
@observer
export default class PrintControl extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      SenderCityID: null,
      SenderDistrictID: null,
      ReceiverCityID: null,
      ReceiverDistrictID: null,
      OrderGroupCode: null,
      groupStatusCodes: null
    };
    this.myLabelOrder = props.myLabelOrder;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const prefixFormID = this.props.prefixFormID || '';
        let {
          Code,
          SenderQuery,
          ReceiverQuery,
          ReceiverCityID,
          ReceiverDistrictID,
          ReceiverWardID,
          GroupStatusCodes,
          StatusCodes,
          StaffID,
          CustomerQuery,
          ServiceTypeID,
          CreatedDate
        } = trimPrefix(values, prefixFormID);
        let credentials = {
          Codes: Code ? [Code] : undefined,
          SenderQuery,
          ReceiverQuery,
          ReceiverCityID: (ReceiverCityID && +ReceiverCityID) || undefined,
          ReceiverDistrictID: (ReceiverDistrictID && +ReceiverDistrictID) || undefined,
          ReceiverWardID: (ReceiverWardID && +ReceiverWardID) || undefined,
          GroupStatusCodes: Array.isArray(GroupStatusCodes) ? GroupStatusCodes.map(val => +val) : undefined,
          StatusCodes: Array.isArray(StatusCodes) ? StatusCodes.map(val => +val) : undefined,
          StaffID,
          CustomerQuery,
          ServiceTypeID: ServiceTypeID ? +ServiceTypeID : undefined,
          CreatedFrom: CreatedDate ? CreatedDate[0] : undefined,
          CreatedTo: CreatedDate ? CreatedDate[1] : undefined
        };
        this.myLabelOrder.onFilter(credentials);
      }
    });
  };

  redirectToPrintMuti = () => {
    let arr_code = this.myLabelOrder.code;
    window.open(routerConfig.printMuti.replace(":code", arr_code.toString()));
  };


  handleChangeGroupStatusCodes = (value) => {
    let groupStatusCodes = Array.isArray(value) ? value.map(val => +val) : undefined;
    this.setState({groupStatusCodes});
  };

  onCityIDReceiverChange = (CityID) => {
    this.setState({
      ReceiverCityID: CityID,
      ReceiverDistrictID: null
    });
  };

  onDistrictIDReceiverChange = (DistrictID) => {
    this.setState({
      ReceiverDistrictID: DistrictID
    });
  };

  render() {
    const {orangeButton} = basicStyle;
    const {getFieldDecorator} = this.props.form;
    const {pagination, code} = this.myLabelOrder;
    const prefixFormID = this.props.prefixFormID || '';

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
                    {
                      getFieldDecorator(prefixFormID + 'GroupStatusCodes')(
                        <OrderGroupStatuses
                          mode={'multiple'}
                          maxTagCount={3}
                          placeholder={'Chọn nhóm trạng thái'}
                          onChange={this.handleChangeGroupStatusCodes}
                        />
                      )
                    }
                  </FormItem>
                </Col>
              </Row>

              <Row gutter={basicStyle.gutter}>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label={'Trạng thái'}
                  >
                    {
                      getFieldDecorator(prefixFormID + 'StatusCodes')(
                        <OrderStatuses
                          groupStatusCodes={this.state.groupStatusCodes}
                          mode={'multiple'}
                          maxTagCount={1}
                          placeholder={'Chọn trạng thái'}
                        />
                      )
                    }
                  </FormItem>
                </Col>
                <Col md={12} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={'Thời gian tạo'}
                  >
                    {getFieldDecorator(prefixFormID + 'CreatedDate', {
                      initialValue: this.props.myLabelOrder.timeSelected
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
                    label={'Người nhận'}
                  >
                    {getFieldDecorator(prefixFormID + 'ReceiverQuery')(
                      <Input placeholder={'Tên, số ĐT người nhận'}/>
                    )}
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label={'Mã đơn hàng'}
                  >
                    {getFieldDecorator(prefixFormID + 'Code')(
                      <Input placeholder="Mã đơn hàng"
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>

              {
                this.myLabelOrder.expandSearch &&
                <Row>
                  <Col span={24}>
                    <Row gutter={basicStyle.gutter}>
                      <Col sm={12} xs={24}>
                        <FormItem
                          {...formItemLayout}
                          label={'Tỉnh/Thành nhận'}
                        >
                          {getFieldDecorator(prefixFormID + 'ReceiverCityID')(
                            <City
                              placeholder="Tỉnh/Thành nhận"
                              onValueChange={this.onCityIDReceiverChange}
                              form={this.props.form}
                              resetFields={[prefixFormID + 'ReceiverDistrictID', prefixFormID + 'ReceiverWardID']}
                            />
                          )}
                        </FormItem>
                      </Col>

                      <Col sm={12} xs={24}>
                        <FormItem
                          {...formItemLayout}
                          label={'Dịch vụ'}
                        >
                          {getFieldDecorator(prefixFormID + 'ServiceTypeID')(
                            <ServiceType/>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={basicStyle.gutter}>
                      <Col sm={12} xs={24}>
                        <FormItem
                          {...formItemLayout}
                          label={'Phường/Xã nhận'}
                        >
                          {getFieldDecorator(prefixFormID + 'ReceiverWardID')(
                            <Ward
                              form={this.props.form}
                              placeholder="Phường/Xã nhận"
                              DistrictID={this.state.ReceiverDistrictID}
                            />
                          )}
                        </FormItem>
                      </Col>

                      <Col sm={12} xs={24}>
                        <FormItem
                          {...formItemLayout}
                          label={'Quận/Huyện nhận'}
                        >
                          {getFieldDecorator(prefixFormID + 'ReceiverDistrictID')(
                            <District
                              placeholder="Quận/Huyện nhận"
                              onValueChange={this.onDistrictIDReceiverChange}
                              form={this.props.form}
                              CityID={this.state.ReceiverCityID}
                              resetFields={[prefixFormID + 'ReceiverWardID']}
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
              <Row gutter={5}>
                <Col span={24}>
                  <FormItem>
                    <Expand
                      style={{width: '100%'}}
                      expandable={this.myLabelOrder.expandSearch}
                      onClick={this.myLabelOrder.onToggleExpandSearch}
                    />
                  </FormItem>
                </Col>
              </Row>
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
                      style={{...orangeButton, width: '100%'}}
                      onClick={this.redirectToPrintMuti}
                    >
                      In {code.length} / {pagination.total ? pagination.total : '0'}
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
