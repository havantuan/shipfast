import React, {Component} from 'react';
import {Button, Col, Form, Input, Row, Select} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import EnumState from "../../Common/EnumProvider/state";
import SelectDate from "../../Common/SelectDate/SelectDate";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import Permission from "../../../../permissions/index";
import Expand from "../../../../components/Expand/index";
import EnumUserType from "../../Common/EnumProvider/userType";
import City from "../../Common/Location/City";
import District from "../../Common/Location/District";
import Ward from "../../Common/Location/Ward";
import EnumKHType from "../../Common/EnumProvider/khType";

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
@inject(Keys.customerTable)
@observer
export default class SellerListControl extends Component {

  constructor(props) {
    super(props);
    this.state = {
      CityID: props.CityID,
      DistrictID: props.DistrictID
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {Query, State, UserType, KHType, TookCare, CityID, DistrictID, WardID, CreatedDate} = values;
        let credentials = {
          Query,
          State,
          UserType,
          KHType,
          TookCare: TookCare === 0 ? false : (TookCare === 1 ? true : null),
          CityID: CityID ? +CityID : null,
          DistrictID: DistrictID ? +DistrictID : null,
          WardID: WardID ? +WardID : null,
          CreatedFrom: CreatedDate ? CreatedDate[0] : undefined,
          CreatedTo: CreatedDate ? CreatedDate[1] : undefined
        };
        this.props.customerTable.onFilter(credentials);
      }
    });
  };

  onCityIDChange = (CityID) => {
    this.setState({
      CityID: CityID,
      DistrictID: null
    })
  };

  onDistrictIDChange = (DistrictID) => {
    this.setState({
      DistrictID: DistrictID
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
                  label={'Khách hàng'}
                >
                  {getFieldDecorator('Query')(
                    <Input placeholder="Nhập mã, tên, SĐT, email khách hàng"/>
                  )}
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Trạng thái'}
                >
                  {getFieldDecorator('State')(
                    <EnumState
                      placeholder={'Trạng thái'}
                      valueByCode={true}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={basicStyle.gutter}>
              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Thời gian tạo'}
                >
                  {getFieldDecorator('CreatedDate')(
                    <SelectDate/>
                  )}
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Kiểu khách hàng'}
                >
                  {getFieldDecorator('KHType')(
                    <EnumKHType
                      placeholder={'Kiểu khách hàng'}
                      valueByCode={true}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            {
              this.props.customerTable.expandSearch &&
              <Row>
                <Col span={24}>
                  <Row gutter={basicStyle.gutter}>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Kiểu người dùng'}
                      >
                        {getFieldDecorator('UserType')(
                          <EnumUserType
                            placeholder={'Kiểu người dùng'}
                            valueByCode={true}
                          />
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
                            form={this.props.form}
                            resetFields={['DistrictID', 'WardID']}
                            onChange={this.onCityIDChange}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>

                  <Row gutter={basicStyle.gutter}>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Chăm sóc'}
                      >
                        {getFieldDecorator('TookCare')(
                          <Select
                            allowClear
                            style={{width: '100%'}}
                            placeholder={'Đã/Chưa chăm sóc'}
                          >
                            <Select.Option value={1}>Có</Select.Option>
                            <Select.Option value={0}>Không</Select.Option>
                          </Select>
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
                            CityID={this.state.CityID}
                            form={this.props.form}
                            resetFields={['WardID']}
                            onChange={this.onDistrictIDChange}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>

                  <Row gutter={basicStyle.gutter}>
                    <Col sm={{span: 12, offset: 12}} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Phường/Xã'}
                      >
                        {getFieldDecorator('WardID')(
                          <Ward
                            DistrictID={this.state.DistrictID}
                            form={this.props.form}
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
                expandable={this.props.customerTable.expandSearch}
                onClick={this.props.customerTable.onToggleExpandSearch}
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

              {
                Permission.allowCreateCustomer() &&
                <Col span={12}>
                  <FormItem>
                    <Button
                      icon={'plus'}
                      style={{...basicStyle.blueButton, width: '100%'}}
                      onClick={this.props.customerTable.showCreateModal}
                    >
                      Thêm mới
                    </Button>
                  </FormItem>
                </Col>
              }
            </Row>
          </Col>
        </Row>
      </Form>
    )
  }

}
