import React, {Component} from 'react';

import {Button, Col, Form, Icon, Input, Row, Tooltip} from 'antd';

import ContentHolder from '../../../../components/utility/ContentHolder';
import basicStyle from '../../../../config/basicStyle';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ObjectPath from "object-path";
import './Style.css';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 24},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 24},
  },
};

@Form.create()
@inject(Keys.myApiKey)
@observer
export default class ApiKeyModel extends Component {

  state = {
    copied: false,
    dataKey: {},
  }
  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          Description,
          Name
        } = values;
        let credentials = {
          Description,
          Name
        };

        console.log("submit", this.myApiKey)

        this.props.dataUpdate ? this.myApiKey.update(this.props.dataUpdate.AccessKey, credentials) : this.myApiKey.create(credentials).then((result) => {
          console.log('result 2', result);
          this.setState({
            dataKey: result.data
          })
        });
      }
    })
  }

  constructor(props) {
    super(props);
    this.myApiKey = props.myApiKey

  }

  componentWillReceiveProps(nextProps, nextState) {
    let {dataUpdate} = nextProps;
    if (dataUpdate && dataUpdate !== this.props.dataUpdate) {
      this.props.form.setFieldsValue({
        "Description": dataUpdate.Description,
        "Name": dataUpdate.Name,

      })
    }
    if (!dataUpdate && dataUpdate !== this.props.dataUpdate) {
      this.props.form.setFieldsValue({
        "Description": "",
        "Name": "",

      })
    }

  }

  componentDidMount() {
    let {dataUpdate} = this.props;
    if (dataUpdate) {
      this.props.form.setFieldsValue({
        "Description": dataUpdate.Description,
        "Name": dataUpdate.Name,

      })
    }

  }

  render() {
    const {rowStyle, gutter} = basicStyle;
    let dataKey = this.state.dataKey;
    const {dataUpdate} = this.props;
    const {getFieldDecorator} = this.props.form;
    return (
      <ContentHolder style={{paddingTop: '20px'}}>
        {Object.keys(dataKey).length === 0 ?
          <Form onSubmit={this.handleSubmit}>

            <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={12} sm={12} xs={12}>
                <h3>Tên</h3>
              </Col>
              <Col md={12} sm={12} xs={12}>
                <h3>Mô tả</h3>
              </Col>
              <Col md={12} sm={12} xs={12}>
              </Col>
            </Row>
            <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={12} sm={12} xs={12}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('Name', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập tên đăng nhập'}
                    ],
                  })(
                    <Input
                      placeholder="Tên đăng nhập"
                      size="default"
                    />
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={12} xs={12}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('Description', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập tên đăng nhập'}
                    ],
                  })(
                    <Input
                      placeholder="Mô tả"
                      size="default"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <h4 className="text-info">Tên và hoặc mô tả là tùy chọn để giúp bạn nhớ những gì nó được sử dụng
              cho. Bạn chỉ cần tạo một khoá bằng cách nhấp vào Tạo.</h4>
            <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={12}>
                <Button type="primary" htmlType="submit">{dataUpdate ? 'Cập nhật' : 'Tạo'}</Button>
              </Col>
            </Row>
          </Form>
          :
          <div>
            <h2>Tạo tài khoản đăng nhập</h2>
            <h3 className="line-height">Tên đăng nhập: <span
              className="text-key">{ObjectPath.get(dataKey, "AccessKey")}</span><CopyToClipboard
              text={ObjectPath.get(dataKey, "AccessKey")}><Tooltip title="Copy"><Icon
              type="copy"/></Tooltip></CopyToClipboard></h3>
            <h3 className="line-height">Mật khẩu: <span
              className="text-key">{ObjectPath.get(dataKey, "SecretKey")}</span><CopyToClipboard
              text={ObjectPath.get(dataKey, "SecretKey")}><Tooltip title="Copy"><Icon
              type="copy"/></Tooltip></CopyToClipboard></h3>
            <div className="warning">
              <Icon type="flag" style={{fontSize: 30, color: '#cc812b'}}/>
              Lưu ý, hãy lưu lại lại những thông tin trên. Đây là lần duy nhất bạn có thể nhìn thấy các thông tin này!
            </div>

          </div>
        }
      </ContentHolder>
    )
  }
}