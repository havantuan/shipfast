import React, {Component} from 'react';

import {Button, Col, Form, Input, Row} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import basicStyle from '../../../../config/basicStyle';
import './Style.css';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 6},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 18},
  },
};

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

@Form.create()
@inject(Keys.me)
@observer
export default class ChangePassword extends Component {
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('NewPassword')) {
      callback('Mật khẩu mới không trùng khớp!');
    } else {
      callback();
    }
  };
  checkConfirm = (rule, value, callback) => {
    if (value && value.length < 8) {
      callback('Mật khẩu tối thiểu 8 ký tự!');
    }

    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['Confirm'], {force: true});
    }
    callback();
  };
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({confirmDirty: this.state.confirmDirty || !!value});
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          NewPassword,
          OldPassword
        } = values;
        let credentials = {
          NewPassword,
          OldPassword
        };
        console.log("%ccredentials", 'color: #00b33c', credentials);
        this.me.resetPassword(credentials);
        this.props.form.resetFields();
        this.setState({
          confirmDirty: false
        });
      }
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      CityID: null,
      confirmDirty: false,
    }
    this.me = props.me
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  render() {
    const {rowStyle, gutter} = basicStyle;
    const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;

    // Only show error after a field is touched.
    const currentPasswordError = isFieldTouched('OldPassword') && getFieldError('OldPassword');
    const password = isFieldTouched('NewPassword') && getFieldError('NewPassword');
    const confirmError = isFieldTouched('Confirm') && getFieldError('Confirm');
    return (
      <Form onSubmit={this.handleSubmit}>
        <ContentHolder>

          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={24} sm={24} xs={24}>
              <FormItem
                {...formItemLayout}
                label="Mật khẩu hiện tại"
                hasFeedback
                validateStatus={currentPasswordError ? 'error' : ''}
                help={currentPasswordError || ''}
              >
                {getFieldDecorator('OldPassword', {
                  rules: [
                    {required: true, message: 'Vui lòng nhập mật khẩu hiện tại'}
                  ]
                })(
                  <Input
                    type='password'
                    size='default'
                    placeholder='Nhập mật khẩu đang sử dụng'
                  />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label={'Mật khẩu mới (tối thiểu 8 ký tự)'}
                hasFeedback
                validateStatus={password ? 'error' : ''}
                help={password || ''}
              >
                {getFieldDecorator('NewPassword', {
                  rules: [
                    {required: true, message: 'Vui lòng nhập mật khẩu mới'},
                    {validator: this.checkConfirm}
                  ]
                })(
                  <Input
                    type='password'
                    size='default'
                    placeholder='Nhập mật khẩu mới'
                  />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="Nhập lại mật khẩu mới"
                hasFeedback
                validateStatus={confirmError ? 'error' : ''}
                help={confirmError || ''}
              >
                {getFieldDecorator('Confirm', {
                  rules: [
                    {required: true, message: 'Vui lòng nhập lại mật khẩu mới'},
                    {validator: this.checkPassword}
                  ]
                })(
                  <Input
                    type='password'
                    size='default'
                    placeholder='Nhập lại mật khẩu mới'
                    onBlur={this.handleConfirmBlur}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col offset={4} span={20} style={{paddingLeft: '0'}}>
              <Button
                htmlType={'submit'}
                type={'primary'}
                disabled={hasErrors(getFieldsError())}
              >
                Cập nhật
              </Button>
            </Col>
          </Row>

        </ContentHolder>

      </Form>
    )
  }

}
