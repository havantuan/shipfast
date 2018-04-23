import React, {PureComponent} from 'react';
import {Button, Col, Form, Input, Row, Select} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import City from '../Location/City';
import District from '../Location/District';
import Ward from '../Location/Ward';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import {trimPrefix} from "../../../../helpers/utility";
import SelectDate from "../SelectDate/SelectDate";
import Expand from "../../../../components/Expand/index";
import {remove_mark} from "../Helpers";

const FormItem = Form.Item;
const {Option} = Select;
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
@inject(Keys.eventOrderStatus, Keys.me)
@observer
export default class ConfirmTableControl extends PureComponent {
  _mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      CityIDSend: null,
      DistrictIDSend: null,
      CityIDReceive: null,
      DistrictIDReceive: null
    };
    this.eventOrderStatus = this.props.eventOrderStatus;
  }

  componentDidMount() {
    this._mounted = true;
    if (this.props.code) {
      this.eventOrderStatus.getDataSource(this.props.code);
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  onCityIDSendChange = (CityID) => {
    this.setState({
      CityIDSend: CityID,
      DistrictIDSend: null
    });
  };

  onCityIDReceiveChange = (CityID) => {
    this.setState({
      CityIDReceive: CityID,
      DistrictIDReceive: null
    });
  };

  onDistrictIDSendChange = (DistrictID) => {
    this.setState({
      DistrictIDSend: DistrictID
    });
  };

  onDistrictIDReceiveChange = (DistrictID) => {
    this.setState({
      DistrictIDReceive: DistrictID
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const prefixFormID = this.props.prefixFormID || '';
        let {
          Codes,
          SenderQuery,
          SenderCityID,
          SenderDistrictID,
          SenderWardID,
          ReceiverQuery,
          ReceiverCityID,
          ReceiverDistrictID,
          ReceiverWardID,
          StatusCodes,
          ServiceTypeID,
          CreatedDate
        } = trimPrefix(values, prefixFormID);

        let credentials = {
          Codes: Codes ? [Codes] : undefined,
          SenderQuery,
          ReceiverQuery,
          SenderCityID: SenderCityID ? +SenderCityID : undefined,
          SenderDistrictID: SenderDistrictID ? +SenderDistrictID : undefined,
          SenderWardID: SenderWardID ? +SenderWardID : undefined,
          ReceiverCityID: ReceiverCityID ? +ReceiverCityID : undefined,
          ReceiverDistrictID: ReceiverDistrictID ? +ReceiverDistrictID : undefined,
          ReceiverWardID: ReceiverWardID ? +ReceiverWardID : undefined,
          StatusCodes: Array.isArray(StatusCodes) && StatusCodes.length > 0 ? StatusCodes.map(val => +val) : undefined,
          ServiceTypeID: ServiceTypeID ? +ServiceTypeID : undefined,
          CreatedFrom: CreatedDate ? CreatedDate[0] : undefined,
          CreatedTo: CreatedDate ? CreatedDate[1] : undefined
        };
        this.props.handleSubmit(credentials);
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {dataSource} = this.eventOrderStatus;
    const {reProcessOrder = {}} = this.props;
    const prefixFormID = this.props.prefixFormID || '';

    return (
      <Form onSubmit={this.handleSubmit} className={'custom-form'}>
        <Row gutter={basicStyle.gutter}>
          <Col md={18} sm={24}>

            <Row gutter={basicStyle.gutter}>
              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Mã đơn hàng'}
                >
                  {getFieldDecorator(prefixFormID + 'Codes')(
                    <Input placeholder="Mã đơn hàng"/>
                  )}
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Thời gian tạo'}
                >
                  {getFieldDecorator(prefixFormID + 'CreatedDate')(
                    <SelectDate/>
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
                  {getFieldDecorator(prefixFormID + 'SenderQuery')(
                    <Input placeholder="Tên, SĐT người gửi"/>
                  )}
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Người nhận'}
                >
                  {getFieldDecorator(prefixFormID + 'ReceiverQuery')(
                    <Input placeholder="Tên, SĐT người nhân"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            {
              reProcessOrder.expandSearch &&
              <Row>
                <Col span={24}>
                  <Row gutter={basicStyle.gutter}>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Tỉnh/Thành gửi'}
                      >
                        {getFieldDecorator(prefixFormID + 'SenderCityID')(
                          <City
                            placeholder="Tỉnh/Thành gửi"
                            onValueChange={this.onCityIDSendChange}
                            form={this.props.form}
                            resetFields={[prefixFormID + 'SenderDistrictID', prefixFormID + 'SenderWardID']}
                          />
                        )}
                      </FormItem>
                    </Col>

                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Tỉnh/Thành nhận'}
                      >
                        {getFieldDecorator(prefixFormID + 'ReceiverCityID')(
                          <City
                            placeholder="Tỉnh/Thành nhận"
                            onValueChange={this.onCityIDReceiveChange}
                            form={this.props.form}
                            resetFields={[prefixFormID + 'ReceiverDistrictID', prefixFormID + 'ReceiverWardID']}
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
                        {getFieldDecorator(prefixFormID + 'SenderDistrictID')(
                          <District
                            placeholder="Quận/Huyện gửi"
                            onValueChange={this.onDistrictIDSendChange}
                            form={this.props.form}
                            CityID={this.state.CityIDSend}
                            resetFields={[prefixFormID + 'SenderWardID']}
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
                            onValueChange={this.onDistrictIDReceiveChange}
                            form={this.props.form}
                            CityID={this.state.CityIDReceive}
                            resetFields={[prefixFormID + 'ReceiverWardID']}
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
                        {getFieldDecorator(prefixFormID + 'SenderWardID')(
                          <Ward
                            form={this.props.form}
                            placeholder="Phường/Xã gửi"
                            DistrictID={this.state.DistrictIDSend}
                          />
                        )}
                      </FormItem>
                    </Col>

                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Phường/Xã nhận'}
                      >
                        {getFieldDecorator(prefixFormID + 'ReceiverWardID')(
                          <Ward
                            form={this.props.form}
                            placeholder="Phường/Xã nhận"
                            DistrictID={this.state.DistrictIDReceive}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
            }

            {
              this.props.code && this.props.code === 599 &&
              <Row gutter={basicStyle.gutter}>
                <Col span={24}>
                  <FormItem
                    {...onlyFormItemLayout}
                    label={'Trạng thái'}
                  >
                    {getFieldDecorator(prefixFormID + 'StatusCodes')(
                      <Select
                        showSearch
                        mode={'multiple'}
                        style={{width: '100%'}}
                        placeholder={"Chọn trạng thái"}
                        optionFilterProp="children"
                        allowClear
                        filterOption={(input, option) => remove_mark(option.props.children).toLowerCase().indexOf(remove_mark(input).toLowerCase()) >= 0}
                        maxTagCount={3}
                      >
                        {dataSource.Statuses && dataSource.Statuses.map((item, index) => (
                          item.Code !== 500 &&
                          <Option
                            value={`${item.Code}`}
                            key={index}
                          >
                            {`${item.Name}`}
                          </Option>
                        ))}
                      </Select>
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
                expandable={reProcessOrder.expandSearch}
                onClick={reProcessOrder.onToggleExpandSearch}
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
