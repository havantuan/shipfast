import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Col, Divider, Form, Icon, Input, Radio, Row, Switch, Tooltip} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import IconTag from '../../Common/StatusTag/IconTag';
import Ward from '../../Common/Location/Ward';
import ServiceTypeProvider from '../../Common/ServiceTypeProvider/ServiceType';
import basicStyle from '../../../../config/basicStyle';
import DistrictOnly from "../../Common/Location/DistrictOnly";
import InventoryList from "../../Common/InventoryProvider/inventoryList";
import NumberFormat from "react-number-format";
import './Style.css';
import {formatNumber, numberFormat} from '../../../../helpers/utility';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import routerSystem from "../../../../config/routerSystem";
import CollapseDivider from "../../../../components/CollapseDivider";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@Form.create()
@withRouter
@inject(Keys.createOrder, Keys.router, Keys.me)
@observer
export default class OrderCreate extends Component {

  handleChangeInsurrance = () => {
    this.createOrder.toggleInsurrance();
    this.data()
  };

  onChangeIsPickupInHub = (checked) => {
    this.data({IsPickupInHub: checked});
  };

  data = (values = null) => {
    let VasID = this.createOrder.insurrance ? 4 : null;
    let VasIDs = [];
    if (VasID) {
      VasIDs.push(VasID);
    }
    let formValues = this.props.form.getFieldsValue();
    if (values) {
      formValues = {...formValues, ...values}
    }
    let {
      Quantity,
      Cod,
      ReceiverDistrictID,
      ReceiverHubID,
      SenderDistrictID,
      SenderInventoryID,
      ServiceTypeID,
      NetWeight,
      Width,
      Height,
      Length,
      PackageValue,
      SurchargeCost,
      DiscountCode,
      IsPickupInHub,
    } = formValues;
    let credentials = {
      IsPickupInHub: IsPickupInHub,
      DiscountCode: DiscountCode,
      Quantity: Quantity ? +Quantity : null,
      Cod: formatNumber(Cod),
      ReceiverDistrictID: ReceiverDistrictID ? +ReceiverDistrictID : null,
      ReceiverHubID: ReceiverHubID ? +ReceiverHubID : null,
      SenderDistrictID: SenderDistrictID ? +SenderDistrictID : null,
      SenderHubID: 0,
      SenderInventoryID: SenderInventoryID ? +SenderInventoryID : null,
      ServiceTypeID: ServiceTypeID ? +ServiceTypeID : null,
      VasIDs: VasIDs,
      NetWeight: formatNumber(NetWeight),
      Width: formatNumber(Width),
      Height: formatNumber(Height),
      Length: formatNumber(Length),
      PackageValue: formatNumber(PackageValue),
      IsCod: !!Cod,
      SurchargeCost: formatNumber(SurchargeCost)
    };
    // console.log("%c credentials credentials", 'color: #00b33c',credentials)
    if (credentials.SenderDistrictID && credentials.ServiceTypeID && credentials.ReceiverDistrictID && credentials.NetWeight) {
      this.createOrder.getestimatedPriceData(credentials);
    }
  };

  onInventoryIDChange = (senderInventory) => {
    if (senderInventory) {
      this.props.form.setFieldsValue({
        "SenderAddress": senderInventory.Address,
        "SenderName": senderInventory.Name,
        "SenderDistrictID": senderInventory.District.ID.toString(),
        "SenderWardID": senderInventory.Ward.ID.toString(),
        "SenderPhone": senderInventory.Phone.toString(),
      });
      this.setState({
        SenderDistrictID: senderInventory.District.ID.toString()
      })
    }
  };

  onReceiverDistrictIDChange = (DistrictID) => {
    this.createOrder.onReceiverDistrictIDChange(DistrictID);
    this.data();
  };

  onSenderDistrictIDChange = (DistrictID) => {
    this.setState({
      SenderDistrictID: DistrictID
    });
    this.data();
  };

