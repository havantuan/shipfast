import React, {Component} from 'react';
import NumberFormat from "react-number-format";
import ObjectPath from 'object-path';
import {Button, Col, Form, Input, Row, Tag} from 'antd';
import basicStyle from '../../../../../config/basicStyle';
import routerConfig from "../../../../../config/routerSystem";
import HubList from '../../../Common/HubProvider/hubList';
import {formatNumber} from '../../../../../helpers/utility';
import './Style.css';
import VehicleType from "../../../Common/EnumProvider/vehicleType";
import City from '../../../Common/Location/City';
import UserList from "../../../Common/User/UserList";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../stores/index";
import {withRouter} from "react-router-dom";

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
const bigFormItemLayout = {
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
@withRouter
@inject(Keys.staffByUser, Keys.router)
@observer
export default class RegisterStaff extends Component {

  constructor(props) {
    super(props);
    this.id = props.match.params.id;
    this.router = props.router;
    this.staffByUser = props.staffByUser;
  }

  componentDidMount() {
    if (this.staffByUser.isUpdateMode) {
      this.staffByUser.fetchByID(this.id);
    }
  };

  onChangeNameUser = (data) => {
    console.log('%c data data', 'color: #00b33c', data)
    this.staffByUser.onTemporaryDataChange({
      ID: data ? data.ID : null,
      Name: data ? data.Name : ''
    });
  };

  redirectToStaff = () => {
    this.router.push(routerConfig.staff);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          Email,
          Phone,
          Address,
          HubID,
          VehicleType,
          NumberPlate,
          Weight,
          CityID,
        } = values;
        let Vehicle = {
          Type: +VehicleType,
          NumberPlate: NumberPlate,
          Weight: formatNumber(`${Weight}`)
        };
        let credentials = {
          Email,
          Phone,
          Address,
          HubID: HubID ? +HubID : undefined,
          CityID: CityID ? +CityID : undefined,
          Vehicle
        };
        console.log("%cCrendentials", 'color: #00b33c', credentials);
        // add data register form to state
        this.staffByUser.onTemporaryDataChange(credentials);
        this.staffByUser.onNextStep();
      }
    });
  };

  render() {
    const {rowStyle, colStyle, gutter} = basicStyle;
    const {getFieldDecorator} = this.props.form;
    const {singleData: dataSource, temporaryData, isUpdateMode: fillEditData} = this.staffByUser;
    const Vehicle = ObjectPath.get(dataSource, 'Vehicle');

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row style={rowStyle} gutter={gutter} justify="start">
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <h2 className={'headerTitle'}>Thông tin liên hệ</h2>
          </Col>
        </Row>

        <Row style={rowStyle} gutter={gutter} justify="start">
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <FormItem
              {...bigFormItemLayout}
              label="Tên người dùng"
            >
              {getFieldDecorator('Name', {})(
                <UserList
                  onValueChange={this.onChangeNameUser}
                  form={this.props.form}
                  name={ObjectPath.get(temporaryData, 'Name')}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row style={rowStyle} gutter={gutter} justify="start">
          <Col md={12} sm={12} xs={24} style={colStyle}>
            <FormItem
              {...formItemLayout}
              label="Địa chỉ"
            >
              {getFieldDecorator('Address', {
                rules: [
                  {required: true, message: 'Vui lòng nhập địa chỉ'}
                ],
                initialValue: fillEditData ? dataSource.Address : ObjectPath.get(temporaryData, 'Address', null)
              })(
                <Input
                  size="default"
                />
              )}
            </FormItem>
          </Col>

          {fillEditData === false ?
            <Col md={12} sm={12} xs={24}>
              <FormItem
                {...formItemLayout}
                label="Thành phố"
              >
                {
                  getFieldDecorator('CityID', {
                    rules: [
                      {required: true, message: "Vui lòng chọn tỉnh thành"}
                    ],
                    initialValue: fillEditData ? null : ObjectPath.get(temporaryData, 'CityID', null)
                  })(
                    <City
                      form={this.props.form}
                    />
                  )
                }
              </FormItem>
            </Col> : null}
        </Row>

        <Row style={rowStyle} gutter={gutter} justify="start">
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <h2 className={'headerTitle'}>Thông tin vận chuyển</h2>
          </Col>
        </Row>

        <Row style={rowStyle} gutter={gutter} justify="start">

          <Col md={12} sm={12} xs={24}>
            <FormItem
              {...formItemLayout}
              label="Phương tiện"
            >
              {getFieldDecorator('VehicleType', {
                rules: [
                  {required: true, message: 'Vui lòng chọn phương tiện'}
                ],
                initialValue: fillEditData ? ObjectPath.get(Vehicle, 'Type.Value', null) : ObjectPath.get(temporaryData, 'Vehicle.Type', null)
              })(
                <VehicleType valueByCode={false}/>
              )}
            </FormItem>
          </Col>

          <Col md={12} sm={12} xs={24}>
            <FormItem
              {...formItemLayout}
              label="Biển số xe"
            >
              {getFieldDecorator('NumberPlate', {
                rules: [
                  {required: true, message: 'Vui lòng nhập biển số xe'}
                ],
                initialValue: fillEditData ? ObjectPath.get(Vehicle, 'NumberPlate') : ObjectPath.get(temporaryData, 'Vehicle.NumberPlate', null)
              })(
                <Input
                  size="default"
                />
              )}
            </FormItem>
          </Col>

          <Col md={12} sm={12} xs={24}>
            <FormItem
              {...formItemLayout}
              label="Trọng tải"
            >
              {getFieldDecorator('Weight', {
                rules: [
                  {required: true, message: 'Vui lòng nhập trọng lượng'}
                ],
                initialValue: fillEditData ? (Vehicle && Vehicle.Weight && `${Vehicle.Weight} kg`) : (ObjectPath.get(temporaryData, 'Vehicle.Weight', null) ? `${temporaryData.Vehicle.Weight} kg` : null)
              })(
                <NumberFormat
                  placeholder="kg" thousandSeparator={true}
                  suffix={' kg'} className="ant-input "
                />
              )}
            </FormItem>
          </Col>

          <Col md={12} sm={12} xs={24}>
            <FormItem
              {...formItemLayout}
              label="Thuộc điểm gửi hàng"
            >
              {
                fillEditData === false ?
                  getFieldDecorator('HubID', {
                    rules: [
                      {required: true, message: "Vui lòng chọn điểm gửi hàng"}
                    ],
                    initialValue: fillEditData ? null : ObjectPath.get(temporaryData, 'HubID', null)
                  })(
                    <HubList show={true}/>
                  )
                  : dataSource.Hubs && dataSource.Hubs.map((item, index) =>
                  <Tag color={"purple"} key={index}>
                    {`${item.Code}`}
                  </Tag>
                )
              }
            </FormItem>
          </Col>

        </Row>

        <Row style={rowStyle} gutter={gutter} type="flex" justify="end">
          <Col md={8} sm={8} xs={24} className="textRight">
            <FormItem>
              <Button
                type="primary"
                className="btnNext"
                htmlType="submit"
              >
                Bước kế tiếp
              </Button>
              <Button type="danger" onClick={this.redirectToStaff}>Hủy</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}