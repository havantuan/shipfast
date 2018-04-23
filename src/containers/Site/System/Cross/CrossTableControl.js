import React, {Component} from 'react';
import {Button, Col, Form, Row, Input, Modal} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import UserList from "../../Common/User/UserList";
import Permission from "../../../../permissions/index";
import {defaultOptionsConfig} from "../../../../config";
import SelectDate from "../../Common/SelectDate/SelectDate";
import CrossStatus from "../../Common/CrossStatusProvider/CrossStatus";

const confirm = Modal.confirm;
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

const FormItem = Form.Item;
@Form.create()
@inject(Keys.crossTable, Keys.staffByUser)
@observer
export default class CrossTableControl extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Form values: ', values);
      if (!err) {
        let {Codes, UserID, CrossStatus, CreatedDate} = values;
        let credentials = {
          Codes: Codes,
          UserID: UserID ? +UserID : undefined,
          StatusCodes: CrossStatus ? [+CrossStatus] : undefined,
          CreatedFrom: CreatedDate ? CreatedDate[0] : undefined,
          CreatedTo: CreatedDate ? CreatedDate[1] : undefined
        };
        this.props.crossTable.onFilter(credentials);
      }
    });
  };

  updateCross = () => {
    let that = this.props;
    confirm({
      title: `Bạn có muốn chuyển ${this.props.crossTable.listCode.length} đối soát không ?`,
      content: 'Bạn ấn OK bạn sẽ chuyển các đối soát đã chọn',
      onOk() {
        that.crossTable.updateCross();
      },
      onCancel() {
      },
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className={'custom-form'}>
        <Row gutter={basicStyle.gutter}>
          <Col md={18} sm={24}>
            <Row gutter={basicStyle.gutter}>
              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Nhập mã'}
                >
                  {getFieldDecorator('Codes')(
                    <Input placeholder="Nhập mã code"/>
                  )}
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Khách hàng'}
                >
                  {getFieldDecorator('UserID')(
                    <UserList
                      placeholder="Nhập SĐT, tên, email, khách hàng"
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
                  {Permission.allowUpdateCustomerCross() ?
                    <Button
                      style={this.props.crossTable.listCode.length === 0 ? {width: '100%'} : basicStyle.greenButton}
                      icon="check"
                      disabled={this.props.crossTable.listCode.length === 0}
                      onClick={this.updateCross}
                    >
                      Chuyển đối soát
                    </Button>
                    : null}
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
                  {...formItemLayout}
                  label={'Thời gian'}
                >
                  {getFieldDecorator('CreatedDate', {
                    initialValue: this.props.crossTable.timeSelected
                  })(
                  <SelectDate
                    defaultSelected={defaultOptionsConfig.date}
                  />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={'Trạng thái'}
                >
                  {getFieldDecorator('CrossStatus')(
                    <CrossStatus/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col md={6}>
            <Row>
              <FormItem>
                <Button
                  style={{width: '100%'}}
                  icon={'search'}
                  type={'primary'}
                  htmlType="submit"
                >
                  Lọc
                </Button>
              </FormItem>
            </Row>
          </Col>
        </Row>

      </Form>
    )
  }

}
