import React from 'react';
import ObjectPath from 'object-path';
import moment from "moment";
import {Button, Col, DatePicker, Form, Input, Modal, Row, Spin, Switch} from 'antd';
import createNotification from "../../../../components/notification";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';

const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 7},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 17},
  },
};

@Form.create()
@inject(Keys.discount)
@observer
export default class DiscountModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.discount = this.props.discount;
  }

  handleCancel = () => {
    this.props.form.resetFields();
    this.discount.onCancelModal();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          Code,
          Name,
          Date,
          Discount,
          DiscountPercent,
          Limit,
          LimitPerUser,
          State,
          RequireCode
        } = values;
        if (!Discount && !DiscountPercent) {
          createNotification('error', 'Lỗi', 'Giảm giá không được để trống');
          return;
        }
        let credentials = {
          Code,
          Name,
          Start: Date ? Date[0].format() : null,
          End: Date ? Date[1].format() : null,
          Discount: Discount ? +Discount : null,
          DiscountPercent: DiscountPercent ? +DiscountPercent : null,
          Limit: Limit ? +Limit : null,
          LimitPerUser: LimitPerUser ? +LimitPerUser : null,
          State: State ? 1 : 0,
          RequireCode
        };
        this.discount.onSubmitFormModal(credentials).then(() => {
          this.props.form.resetFields();
        });
      }
    });
  };

  render() {
    let {currentRow = {}, isUpdateMode} = this.discount;
    const {getFieldDecorator} = this.props.form;
    let loading = this.discount.isUpdating || this.discount.isCreating;
    let fetching = this.discount.isFetchingCurrentRow;
    return (
      <Modal
        width={'600px'}
        title={`${isUpdateMode ? 'Cập nhật khuyến mại' : 'Tạo khuyến mại mới'}`}
        visible={this.discount.isShowModal}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        footer={[
          <Button key="cancel" onClick={this.handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
            {isUpdateMode ? 'Cập nhật' : 'Tạo'}
          </Button>
        ]}
      >
        {fetching ? <Spin spinning/> :
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="Tên"
            >
              {getFieldDecorator('Name', {
                rules: [
                  {required: true, message: 'Vui lòng nhập tên khuyến mại'}
                ],
                initialValue: isUpdateMode ? currentRow.Name : null
              })(
                <Input size="default" placeholder="Tên chương trình khuyến mại"/>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Mã khuyến mại"
            >
              {getFieldDecorator('Code', {
                rules: [
                  {required: true, message: 'Vui lòng nhập mã khuyến mại'}
                ],
                initialValue: isUpdateMode ? currentRow.Code : null
              })(
                <Input size="default"
                       disabled={isUpdateMode}
                       placeholder="Mã khuyến mại"/>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Thời gian"
            >
              {getFieldDecorator('Date', {
                initialValue: isUpdateMode ?
                  [
                    moment(`${ObjectPath.get(currentRow, 'TimeStart.ISO', moment().format())}`, 'YYYY-MM-DD HH:mm'),
                    moment(`${ObjectPath.get(currentRow, 'TimeEnd.ISO', moment().format())}`, 'YYYY-MM-DD HH:mm')
                  ]
                  : null
              })(
                <RangePicker
                  size="default"
                  style={{width: '100%'}}
                  showTime={{format: 'HH:mm'}}
                  format="YYYY-MM-DD HH:mm"
                  placeholder={['Bắt đầu', 'Kết thúc']}
                />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Giảm giá"
            >
              <Row>
                <Col span={10}>
                  <FormItem>
                    {getFieldDecorator('Discount', {
                      initialValue: isUpdateMode ? currentRow.Discount : null
                    })(
                      <Input size="default" placeholder="0" addonAfter={'VNĐ/đơn'}/>
                    )}
                  </FormItem>
                </Col>

                <Col span={4} style={{textAlign: 'center'}}>
                  <span>Hoặc</span>
                </Col>

                <Col span={10}>
                  <FormItem>
                    {getFieldDecorator('DiscountPercent', {
                      initialValue: isUpdateMode ? currentRow.DiscountPercent : null
                    })(
                      <Input size="default" placeholder="0" addonAfter={'%/đơn'}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Giới hạn"
            >
              <Row>
                <Col span={10}>
                  <FormItem>
                    {getFieldDecorator('LimitPerUser', {
                      initialValue: isUpdateMode ? currentRow.LimitPerUser : null
                    })(
                      <Input size="default" placeholder="0" addonAfter={'đơn đầu tiên'}/>
                    )}
                  </FormItem>
                </Col>

                <Col offset={4} span={10}>
                  <FormItem>
                    {getFieldDecorator('Limit', {
                      initialValue: isUpdateMode ? currentRow.Limit : null
                    })(
                      <Input size="default" placeholder="0" addonAfter={'đơn/người'}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Trạng thái"
            >
              {
                getFieldDecorator('State', {
                  valuePropName: 'checked',
                  initialValue: isUpdateMode ? ObjectPath.get(currentRow, 'State.Value', 0) === 1 : true
                })(
                  <Switch/>
                )
              }
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Yêu cầu nhập mã"
            >
              {
                getFieldDecorator('RequireCode', {
                  valuePropName: 'checked',
                  initialValue: isUpdateMode ? currentRow.RequireCode : true
                })(
                  <Switch/>
                )
              }
            </FormItem>
          </Form>
        }
      </Modal>
    )
  }

}