  onServiceTypeChange = (ServiceTypeID) => {
    this.createOrder.onServiceTypeChange(ServiceTypeID);
    this.data();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // if (!err && this.state.SenderPhone.isValid && this.state.ReceiverPhone.isValid) {
      if (!err) {
        let {
          Quantity,
          Cod,
          Code,
          DeliveryNote,
          DeliveryTime,
          DriverID,
          Name,
          PaymentType,
          ReceiverAddress,
          ReceiverDistrictID,
          ReceiverEmail,
          ReceiverHubID,
          ReceiverIdentityNumber,
          ReceiverLat,
          ReceiverPhone,
          ReceiverName,
          ReceiverWardID,
          SenderAddress,
          SenderDistrictID,
          SenderInventoryID,
          SenderName,
          SenderPhone,
          SenderWardID,
          ServiceTypeID,
          NetWeight,
          Width,
          Height,
          Length,
          PackageValue,
          SurchargeCost,
          CanCheck,
          DiscountCode,
          IsPickupInHub
        } = values;

        let credentials = {
          IsPickupInHub: IsPickupInHub,
          DiscountCode: DiscountCode,
          Quantity: +Quantity,
          Cod: formatNumber(Cod),
          Code,
          UserID: this.props.CustomerID,
          DeliveryNote,
          DeliveryTime,
          DriverID,
          Name,
          PaymentType,
          ReceiverAddress,
          ReceiverDistrictID: ReceiverDistrictID ? +ReceiverDistrictID : undefined,
          ReceiverEmail,
          ReceiverHubID: +ReceiverHubID,
          ReceiverIdentityNumber,
          ReceiverLat,
          ReceiverName,
          ReceiverPhone,
          ReceiverWardID: +ReceiverWardID,
          SenderAddress,
          SenderDistrictID: +SenderDistrictID,
          SenderHubID: this.props.me.getCurrentHub(),
          SenderName,
          SenderPhone,
          SenderInventoryID: +SenderInventoryID,
          SenderWardID: +SenderWardID,
          ServiceTypeID: +ServiceTypeID,
          VasIDs: this.createOrder.insurrance ? [4] : [],
          NetWeight: formatNumber(NetWeight),
          Width: formatNumber(Width),
          Height: formatNumber(Height),
          Length: formatNumber(Length),
          PackageValue: formatNumber(PackageValue),
          CanCheck: CanCheck === true ? 1 : null,
          IsCod: !!Cod,
          SurchargeCost: formatNumber(SurchargeCost)
        };

        this.createOrder.createByStaff(credentials).then((data) => {
          this.props.router.push(routerSystem.listOrder);
        });
      }
      else {
        this.createOrder.handleOpenSenderForm();
      }
    });
  };

  constructor(props) {
    super(props);
    this.createOrder = props.createOrder;
    this.state = {
      SenderDistrictID: null
    }
  }

  componentWillUnmount() {
    this.createOrder.clearData();
  }

  expandField(fieldName) {
    this.createOrder.expandField(fieldName);
  }

  render() {
    let {estimatedPriceData: dataSource} = this.createOrder;
    const {rowStyle, gutter} = basicStyle;
    const styleMargin = {marginTop: 5};
    const {getFieldDecorator} = this.props.form;
    const {product, volume, insurrance} = this.createOrder;
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
    const formInventory = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 20},
      },
    };

    return (
      <Form>
        <ContentHolder>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={18} sm={24} xs={24}>
              <Row style={rowStyle} gutter={gutter} justify="start">
                <Col span={24}>
                  <FormItem
                    {...formInventory}
                    label={'Kho hàng'}
                  >
                    {getFieldDecorator('SenderInventoryID')(
                      <InventoryList
                        onValueChange={this.onInventoryIDChange}
                        inventoryProvider={this.inventoryProvider}
                        form={this.props.form}
                        params={['Address']}
                        resetFields={['SenderPhone', 'SenderName', 'SenderAddress', 'SenderDistrictID', 'SenderWardID']}
                        defaultInventory
                      />
                    )}
                  </FormItem>

                  <FormItem
                    {...formInventory}
                    label="Hoặc"
                  >
                    <div>
                      {
                        this.createOrder.senderFormVisible === true ?
                          <Button
                            icon={'up'}
                            onClick={() => this.createOrder.handleToggleSenderForm()}
                            className={'toggle-button'}
                          />
                          :
                          <Button
                            type={'default'}
                            onClick={() => this.createOrder.handleToggleSenderForm()}
                            className={'toggle-button'}
                          >
                            Nhập thông tin người gửi
                          </Button>
                      }
                    </div>
                  </FormItem>

                  <div
                    style={{
                      display: this.createOrder.senderFormVisible === true ? 'block' : 'none',
                      marginTop: '10px'
                    }}
                  >
                    <Row gutter={gutter}>
                      <Col sm={12} xs={24}>
                        <FormItem
                          {...formItemLayout}
                          label="Số điện thoại"
                        >
                          {getFieldDecorator('SenderPhone', {
                            rules: [{
                              required: true,
                              message: ' ',
                            }]
                          })(
                            <Input
                              size="default"
                              placeholder={'Số điện thoại'}
                            />
                          )}
                        </FormItem>

                        <FormItem
                          {...formItemLayout}
                          label="Họ tên"
                        >
                          {getFieldDecorator('SenderName', {
                            rules: [{
                              required: true,
                              message: ' ',
                            }],
                            // initialValue: this.state.SenderName && this.state.SenderName
                          })(
                            <Input size="default" placeholder="Họ tên người gửi"
                                   style={{width: '100%', marginRight: '3%'}}
                            />
                          )}
                        </FormItem>
                      </Col>

                      <Col sm={12} xs={24}>
                        <FormItem
                          {...formItemLayout}
                          label="Quận huyện"
                        >
                          {getFieldDecorator('SenderDistrictID', {
                            rules: [{
                              required: true,
                              message: ' '
                            }],
                            // initialValue: this.state.SenderDistrictID && this.state.SenderDistrictID
                          })(
                            <DistrictOnly
                              placeholder="Quận huyện"
                              onValueChange={this.onSenderDistrictIDChange}
                              form={this.props.form}
                              resetFields={['SenderWardID']}
                              cityID={18}
                            />
                          )}
                        </FormItem>

                        <FormItem
                          {...formItemLayout}
                          label="Xã phường"
                        >
                          {getFieldDecorator('SenderWardID', {
                            rules: [
                              {required: true, message: ' '}
                            ],
                          })(
                            <Ward
                              DistrictID={this.createOrder.SenderDistrictID}
                              form={this.props.form}
                              multi={true}
                            />
                          )}
                        </FormItem>

                        <FormItem
                          {...formItemLayout}
                          label="Địa chỉ"
                        >
                          {getFieldDecorator('SenderAddress', {
                            rules: [{
                              required: true,
                              message: ' ',
                            }],
                          })(
                            <Input placeholder={'Địa chỉ người gửi'}/>
                          )}
                          {/*<AutoCompleteAddress*/}
                          {/*className="ant-input"*/}
                          {/*form={this.props.form}*/}
                          {/*field="SenderAddress"*/}
                          {/*/>*/}
                        </FormItem>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>

              <Divider style={{marginTop: '-6px'}}>Người nhận</Divider>

              <Row style={rowStyle} gutter={gutter} justify="start">
                <Col sm={12} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label="Số điện thoại"
                  >
                    {getFieldDecorator('ReceiverPhone', {
                      rules: [{required: true, message: ' '}]
                    })(
                      <Input
                        size="default"
                        placeholder={'Số điện thoại người nhận'}
                      />
                    )}
                    {/*<NumberPhone*/}
                    {/*phone={this.createOrder.ReceiverPhone}*/}
                    {/*onChange={this.onChangeReceiverPhone}*/}
                    {/*placeholder="Nhập số điện thoại người nhận"*/}
                    {/*/>*/}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="Họ tên"
                  >
                    {getFieldDecorator('ReceiverName', {
                      rules: [{
                        required: true, message: ' ',
                      }]
                    })(
                      <Input size="default" placeholder="Họ tên người nhận"
                             style={{width: '100%', marginRight: '3%'}}
                      />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="Mã khuyến mãi"
                  >
                    {getFieldDecorator('DiscountCode')(
                      <Input size="default" placeholder="Nhập mã khuyến mãi (nếu có)" onBlur={this.data}/>
                    )}
                  </FormItem>
                </Col>

                <Col sm={12} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label="Quận huyện"
                  >
                    {getFieldDecorator('ReceiverDistrictID', {
                      rules: [{
                        required: true,
                        message: ' '
                      }]
                    })(
                      <DistrictOnly
                        placeholder={'Quận huyện người nhận'}
                        onValueChange={this.onReceiverDistrictIDChange}
                        form={this.props.form}
                        resetFields={['ReceiverWardID']}
                      />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="Xã phường"
                  >
                    {getFieldDecorator('ReceiverWardID', {
                      rules: [
                        {required: true, message: ' '}
                      ]
                    })(
                      <Ward
                        placeholder={'Xã phường người nhận'}
                        DistrictID={this.createOrder.ReceiverDistrictID}
                        form={this.props.form}
                        multi={true}
                      />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="Địa chỉ"
                  >
                    {getFieldDecorator('ReceiverAddress', {
                      rules: [{
                        required: true, message: ' ',
                      }]
                    })(
                      <Input placeholder={'Địa chỉ người nhận'}/>
                    )}
                    {/*<AutoCompleteAddress*/}
                    {/*placeholder={'Địa chỉ người nhận'}*/}
                    {/*className="ant-input"*/}
                    {/*form={this.props.form}*/}
                    {/*field="ReceiverAddress"*/}
                    {/*/>*/}
                  </FormItem>
                </Col>
              </Row>

              <Divider style={{marginTop: '-6px'}}>Đơn hàng</Divider>

              <Row style={rowStyle} gutter={gutter} justify="start">
                <Col sm={12} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label="Mã đơn hàng"
                    style={styleMargin}
                  >
                    {getFieldDecorator('Code')(
                      <Input
                        size="default"
                        placeholder="Mã đơn hàng đối tác (không bắt buộc)"
                      />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="Tên hàng"
                  >
                    {getFieldDecorator('Name', {
                      rules: [{
                        required: true, message: ' ',
                      }]
                    })(
                      <Input size="default" placeholder="Ví dụ: Tên sản phẩm"/>
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label={'Bảo hiểm'}
                  >
                    {getFieldDecorator('VasID')(
                      <Switch
                        checked={this.createOrder.insurrance || false}
                        onClick={this.expandField.bind(this, 'insurrance')}
                      />
                    )}
                  </FormItem>
                  {insurrance && (
                    <FormItem
                      {...formItemLayout}
                      label="Giá trị hàng"
                    >
                      {getFieldDecorator('PackageValue', {
                        rules: [{
                          required: true, message: ' ',
                        }]
                      })(
                        <NumberFormat
                          placeholder="Nhập giá trị hàng hóa"
                          thousandSeparator={true} suffix={' VNĐ'}
                          className="ant-input "
                          onBlur={this.data}
                        />
                      )}
                    </FormItem>
                  )}
                </Col>

                <Col sm={12} xs={24}>
                  <FormItem
                    {...formItemLayout}
                    label="Trọng lượng"
                  >
                    {getFieldDecorator('NetWeight', {
                      rules: [{
                        required: true, message: ' ',
                      }]
                    })(
                      <NumberFormat
                        placeholder="gram" thousandSeparator={true}
                        suffix={' gram'} className="ant-input"
                        onBlur={this.data}
                      />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="Ghi chú"
                  >
                    {getFieldDecorator('DeliveryNote')(
                      <Input size="default" placeholder="Ví dụ (hàng dễ vỡ)"/>
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label={'Nhận hàng'}
                  >
                    <Tooltip
                      title={'Nhận hàng tài bưu cục'}
                    >
                      {getFieldDecorator('IsPickupInHub', {
                        valuePropName: 'checked',
                        initialValue: false
                      })(
                        <Switch onChange={this.onChangeIsPickupInHub}/>
                      )}
                    </Tooltip>
                  </FormItem>
                </Col>
              </Row>

              <CollapseDivider
                expandable={this.createOrder.isExpand}
                onClick={this.createOrder.onToggleExpand}
                style={{marginTop: '-16px'}}
              >
                <Row style={rowStyle} gutter={gutter} justify="start">
                  <Col sm={12} xs={24}>
                    <FormItem
                      {...formItemLayout}
                      label={'Kích thước'}
                    >
                      <Input.Group compact>
                        <Col sm={8} xs={24}>
                          <FormItem>
                            {getFieldDecorator('Length', {
                              // rules: [{
                              //   required: true, message: ' ',
                              // }]
                            })(
                              <NumberFormat
                                placeholder="Dài cm"
                                thousandSeparator={true} suffix={' cm'}
                                className="ant-input inline"
                                onBlur={this.data}
                              />
                            )}
                          </FormItem>
                        </Col>

                        <Col sm={8} xs={24}>
                          <FormItem>
                            {getFieldDecorator('Width', {
                              // rules: [{
                              //   required: false, message: ' ',
                              // }]
                            })(
                              <NumberFormat
                                placeholder="Rộng cm"
                                thousandSeparator={true} suffix={' cm'}
                                className="ant-input inline"
                                onBlur={this.data}
                              />
                            )}
                          </FormItem>
                        </Col>

                        <Col sm={8} xs={24}>
                          <FormItem>
                            {getFieldDecorator('Height', {
                              // rules: [{
                              //   required: false, message: ' ',
                              // }]
                            })(
                              <NumberFormat
                                placeholder="Cao cm"
                                thousandSeparator={true} suffix={' cm'}
                                className="ant-input inline"
                                onBlur={this.data}
                              />
                            )}
                          </FormItem>
                        </Col>
                      </Input.Group>
                    </FormItem>

                    <FormItem
                      {...formItemLayout}
                      label={'Cho xem hàng'}
                    >
                      <Tooltip
                        title={'Cho khách xem hàng khi nhận'}
                      >
                        {getFieldDecorator('CanCheck', {
                          valuePropName: 'checked',
                          initialValue: true
                        })(
                          <Switch/>
                        )}
                      </Tooltip>
                    </FormItem>
                  </Col>

                  <Col sm={12} xs={24}>
                    <FormItem
                      {...formItemLayout}
                      label={'Người trả phí'}
                    >
                      {getFieldDecorator('PaymentType', {
                        rules: [
                          {required: true, message: ' '}
                        ],
                        initialValue: 1
                      })(
                        <RadioGroup>
                          <Radio value={1}>Người gửi</Radio>
                          <Radio value={2}>Người nhận</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </CollapseDivider>
            </Col>

            <Col md={6} sm={6} xs={24} className="textLeft">
              <h3>* Tiền thu hộ</h3>
              <FormItem
                style={styleMargin}
              >
                {getFieldDecorator('Cod', {
                  rules: [
                    {required: false, message: ' '}
                  ]
                })(
                  <NumberFormat
                    thousandSeparator={true}
                    suffix={' VNĐ'}
                    className="ant-input"
                    placeholder="Tiền thu hộ COD"
                    onBlur={this.data}
                  />
                )}
              </FormItem>

              <h3>* Phụ phí</h3>
              <FormItem style={styleMargin}>
                {getFieldDecorator('SurchargeCost')(
                  <NumberFormat
                    thousandSeparator={true}
                    suffix={' VNĐ'}
                    className="ant-input"
                    placeholder="Phụ phí"
                    onBlur={this.data}
                  />
                )}
              </FormItem>

              <h3>* Dịch vụ chuyển phát </h3>
              <FormItem style={styleMargin}

              >
                {getFieldDecorator('ServiceTypeID', {
                  rules: [
                    {required: true, message: ' '}
                  ],
                  initialValue: `9`
                })(
                  <ServiceTypeProvider
                    onValueChange={this.onServiceTypeChange}
                  />
                )}
              </FormItem>

              <h3>* Tính phí & tiền thu hộ</h3>
              {dataSource ?
                <table width={'100%'}>
                  <tbody>
                  {dataSource.Costs.map((value, index) =>
                    <tr className="lineHeight" key={index}>
                      <td><IconTag value={value.Code}/> {value.Name}</td>
                      <td style={{textAlign: "right"}}><span
                        style={{color: "#ce1e20"}}>{numberFormat(value.Value)} </span>đ
                      </td>
                    </tr>
                  )}
                  <tr className="lineHeight">
                    <td><Icon type="pay-circle-o" style={{color: '#23b7e5'}}/> Thời
                      gian tối thiểu
                    </td>
                    <td style={{textAlign: "right"}}><span
                      style={{color: "#ce1e20"}}>{dataSource && dataSource.MinTime ? dataSource.MinTime : 0} </span>h

                    </td>
                  </tr>
                  <tr className="lineHeight">
                    <td><Icon type="pay-circle-o" style={{color: '#23b7e5'}}/> Thời
                      gian tối đa
                    </td>
                    <td style={{textAlign: "right"}}><span
                      style={{color: "#ce1e20"}}>{dataSource && dataSource.MaxTime ? dataSource.MaxTime : 0} </span>h

                    </td>
                  </tr>
                  {
                    dataSource && dataSource.Discount && dataSource.Discount !== '0' &&
                    <tr className="lineHeight">
                      <td>
                        <Icon type="pay-circle-o" style={{color: '#23b7e5'}}/>
                        {' Giảm giá'}
                      </td>
                      <td style={{textAlign: "right"}}>
                        <span style={{color: "#ce1e20"}}>
                            {dataSource && dataSource.Discount ? numberFormat(dataSource.Discount) : 0}
                        </span>&nbsp;đ
                      </td>
                    </tr>
                  }

                  <tr className="lineHeight">
                    <td><Icon type="shopping-cart" style={{color: '#23b7e5'}}/> Tổng
                      tiền
                    </td>
                    <td style={{textAlign: "right"}}>
                      <span style={{color: "#ce1e20"}}>
                        {dataSource && dataSource.TotalCost ? numberFormat(dataSource.TotalCost) : 0}
                        </span>&nbsp;đ
                    </td>
                  </tr>
                  </tbody>
                </table>
                : null}

              <FormItem style={styleMargin}>
                <Button
                  type="primary"
                  className="btnNext"
                  htmlType="submit"
                  style={{width: '100%'}}
                  onClick={this.handleSubmit}
                >
                  Tạo
                </Button>

              </FormItem>
            </Col>
          </Row>
        </ContentHolder>
      </Form>
    );
  }
}
