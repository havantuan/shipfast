import React, {Component} from 'react';
import {Button, Col, DatePicker, Form, Row, Modal} from 'antd';
import moment from 'moment';
import basicStyle from "../../../../config/basicStyle";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import UserList from "../../Common/User/UserList";

const confirm = Modal.confirm;
const dateFormat = 'DD-MM-YYYY';
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
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
@Form.create()
@inject(Keys.me, Keys.cross, Keys.customerDebt)
@observer
export default class OrderListControl extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let {
        CrossTo,
        CustomerID
      } = values;
      let credentials = {
        CustomerID: +CustomerID,
        CrossTo: CrossTo ? CrossTo.format() : undefined,
      };
      this.props.handleSubmit(credentials);
    });
  };

  exportExcel = () => {
    let values = this.props.form.getFieldsValue();
    let {CrossTo, CustomerID} = values;
    let credentials = {
      CustomerID: +CustomerID,
      CrossTo: CrossTo.format(),
      ActionType: 'NotCross',
      HubID: this.props.me.getCurrentHub(),
    };
    this.props.cross.exportExcelCross(credentials);
  };

  createCross = () => {
    let that = this.props;
    let values = this.props.form.getFieldsValue();
    let {
      CustomerID,
      CrossTo
    } = values;

    let credentials = {
      UserID: +CustomerID,
      Date: CrossTo,
    };
    console.log('%c credentials', 'color: #00b33c', credentials);
    confirm({
      title: `Bạn có muốn thêm đối soát không ?`,
      content: 'Bạn ấn OK bạn thêm đối soát',
      onOk() {
        that.cross.createCross(credentials);
      },
      onCancel() {
      },
    });
  };

  handleChange = (value) => {
    let CustomerID = this.props.form.getFieldValue('UserID');
    if (CustomerID) {
      this.props.customerDebt.fetch(CustomerID, value.format());
    }
  };

  render() {
    let timeNow = moment().endOf('day');
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
                  {getFieldDecorator('CustomerID')(
                    <UserList
                      placeholder="SĐT, tên, email, mã"
                    />
                  )}
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Thời gian tạo'}
                >
                  {getFieldDecorator('CrossTo', {
                    initialValue: moment(timeNow).subtract(1, 'days')
                  })(
                    <DatePicker
                      placeholder="Chọn thời gian"
                      format={dateFormat}
                      onChange={this.handleChange}
                      style={{width: '100%'}}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col md={6} xs={24}>
            <Row>
              <Col span={24}>
                <FormItem>
                  <Button
                    loading={this.props.cross.isCreating}
                    icon={'plus'}
                    type="primary"
                    onClick={this.createCross}
                  >Tạo đối soát</Button>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={basicStyle.gutter}>
          <Col md={18} sm={24}>
            <Row gutter={basicStyle.gutter}>
              <Col span={12}>
                <FormItem
                  {...tailFormItemLayout}
                >
                  <Button
                    icon={'file-excel'}
                    style={basicStyle.greenButton}
                    onClick={this.exportExcel}
                  >Xuất excel</Button>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...tailFormItemLayout}
                >
                  <Button
                    icon={'search'}
                    style={basicStyle.blueButton}
                    htmlType="submit"
                  >Xem trước</Button>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>

      </Form>
    )
  }

}

