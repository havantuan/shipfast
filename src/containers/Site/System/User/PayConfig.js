import React, {Component} from 'react';

import {Button, Checkbox, Col, Form, Input, Row, Select, Spin} from 'antd';
import LayoutWrapper from '../../../../components/utility/layoutWrapper';
import PageHeader from '../../../../components/utility/pageHeader';
import Box from '../../../../components/utility/box';
import basicStyle from '../../../../config/basicStyle';
import './Style.css';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';

const FormItem = Form.Item;
const {Option} = Select;
const formItemLayout = {
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
@inject(Keys.me)
@observer
export default class PayConfig extends Component {

  render() {
    const {rowStyle, colStyle, gutter} = basicStyle;
    const {dataSource, fetching} = this.props;
    const {getFieldDecorator} = this.props.form;
    return (
      <LayoutWrapper>
        <PageHeader>Cấu hình thông tin thanh toán</PageHeader>
        <Row style={rowStyle} gutter={gutter} justify="start">
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box>
              <Form onSubmit={this.handleSubmit} style={{marginBottom: '20px'}}>
                <h3 className='title'>Tài khoản ngân hàng</h3>
                <Spin spinning={fetching || false}>
                  <Row style={rowStyle} gutter={gutter} justify="start">
                    <Col md={18} sm={18} xs={18}>
                      <FormItem
                        {...formItemLayout}
                        label="Ngân hàng"
                      >
                        <Select>
                          <Option value="Vietcom">VietComBank</Option>
                          <Option value="lucy">Agribank</Option>
                          <Option value="tom">TechComBank</Option>
                        </Select>

                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label="Chi nhánh"
                      >
                        {getFieldDecorator('Name', {
                          rules: [
                            {required: true, message: 'Vui lòng nhập tên tài khoản'}
                          ],
                          initialValue: (dataSource && dataSource.Name) ? dataSource.Name : null
                        })(
                          <Select>
                            <Option value="Vietcom">Sở Giao Dịch</Option>
                            <Option value="11">Thăng Long</Option>
                            <Option value="tom">TechComBank</Option>
                          </Select>
                        )}
                      </FormItem>

                      <FormItem
                        {...formItemLayout}
                        label="Chủ tài khoản"
                      >
                        {getFieldDecorator('Email', {
                          initialValue: (dataSource && dataSource.Email) ? dataSource.Email : null
                        })(
                          <Input size='default'/>
                        )}
                      </FormItem>

                      <FormItem
                        {...formItemLayout}
                        label="Số tài khoản"
                      >
                        {getFieldDecorator('Phone', {
                          initialValue: (dataSource && dataSource.Phone) ? dataSource.Phone : null
                        })(
                          <Input size='default'/>
                        )}
                      </FormItem>
                      <div style={{marginBottom: "10px"}}>
                        <h3 className='title'>Số thẻ ngân hàng</h3>
                        <p className="info">Phí chuyển tiền là: <b>5.500đ/giao dịch</b>, tiền sẽ
                          được chuyển trực tiếp vào tài khoản ngân hàng của bạn. <span
                            className="text-info">(Áp dụng với khách hàng có thẻ ATM, Visa Debit hoặc Visa Credit)</span>
                        </p>
                      </div>
                      <FormItem
                        {...formItemLayout}
                        label="Ngân hàng"
                      >
                        {getFieldDecorator('Name', {
                          rules: [
                            {required: true, message: 'Vui lòng nhập tên tài khoản'}
                          ],
                          initialValue: (dataSource && dataSource.Name) ? dataSource.Name : null
                        })(
                          <Select>
                            <Option value="Vietcom">VietCombank</Option>
                            <Option value="11">Agribank</Option>
                            <Option value="tom">TechComBank</Option>
                          </Select>
                        )}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label="Họ và tên chủ thẻ"
                      >
                        {getFieldDecorator('Name', {
                          rules: [
                            {required: true, message: 'Vui lòng nhập tên tài khoản'}
                          ],
                          initialValue: (dataSource && dataSource.Name) ? dataSource.Name : null
                        })(
                          <Input size='default'/>
                        )}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label="Số thẻ"
                      >
                        {getFieldDecorator('Name', {
                          rules: [
                            {required: true, message: 'Vui lòng nhập số thẻ'}
                          ],
                          initialValue: (dataSource && dataSource.Name) ? dataSource.Name : null
                        })(
                          <Input size='default'/>
                        )}
                        <p className="text-info">(Chỉ áp dụng với khách hàng có thẻ ATM, Visa
                          Debit hoặc Visa Credit)</p>
                      </FormItem>
                      <Col offset={4} span={20} style={{paddingLeft: '0'}}>
                        <FormItem
                        >
                          {getFieldDecorator('Agree', {
                            rules: [
                              {
                                required: true,
                                message: 'Bạn phải chấp nhận điều khoản của nhà cung cấp'
                              },
                            ]
                          })(
                            <Checkbox>
                              {/*<IntlMessages id="page.signUpTermsConditions"/>*/}
                              Tôi đồng ý và chấp nhận những <span className="text-info"> điều khoản thanh toán</span>
                              của ShipFast
                            </Checkbox>
                          )}
                        </FormItem>
                      </Col>

                    </Col>
                  </Row>

                  <Row style={rowStyle} gutter={gutter} justify="start">
                    <Col offset={3} span={20} style={{paddingLeft: '0'}}>
                      <Button
                        htmlType={'submit'}
                        type={'primary'}
                      >
                        Cập nhật
                      </Button>
                    </Col>
                  </Row>
                </Spin>

              </Form>
            </Box>
          </Col>
        </Row>
      </LayoutWrapper>
    )
  }
}
//
// const mapStateToProps = state => {
//   // return myInfo.mapState(state);
// };
//
// const mapDispatchToProps = dispatch => {
//   return {
//     // getDataSource: () => dispatch(myInfo.request()),
//   }
// };
//
// PayConfig.propTypes = propTypes;
// PayConfig.defaultProps = defaultProps;
//
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Form.create()(withRouter(PayConfig)));
