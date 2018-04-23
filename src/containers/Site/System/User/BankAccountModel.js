import React, {Component} from 'react';

import {Button, Col, Form, Input, Row} from 'antd';

import ContentHolder from '../../../../components/utility/ContentHolder';
import basicStyle from '../../../../config/basicStyle';
import './Style.css';
import BankProvider from "../../Common/Bank/BankProvider";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';

const FormItem = Form.Item;

@Form.create()
@inject(Keys.myBank)
@observer
export default class BankAccountModel extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        let {
          Owner,
          Branch,
          AccountNumber,
          BankID
        } = values;

        let credentials = {
          AccountNumber,
          Branch,
          Owner,
          BankID: +BankID,
        };

        if (this.props.dataUpdate) {
          this.myBank.update(this.props.dataUpdate.ID, credentials);
        } else {
          this.myBank.create(credentials);
        }
      }
    });
  };

  constructor(props) {
    super(props);
    this.myBank = this.props.myBank
  }

  componentWillReceiveProps(nextProps, nextState) {
    let {dataUpdate} = nextProps;
    if (dataUpdate && dataUpdate !== this.props.dataUpdate) {
      this.props.form.setFieldsValue({
        "AccountNumber": dataUpdate.AccountNumber,
        "Owner": dataUpdate.Owner,
        "Branch": dataUpdate.Branch,

      })
    }
    if (dataUpdate === null && dataUpdate !== this.props.dataUpdate) {
      this.props.form.setFieldsValue({
        "AccountNumber": '',
        "Owner": '',
        "Branch": '',
      })
    }

  }

  componentDidMount() {
    let {dataUpdate} = this.props;
    if (dataUpdate) {
      this.props.form.setFieldsValue({
        "AccountNumber": dataUpdate.AccountNumber,
        "Owner": dataUpdate.Owner,
        "Branch": dataUpdate.Branch,
      })
    }

  }

  render() {
    const {rowStyle, gutter} = basicStyle;
    const {dataUpdate} = this.props;
    const {getFieldDecorator} = this.props.form;
    return (
      <ContentHolder>
        <Form onSubmit={this.handleSubmit}>

          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={12} sm={12} xs={12}>
              <FormItem
              >
                {getFieldDecorator('AccountNumber', {
                  rules: [
                    {required: true, message: 'Vui lòng nhập số tài khoản'}
                  ],
                  initialValue: dataUpdate ? dataUpdate.AccountNumber : null
                })(
                  <Input
                    placeholder="Số tài khoản"
                    size="default"
                  />
                )}
              </FormItem>

              <FormItem>
                {getFieldDecorator('Owner', {
                  rules: [
                    {required: true, message: 'Vui lòng nhập tên chủ tài khoản'}
                  ],
                  initialValue: dataUpdate ? dataUpdate.Owner : null
                })(
                  <Input
                    placeholder="Tên chủ tài khoản"
                    size="default"
                  />
                )}
              </FormItem>
            </Col>

            <Col md={12} sm={12} xs={12}>
              <FormItem>
                {getFieldDecorator('BankID', {
                  rules: [
                    {required: true, message: 'Vui lòng nhập ngân hàng'}
                  ],
                  initialValue: dataUpdate ? dataUpdate.Bank && `${dataUpdate.Bank.ID}` : null
                })(
                  <BankProvider
                    form={this.props.form}
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('Branch', {
                  rules: [
                    {required: true, message: 'Chi nhánh'}
                  ],
                  initialValue: dataUpdate ? dataUpdate.Branch : null
                })(
                  <Input
                    placeholder="Chi nhánh"
                    size="default"
                  />
                )}
              </FormItem>
            </Col>

          </Row>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={24} sm={24} xs={24}>
              <FormItem
              >
                <Button
                  type="primary"
                  icon="check"
                  size="default"
                  htmlType="submit"
                >
                  {dataUpdate ? 'Cập nhật tài khoản ngân hàng' : 'Tạo tài khoản ngân hàng'}
                </Button>
              </FormItem>
            </Col>
          </Row>

        </Form>
      </ContentHolder>
    )
  }
}

