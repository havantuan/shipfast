import React, {Component} from 'react';

import {Button, Col, Form, Input, Row, Spin} from 'antd';
import basicStyle from '../../../../config/basicStyle';
import './Style.css';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';

const FormItem = Form.Item;

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
@inject(Keys.updateCustomer, Keys.me)
@observer
export default class InfomationCustomer extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          Name,
        } = values;
        let credentials = {
          Name,
        };
        console.log("%cupdate", 'color: #00b33c', credentials);
        this.updateCustomer.updateUserInfo(credentials);
      }
    });
  };

  constructor(props) {
    super(props)
    this.updateCustomer = this.props.updateCustomer;
    this.me = this.props.me;

  }

  render() {
    const {rowStyle, gutter} = basicStyle;
    console.log(this.me)
    const {current: dataSource} = this.me;
    const {fetching} = this.updateCustomer;
    const {getFieldDecorator} = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit} style={{marginBottom: '20px'}}>
        <Spin spinning={fetching || false}>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={24} sm={24} xs={24}>
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

// const mapStateToProps = state => {
//   return myInfo.mapState(state);
// };
//
// const mapDispatchToProps = dispatch => {
//   return {
//     getDataSource: () => dispatch(myInfo.request()),
//     updateInformation: (credentials) => dispatch(updateInformation.request(credentials))
//   }
// };
//
// InfomationCustomer.propTypes = propTypes;
// InfomationCustomer.defaultProps = defaultProps;
//
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Form.create()(withRouter(InfomationCustomer)));
