import React, {Component} from 'react';
import {Link, Redirect, withRouter} from 'react-router-dom';
import {Button, Form, Input} from 'antd';
import {inject, observer} from "mobx-react";
import routerConfig from "../../config/router";
import logoSignIn from "../../image/Shipfast-logo_300px.png";
import {Keys} from '../../stores';

const FormItem = Form.Item;
@Form.create()
@inject(Keys.auth, Keys.router)
@withRouter
@observer
export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.auth = this.props.auth;
    this.router = this.props.router;
    this.form = this.props.form;
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.form.validateFields((err, values) => {
      if (!err) {
        this.auth.login(values.username, values.password);
      }
    });
  };

  render() {

    console.log("signin loading", this.auth.loading, this.props);
    const from = {pathname: routerConfig.dashboard};
    const {getFieldDecorator} = this.form;

    if (this.auth.isAuthenticate) {
      return <Redirect to={from}/>;
    }
    return (
      <div className="isoSignInPage">
        <div className="isoLoginContent">
          <div className="isoLogoWrapper">
            <Link to="/dashboard">
              <img src={logoSignIn} alt="SHIP-FAST"/>
            </Link>
          </div>

          <Form onSubmit={this.handleSubmit}>

            <div className="isoSignInForm">
              <FormItem>
                {getFieldDecorator('username', {
                  rules: [{required: true, message: 'Vui lòng nhập Email hoặc Số điện thoại'}]
                })(
                  <Input
                    size="large"
                    placeholder="Email/ Số điện thoại"
                  />
                )}
              </FormItem>

              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{required: true, message: 'Vui lòng nhập mật khẩu'}]
                })(
                  <Input
                    size="large"
                    type="password"
                    placeholder="Mật khẩu..."
                  />
                )}
              </FormItem>

              <div className="isoInputWrapper isoLeftRightComponent">

                <Button type="primary" style={{width: "100%"}} htmlType="submit" loading={this.auth.loading}>
                  {this.auth.loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
              </div>
            </div>
            <div style={{margin: "15px 0 0 0"}}>
              <Link to="/forgotpassword">
                Quên mật khẩu
              </Link>
              {
                process.env.SITE === 'KH' &&
                <Link to="/signup" style={{float: "right"}}>
                  Chưa có tài khoản?
                </Link>
              }
            </div>

          </Form>
        </div>
      </div>
    );
  }
}
