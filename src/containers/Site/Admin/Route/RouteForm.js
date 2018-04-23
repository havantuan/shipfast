import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Col, Form, Input, Row, Spin} from 'antd';
import basicStyle from '../../../../config/basicStyle';
import City from '../../Common/Location/City';
import District from '../../Common/Location/Checkbox/District';
import WardCheck from '../../Common/Location/Checkbox/WardCheck';
import HubsList from '../../Common/HubProvider/hubList';
import ContentHolder from "../../../../components/utility/ContentHolder";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import routerSystemConfig from '../../../../config/routerSystem';

const FormItem = Form.Item;

@Form.create()
@withRouter
@inject(Keys.updateRoute, Keys.router)
@observer
export default class RouteForm extends Component {

  constructor(props) {
    super(props);
    this.id = props.match.params.id;
    this.updateRoute = props.updateRoute;
    this.router = props.router;
  }

  componentDidMount() {
    this.updateRoute.onCityIDChange(this.props.CityID);
    if (this.updateRoute.isUpdateMode) {
      this.updateRoute.fetch(this.id);
    }
  }

  componentWillUnmount() {
    this.updateRoute.clear();
  }

  onCityIDChange = (CityID) => {
    this.updateRoute.onCityIDChange(CityID);
  };

  onDistrictIDChange = (DistrictID) => {
    this.updateRoute.districtIDs = DistrictID;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          Name, CityID, Code, HubID, DistrictID, WardID
        } = values;
        let DistrictIDs = (DistrictID).map((index, key) => {
          return index.ID ? index.ID : +index
        });
        let WardIDs = (WardID).map((index, key) => {
          return index.ID ? index.ID : +index
        });
        let credentials = {
          Name,
          CityID: CityID ? +CityID : null,
          Code,
          HubID: HubID ? +HubID : null,
          DistrictIDs,
          WardIDs
        };
        console.log("%ccredentials", 'color: #00b33c', credentials);

        if (this.updateRoute.isUpdateMode) {
          this.updateRoute.update(this.id, credentials).then(data => {
            this.router.push(routerSystemConfig.Route);
          });
        } else {
          this.updateRoute.create(credentials).then(data => {
            this.router.push(routerSystemConfig.Route);
          });
        }
      }
    });
  };

  render() {
    const {rowStyle, gutter} = basicStyle;
    const {getFieldDecorator} = this.props.form;
    let {dataSource, fetching, isUpdateMode: fillEditData} = this.updateRoute;
    const formLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 18},
      },
    };

    return (
      <PageHeaderLayout
        title={`${fillEditData ? 'Chỉnh sửa' : 'Tạo'} phân tuyến`}
      >
        <ContentHolder>
          <Spin spinning={fetching}>
            <Form onSubmit={this.handleSubmit}>
              <Row style={rowStyle} gutter={gutter} justify="start">
                <Col md={12} sm={12} xs={24}>
                  <FormItem
                    {...formLabel}
                    label="Tên tuyến"
                  >   {getFieldDecorator('Name', {
                    rules: [{
                      required: true,
                      message: 'Tên tuyến không được bỏ trống',
                    }],
                    initialValue: fillEditData ? dataSource.Name : null
                  })(
                    <Input size="default" placeholder="Tên tuyến"/>
                  )}
                  </FormItem>
                  <FormItem
                    {...formLabel}
                    label="Khu vực áp dụng"
                  >   {getFieldDecorator('CityID', {
                    rules: [{
                      required: true,
                      message: 'Khu vực áp dụng không được bỏ trống',
                    }],
                    initialValue: fillEditData ? dataSource.City && `${dataSource.City.ID}` : null
                  })(
                    <City
                      size="default"
                      placeholder="Khu vực áp dụng"
                      onValueChange={this.onCityIDChange}
                      form={this.props.form}
                      resetFields={['DistrictID', 'WardID']}
                    />
                  )}
                  </FormItem>

                </Col>
                <Col md={12} sm={12} xs={24}>
                  <FormItem
                    {...formLabel}
                    label="Mã tuyến"
                  >{getFieldDecorator('Code', {
                    rules: [{
                      required: true,
                      message: 'Mã tuyến không được bỏ trống',
                    }],
                    initialValue: fillEditData ? dataSource.Code : null
                  })(
                    <Input
                      size="default"
                      disabled={fillEditData}
                      placeholder="Mã tuyến (viết liền không có ký tự đặc biệt)"
                    />
                  )}
                  </FormItem>
                  <FormItem
                    {...formLabel}
                    label="Điểm gửi hàng"
                  >   {getFieldDecorator('HubID', {
                    rules: [{
                      required: true,
                      message: ' Điểm gửi hàng không được bỏ trống',
                    }],
                    initialValue: fillEditData ? dataSource.Hub && `${dataSource.Hub.ID}` : null
                  })(
                    <HubsList placeholder="Chọn điểm gửi hàng" show={true}/>
                  )}
                  </FormItem>
                </Col>
              </Row>
              <Row style={rowStyle} gutter={gutter} justify="start">
                <Col>
                  <h3>Quận huyện</h3>
                  <FormItem
                  >{getFieldDecorator('DistrictID', {
                    rules: [{
                      required: true,
                      message: ' Quận huyện không được bỏ trống',
                    }],
                    initialValue: fillEditData ? this.updateRoute.districtIDs.slice() : null
                  })(
                    <District
                      CityID={this.updateRoute.cityID}
                      onValueChange={this.onDistrictIDChange}
                      resetFields={['WardID']}
                      form={this.props.form}
                    />
                  )}
                  </FormItem>
                </Col>
              </Row>
              <Row style={rowStyle} gutter={gutter} justify="start">
                <Col>
                  <h3>Xã phường</h3>
                  <FormItem
                  >{getFieldDecorator('WardID', {
                    rules: [{
                      required: true,
                      message: ' Xã phường không được bỏ trống',
                    }],
                    initialValue: fillEditData ? (dataSource.Wards ? dataSource.Wards.map(val => `${val.ID}`) : []) : null
                  })(
                    <WardCheck
                      DistrictID={this.updateRoute.districtIDs.slice()}
                      form={this.props.form}
                      setFieldsValues={['WardID']}
                    />
                  )}
                  </FormItem>
                </Col>
              </Row>

              <Row style={rowStyle} gutter={gutter} justify="start">
                <Col md={12} sm={12} xs={24}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={this.updateRoute.isCreating || this.updateRoute.isUpdating}
                  >
                    {fillEditData ? 'Cập nhật' : 'Tạo'}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Spin>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}