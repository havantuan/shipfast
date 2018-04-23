import React, {Component} from 'react';
import {Button, Col, Form, Input, Row} from 'antd';
import basicStyle from "../../../../../config/basicStyle";
import ServiceType from "../../../Common/ServiceTypeProvider/ServiceType";
import City from '../../../Common/Location/City';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../stores/index";
import SelectDate from "../../../Common/SelectDate/SelectDate";
import {defaultOptionsConfig} from "../../../../../config";
import Expand from "../../../../../components/Expand/index";
import Ward from "../../../Common/Location/Ward";
import District from "../../../Common/Location/District";

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
@inject(Keys.wattingOrder)
@observer
export default class OrderWattingTableControl extends Component {

  constructor(props) {
    super(props);
    this.state = {
      SenderCityID: null,
      SenderDistrictID: null,
      ReceiverCityID: null,
      ReceiverDistrictID: null,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Form values: ', values);
      if (!err) {
        let {Codes, ReceiverCityID, ServiceTypeID, CreatedDate,
          CustomerQuery, SenderQuery, ReceiverQuery, SenderCityID,
          SenderDistrictID, ReceiverDistrictID, SenderWardID, ReceiverWardID} = values;
        let credentials = {
          Codes: Codes ? [Codes] : undefined,
          ReceiverCityID: ReceiverCityID ? +ReceiverCityID : null,
          ServiceTypeID: ServiceTypeID ? +ServiceTypeID : null,
          CreatedFrom: CreatedDate ? CreatedDate[0] : undefined,
          CreatedTo: CreatedDate ? CreatedDate[1] : undefined,
          CustomerQuery,
          SenderQuery,
          ReceiverQuery,
          SenderCityID: SenderCityID ? +SenderCityID : undefined,
          SenderDistrictID : SenderDistrictID ? +SenderDistrictID : undefined,
          ReceiverDistrictID : ReceiverDistrictID ? +ReceiverDistrictID : undefined,
          SenderWardID : SenderWardID ? +SenderWardID : undefined,
          ReceiverWardID : ReceiverWardID ? +ReceiverWardID : undefined,
        };
        this.props.wattingOrder.onFilter(credentials);
      }
    });
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

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className={'custom-form'}>
        <Row gutter={basicStyle.gutter}>
          <Col md={18} sm={24}>
            <Row gutter={basicStyle.gutter}>
              <Col md={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Mã đơn hàng'}
                >
                  {getFieldDecorator('Codes')(
                    <Input placeholder="Mã đơn hàng"
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
                    initialValue: this.props.wattingOrder.createdDateSelected
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
                  label={'Dịch vụ'}
                >
                  {getFieldDecorator('ServiceTypeID')(
                    <ServiceType/>
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
              this.props.wattingOrder.expandSearch &&
              <Row>
                <Col span={24}>
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
                          <Input placeholder={'Tên, số ĐT người gửi'}/>
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
                expandable={this.props.wattingOrder.expandSearch}
                onClick={this.props.wattingOrder.onToggleExpandSearch}
              />
            </FormItem>

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
        </Row>
      </Form>
    )
  }

}
