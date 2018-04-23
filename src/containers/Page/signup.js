import React from 'react';
import {Link} from 'react-router-dom';
import {Button, Checkbox, Form, Input} from 'antd';
import logoSignIn from "../../image/Shipfast-logo_300px.png";
import {inject, observer} from "mobx-react";
import {Keys} from '../../stores';

const FormItem = Form.Item;

@Form.create()
@inject(Keys.auth)
@observer
export default class SignUp extends React.Component {

  checkPassword = (rule, value, callback) => {
    if (value && value.length < 8) {
      callback('Mật khẩu tối thiểu 8 ký tự!');
    } else if (value && value.length > 20) {
      callback('Mật khẩu tối đa 20 ký tự!');
    } else {
      callback();
    }
  };

  loginCallback = (response) => {
    if (response.status === "PARTIALLY_AUTHENTICATED") {
      let code = response.code;
      // let csrf = response.state;
      // Send code to server to exchange for access token
      let values = this.props.form.getFieldsValue();
      console.log("%cresponse..... ", 'color: #00b33c', code);
      console.log("%cvalues..........", 'color: #00b33c', values)
      let {
        Name, Email, PassWord
      } = values;
      let credentials = {
        Name,
        Email,
        PassWord,
        Code: code
      };
      this.props.auth.create(credentials);
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
        let {
          Phone
        } = values;
        if (this.AccountKit) {
          this.AccountKit.login(
            'PHONE',
            {countryCode: "+84", phoneNumber: Phone}, // will use default values if not specified
            this.loginCallback
          );
          // this.props.createUser(credentials);
        }
      }
    });
  };

  constructor() {
    super();
    this.AccountKit = null;
    this.state = {
      redirectToReferrer: false,
      confirmDirty: false,
    };
  }

  componentDidMount() {
    if (window.AccountKit) {
      this.AccountKit = window.AccountKit;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.isLoggedIn !== nextProps.isLoggedIn &&
      nextProps.isLoggedIn === true
    ) {
      this.setState({redirectToReferrer: true});
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div className="isoSignUpPage">
        <div className="isoSignUpContent">
          <div className="isoLogoWrapper">
            <Link to="/dashboard">
              {/*<IntlMessages id="page.signUpTitle"/>*/}
              <img src={logoSignIn} alt="SHIP-FAST"/>
            </Link>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <div className="isoSignUpForm">
              <FormItem>
                {getFieldDecorator('Name', {
                  rules: [
                    {required: true, message: 'Vui lòng nhập tên của bạn'}
                  ]
                })(
                  <Input size="large" placeholder="Nhập tên của bạn"/>
                )}
              </FormItem>

              <FormItem>
                {getFieldDecorator('Email', {
                  rules: [{
                    type: 'email', message: 'Địa chỉ Email không chính xác',
                  }, {
                    required: true, message: 'Vui lòng nhập Email của bạn',
                  }]
                })(
                  <Input size="large" placeholder="Email"/>
                )}
              </FormItem>

              <FormItem>
                {getFieldDecorator('Phone', {
                  rules: [
                    {required: true, message: 'Vui lòng nhập số điện thoại của bạn'}
                  ]
                })(
                  <Input size="large" placeholder="Số điện thoại"/>
                )}
              </FormItem>

              <FormItem>
                {getFieldDecorator('PassWord', {
                  rules: [{
                    required: true, message: 'Vui lòng nhập mật khẩu',
                  }, {
                    validator: this.checkPassword,
                  }],
                })(
                  <Input
                    size="large"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    autoComplete={"new-password"}
                  />
                )}
              </FormItem>

              <FormItem>
                {getFieldDecorator('Agree', {
                  rules: [
                    {required: true, message: 'Bạn phải chấp nhận điều khoản của nhà cung cấp'},
                  ]
                })(
                  <Checkbox>
                    {/*<IntlMessages id="page.signUpTermsConditions"/>*/}
                    Tôi đồng ý với chính sách dịch vụ của Ship-Fast
                  </Checkbox>
                )}
              </FormItem>

              <Button
                type="primary"
                htmlType="submit"
                style={{width: '100%'}}
              >
                {/*<IntlMessages id="page.signUpButton"/>*/}
                Đăng ký
              </Button>

              <div className="isoInputWrapper isoCenterComponent isoHelperWrapper">
                <Link to="/signin">
                  {/*<IntlMessages id="page.signUpAlreadyAccount"/>*/}
                  Đã có tài khoản? Đăng nhập
                </Link>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}