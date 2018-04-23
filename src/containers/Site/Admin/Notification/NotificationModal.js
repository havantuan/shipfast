import React from 'react';

import {Button, Col, DatePicker, Form, Input, Modal, Row} from 'antd';
import basicStyle from '../../../../config/basicStyle';
import AppTypes from "../../Common/EnumProvider/appTypes";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import 'moment/locale/vi';
import NotificationTypes from '../../Common/EnumProvider/notificationTypes';

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
@inject(Keys.notification)
@observer
export default class NotificationModal extends React.PureComponent {

  handleCancel = () => {
    this.props.notification.onCancelModal();
    this.props.form.resetFields();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {

      if (!err) {
        let {
          Title,
          AppType,
          Body,
          NotificationType,
          Date,
        } = values;
        let credentials = {
          Title,
          AppType: AppType ? +AppType : null,
          Date: Date.format(),
          Body,
          NotificationType: NotificationType ? +NotificationType : null,
          Scope: 1,
        };
        this.props.notification.onSubmitFormModal(credentials).then(() => {
          this.props.form.resetFields();
        });
      }
    });
  };

  render() {
    const {rowStyle, gutter} = basicStyle;
    const {getFieldDecorator} = this.props.form;
    const {loading} = this.props.notification.isCreating;

    return (
      <Modal
        title="Tạo thông báo mới"
        visible={this.props.notification.isShowModal}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        footer={[
          <Button key="cancel" onClick={this.props.notification.onCancelModal}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
            Tạo
          </Button>
        ]}
      >
        <Form onSubmit={this.handleSubmit}>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label="Tiêu đề"
                oncol={true}
              >
                {getFieldDecorator('Title', {
                  rules: [
                    {required: true, message: 'Vui lòng nhập tiêu đề'}
                  ]
                })(
                  <Input
                    size="default"
                  />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label="Nội dung"
                oncol={true}
              >
                {getFieldDecorator('Body', {
                  rules: [
                    {required: true, message: 'Vui lòng nhập nội dung'}
                  ]
                })(
                  <TextArea rows={4}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label="Thời gian"
                oncol={true}
              >
                {getFieldDecorator('Date')(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="Chọn thời gian"
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label="Loại thông báo"
                oncol={true}
              >
                {getFieldDecorator('NotificationType', {
                  rules: [
                    {required: true, message: 'Loại thông báo'}
                  ],
                  initialValue: '0'
                })(
                  <NotificationTypes/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label="Đối tượng"
                oncol={true}
              >
                {getFieldDecorator('AppType', {
                  rules: [
                    {required: true, message: 'Đối tượng'}
                  ],
                  initialValue: '0'
                })(
                  <AppTypes placeholder="Đối tượng nhận thông báo"/>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }

}