import React, {Component} from 'react';

import {Button, Col, Form, Input, Row, Spin} from 'antd';
import basicStyle from '../../../../config/basicStyle';
import './Style.css';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';

const FormItem = Form.Item;
const {TextArea} = Input;
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
@inject(Keys.staffProfile, Keys.me)
@observer
export default class AccountInfomation extends Component {

  onKeyDown = (e) => {
    // 9 - Tab
    // 13 - Enter
    let scannerKey = this.me.current.ScannerKey;
    if (e.which === scannerKey && scannerKey !== 13) {
      this.submitForm();
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.submitForm();
  };
  submitForm = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let {
          Name,
          Address,
        } = values;
        let credentials = {
          Name,
          Address,
        };
        this.staffProfile.update(credentials);
      }
    });
  };

  constructor(props) {
    super(props);
    this.staffProfile = this.props.staffProfile
    this.me = this.props.me
  }

  componentDidMount() {
    this.staffProfile.fetch()
  }

  render() {
    const {rowStyle, gutter} = basicStyle;
    const {dataSource, fetching, isUpdating} = this.staffProfile;
    const {getFieldDecorator} = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit} onKeyDown={this.onKeyDown} style={{marginBottom: '20px'}}>
        <h3 className='title'>Thông tin chủ tài khoản</h3>
        <Spin spinning={fetching || isUpdating}>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={12} sm={12} xs={24}>
              <FormItem
                {...formItemLayout}
                label="Họ tên"
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
                label="Email"
              >
                {getFieldDecorator('Email', {
                  initialValue: (dataSource && dataSource.Email) ? dataSource.Email : null
                })(
                  <Input size='default' disabled={true}/>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="Điện thoại"
              >
                {getFieldDecorator('Phone', {
                  initialValue: (dataSource && dataSource.Phone) ? dataSource.Phone : null
                })(
                  <Input size='default' disabled={true}/>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="Địa chỉ"
              >
                {getFieldDecorator('Address', {
                  rules: [
                    {required: true, message: 'Vui lòng nhập địa chỉ'}
                  ],
                  initialValue: (dataSource && dataSource.Address) ? dataSource.Address : null
                })(
                  <TextArea/>
                )}
              </FormItem>
            </Col>

            <Col md={12} sm={12} xs={24}>
              <FormItem
                {...formItemLayout}
                label="Chứng minh thư"
              >
                {getFieldDecorator('IDNumberOfCard', {
                  initialValue: (dataSource && dataSource.IDCard && dataSource.IDCard.IDNumber) ? dataSource.IDCard.IDNumber : null
                })(
                  <Input size='default' disabled={true}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col offset={4} span={20} style={{paddingLeft: '0'}}>
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
    )
  }

}