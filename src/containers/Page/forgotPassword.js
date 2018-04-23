import React from 'react';
import {Link} from 'react-router-dom';
// import {connect} from 'react-redux';
// import IntlMessages from '../../components/utility/intlMessages';
import {Button, Form, Input} from 'antd';
import logoSignIn from "../../image/Shipfast-logo_300px.png";
import {inject, observer} from "mobx-react";

import {Keys} from '../../stores';

const FormItem = Form.Item;

@Form.create()
@inject(Keys.auth)
@observer
export default class ForgotPassword extends React.Component {

  loginCallback = (response) => {
    console.log(response);
    if (response.status === "PARTIALLY_AUTHENTICATED") {
      let code = response.code;
      // let csrf = response.state;
      // Send code to server to exchange for access token
      let values = this.props.form.getFieldsValue();
      console.log("%cresponse..... ", 'color: #00b33c', code);
      console.log("%cvalues..........", 'color: #00b33c', values);
      this.setState({
        visiblePassForm: true,
        code: code
      });
    }
    else if (response.status === "NOT_AUTHENTICATED") {
      // handle authentication failure
      console.log("%cNOT_AUTHENTICATED", 'color: #ff0000',)
    }
    else if (response.status === "BAD_PARAMS") {
      // handle bad parameters
      console.log("%cBAD_PARAMS", 'color: #ff0000',)
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.visiblePassForm) {
          let {
            password
          } = values;
          let credentials = {
            NewPassword: password,
            Code: this.state.code
          };
          this.props.auth.forgotPassword(credentials);
        }
        else {
          this.AccountKit.login(
            'PHONE',
            {countryCode: "+84", phoneNumber: values.Phone}, // will use default values if not specified
            this.loginCallback
          );
        }
      }
    });
  };
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({confirmDirty: this.state.confirmDirty || !!value});
  };
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Mật khẩu không trùng khớp!');
    } else {
      callback();
    }
  };
  checkConfirm = (rule, value, callback) => {
    if (value && value.length < 8) {
      callback('Mật khẩu tối thiểu 8 ký tự!');
    } else {
      callback();
    }

    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], {force: true});
    }
    callback();
  };

  constructor() {
    super();
    this.AccountKit = null;
    this.state = {
      confirmDirty: false,
      visiblePassForm: false,
      code: null
    };
  }

  componentDidMount() {
    if (window.AccountKit) {
      this.AccountKit = window.AccountKit;
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div className="isoForgotPassPage">
        <div className="isoFormContent">
          <div className="isoLogoWrapper">
            <Link to="/dashboard">
              {/*<IntlMessages id="page.forgetPassTitle"/>*/}
              <img src={logoSignIn} alt="SHIP-FAST"/>
            </Link>
          </div>

          <div className="isoFormHeadText">
            <h3>
              {/*<IntlMessages id="page.forgetPassSubTitle"/>*/}
              Quên mật khẩu?
            </h3>
            {/*<p>*/}
            {/*/!*<IntlMessages id="page.forgetPassDescription"/>*!/*/}
            {/*Nhập Email của bạn, chúng tôi sẽ gửi lại mật khẩu vào Email.*/}
            {/*</p>*/}
          </div>

          <div className="isoForgotPassForm">
            <Form onSubmit={this.handleSubmit}>
              <div className="isoInputWrapper">

                {
                  this.state.visiblePassForm === false ?
                    <FormItem>
                      {getFieldDecorator('Phone', {
                        rules: [
                          {required: true, message: 'Vui lòng nhập số điện thoại của bạn'}
                        ]
                      })(
                        <Input size="large" placeholder="Nhập số điện thoại của bạn"/>
                      )}
                    </FormItem>
                    :
                    <div>
                      <FormItem
                        hasFeedback
                      >
                        {getFieldDecorator('password', {
                          rules: [{
                            required: true, message: 'Vui lòng nhập mật khẩu mới!',
                          }, {
                            validator: this.checkConfirm,
                          }],
                        })(
                          <Input
                            type="password"
                            placeholder="Nhập mật khẩu mới của bạn"
                            autoComplete={"new-password"}
                          />
                        )}
                      </FormItem>

                      <FormItem
                        hasFeedback
                      >
                        {getFieldDecorator('confirm', {
                          rules: [{
                            required: true, message: 'Vui lòng nhập lại mật khẩu!',
                          }, {
                            validator: this.checkPassword,
                          }],
                        })(
                          <Input
                            type="password"
                            placeholder="Nhập lại mật khẩu mới"
                            onBlur={this.handleConfirmBlur}
                          />
                        )}
                      </FormItem>
                    </div>
                }
              </div>

              <div className="isoInputWrapper">
                <Button type="primary" htmlType="submit">
                  {/*<IntlMessages id="page.sendRequest"/>*/}
                  Gửi
                </Button>
              </div>
              <div className="isoInputWrapper isoHelperWrapper" style={{textAlign: 'right'}}>
                <Link to="/signin">
                  Đăng nhập
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}