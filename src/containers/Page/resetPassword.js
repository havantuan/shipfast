import React from 'react';
import {Link} from 'react-router-dom';
import {Button, Form, Input} from 'antd';
import IntlMessages from '../../components/utility/intlMessages';
import {inject, observer} from "mobx-react";

import {Keys} from '../../stores';

const FormItem = Form.Item;

@Form.create()
@inject(Keys.auth)
@observer
export default class ResetPassword extends React.Component {
  state = {
    confirmDirty: false,
  };
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({confirmDirty: this.state.confirmDirty || !!value});
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Mật khẩu nhập lại không trùng khớp!');
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], {force: true});
    }
    callback();
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <div className="isoResetPassPage">
          <div className="isoFormContent">
            <div className="isoLogoWrapper">
              <Link to="/dashboard">
                <IntlMessages id="page.resetPassTitle"/>
              </Link>
            </div>

            <div className="isoFormHeadText">
              <h3>
                <IntlMessages id="page.resetPassSubTitle"/>
              </h3>
              <p>
                <IntlMessages id="page.resetPassDescription"/>
              </p>
            </div>

            <div className="isoResetPassForm">
              <div className="isoInputWrapper">
                <FormItem
                >
                  {getFieldDecorator('password', {
                    rules: [{
                      required: true, message: 'Xin nhập mật khẩu mới!',
                    }, {
                      validator: this.checkConfirm,
                    }],
                  })(
                    <Input size="large" type="password" placeholder="Mật khẩu mới"/>
                  )}
                </FormItem>

              </div>

              <div className="isoInputWrapper">
                <FormItem
                >
                  {getFieldDecorator('confirm', {
                    rules: [{
                      required: true, message: 'Nhập lại mật khẩu!',
                    }, {
                      validator: this.checkPassword,
                    }],
                  })(
                    <Input
                      size="large"
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                    />
                  )}
                </FormItem>

              </div>

              <div className="isoInputWrapper">
                <Button type="primary" htmlType="submit">
                  <IntlMessages id="page.resetPassSave"/>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    );
  }
}

// const mapStateToProps = state => {
//   return {}
// };
//
// const mapDispatchToProps = dispatch => {
//   return {
//     // createUser: (credentials) => dispatch(createUser.request(credentials)),
//
//   };
// };
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Form.create()(ResetPassword));