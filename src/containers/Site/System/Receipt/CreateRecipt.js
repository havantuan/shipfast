import React, {Component} from 'react';
import {Button, Col, DatePicker, Form, Icon, Input, Row, Select} from 'antd';
import LayoutWrapper from '../../../../components/utility/layoutWrapper';
import PageHeader from '../../../../components/utility/pageHeader';
import ContentHolder from '../../../../components/utility/ContentHolder';
import Box from '../../../../components/utility/box';
import basicStyle from '../../../../config/basicStyle';

const FormItem = Form.Item;
const {Option} = Select;
const width = {
  width: '100%'
};

@Form.create()
export default class CreateRecipt extends Component {
  addTransaction = () => {
    this.setState(prevState => {
      return {countTransaction: prevState.countTransaction + 1}
    })
  };

  constructor(props) {
    super(props);
    // const value = this.props.value || {};
    this.state = {
      transactionCode: [],
      countTransaction: 0,
    };

  }

  render() {
    const {rowStyle, colStyle, gutter} = basicStyle;
    const styleMargin = {marginTop: 20};
    const {getFieldDecorator} = this.props.form;
    const rowsTransaction = [];
    for (let i = 1; i <= this.state.countTransaction; i++) {
      rowsTransaction.push(
        <FormItem key={i}>
          <Input placeholder="Mã giao dịch ngân hàng"/>
        </FormItem>
      );
    }
    return (
      <LayoutWrapper>
        <PageHeader>Lập phiếu thu</PageHeader>
        <Row style={rowStyle} gutter={gutter} justify="start">
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Form>
              <Box>
                <ContentHolder>
                  <Row style={rowStyle} gutter={gutter} justify="start">
                    <Col md={14} sm={14} xs={24} className="textLeft">
                      <Row>
                        <Col md={5} sm={5} xs={24}>
                          <h3>Mã đơn hàng</h3>
                        </Col>
                        <Col md={5} sm={5} xs={24}>
                          <h3>Trạng thái đơn</h3>
                        </Col>
                        <Col md={4} sm={4} xs={24}>
                          <h3>Tổng cước</h3>
                        </Col>
                        <Col md={4} sm={4} xs={24}>
                          <h3>Tổng tiền thu hộ</h3>
                        </Col>
                        <Col md={6} sm={6} xs={24}>
                          <h3>Thời gian thành công</h3>
                        </Col>
                      </Row>
                      <Row style={styleMargin}>
                        <Col md={7} sm={7} xs={24}>
                          <h3>Đơn hàng cần thu <Button type="primary" size={"small"}>Xuất
                            excel</Button></h3>
                        </Col>
                        <Col md={4} sm={4} xs={24}>
                          {/*<h3></h3>*/}
                        </Col>
                        <Col md={4} sm={4} xs={24}>
                          <p>0 đ</p>
                        </Col>
                        <Col md={4} sm={4} xs={24}>
                          <p>0 đ</p>
                        </Col>
                      </Row>
                      <Row style={styleMargin}>
                        <Col md={7} sm={7} xs={24}>
                          <h3>Đơn chưa bàn giao</h3>
                        </Col>
                        <Col md={4} sm={4} xs={24}>
                          {/*<h3></h3>*/}
                        </Col>
                        <Col md={4} sm={4} xs={24}>
                          <p>0 đ</p>
                        </Col>
                        <Col md={4} sm={4} xs={24}>
                          <p>0 đ</p>
                        </Col>
                      </Row>
                      <Row style={styleMargin}>
                        <Col md={7} sm={7} xs={24}>
                          <h3>Đơn hàng đã thanh toán qua MPOS</h3>
                        </Col>
                        <Col md={4} sm={4} xs={24}>
                          {/*<h3></h3>*/}
                        </Col>
                        <Col md={4} sm={4} xs={24}>
                          <p>0 đ</p>
                        </Col>
                        <Col md={4} sm={4} xs={24}>
                          <p>0 đ</p>
                        </Col>
                      </Row>
                    </Col>

                    <Col md={10} sm={10} xs={24} className="textLeft">
                      <h3>Nhân viên</h3>
                      <FormItem style={styleMargin}>
                        {getFieldDecorator('UserManagerID', {
                          rules: [
                            {required: true, message: 'Vui lòng chọn nhân viên quản lý'}
                          ]
                        })(
                          <Select
                            style={{width: '100%'}}
                            placeholder="Chọn dịch vụ"
                            size="large"
                            allowClear
                          >
                            <Option value={"1"}>Nguyễn Đông Đức</Option>
                            <Option value={"2"}>Tuân Đz</Option>
                          </Select>
                        )}
                      </FormItem>
                      <h3>Chốt đơn từ</h3>
                      <FormItem style={styleMargin}>
                        <DatePicker
                          placeholder="Ngày cấp"
                          style={width}
                        />
                      </FormItem>
                      <h3>Chốt đơn từ</h3>
                      <FormItem style={styleMargin}>
                        <DatePicker
                          placeholder="Chốt đơn từ"
                          style={width}
                        />
                      </FormItem>
                      <h3>Tổng tiền</h3>
                      <FormItem style={styleMargin}>
                        <Input
                          placeholder="Ngày cấp"
                          style={width}
                        />
                      </FormItem>
                      <h3>Số tiền nhận từ bưu tá</h3>
                      <FormItem style={styleMargin}>
                        <Input
                          placeholder="0"
                          style={width}
                        />
                      </FormItem>
                      <h3>Hình thức thu tiền</h3>
                      <FormItem style={styleMargin}>
                        {getFieldDecorator('transaction', {
                          rules: [
                            {required: true, message: 'Vui lòng chọn hình thức thu tiền'}
                          ]
                        })(
                          <Select
                            style={{width: '100%'}}
                            placeholder="Chọn dịch vụ"
                            size="large"
                            allowClear
                          >
                            <Option value={"1"}>Chuyển khoản</Option>
                            <Option value={"2"}>Tiền mặt</Option>
                          </Select>
                        )}
                      </FormItem>
                      <h3>Mã giao dịch NH</h3>
                      <FormItem style={styleMargin}>
                        <Input
                          placeholder="Mã giao dịch ngân hàng"
                          addonAfter={<Icon
                            onClick={this.addTransaction}
                            type="plus"/>}
                        />
                      </FormItem>
                      {rowsTransaction}
                      <Button type="primary">Tạo phiếu</Button>
                    </Col>
                  </Row>
                </ContentHolder>
              </Box>
            </Form>
          </Col>
        </Row>
      </LayoutWrapper>
    );
  }
}