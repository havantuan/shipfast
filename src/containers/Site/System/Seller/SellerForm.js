import React, {Component} from 'react';
import {Button, Form, Input, Spin, Switch, Modal} from 'antd';
import ObjectPath from 'object-path';
import EnumKHType from "../../Common/EnumProvider/khType";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';

const FormItem = Form.Item;
@Form.create()
@inject(Keys.customerTable)
@observer
export default class SellerForm extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, value) => {
      if (!err) {
        let {
          Name,
          Email,
          Phone,
          KHType,
          TookCare
        } = value;
        let credentials = {
          Name,
          Email,
          Phone,
          KHType: KHType ? +KHType : undefined,
          TookCare: TookCare === true ? 1 : 0
        };
        this.props.customerTable.onSubmitFormModal(credentials).then(() => {
          this.props.form.resetFields();
        });
      }
    })
  };

  render() {
    let {currentRow, isUpdateMode} = this.props.customerTable;
    const {getFieldDecorator} = this.props.form;
    let loading = this.props.customerTable.isUpdating || this.props.customerTable.isCreating;
    let fetching = this.props.customerTable.isFetchingCurrentRow;
    let dataSource = currentRow;
    let fillEditData = isUpdateMode;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
        md: {span: 4}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
        md: {span: 20}
      },
    };

    return (

      <Modal
        title={`${isUpdateMode ? 'Cập nhật thông tin khách hàng' : 'Tạo tài khoản khách hàng'}`}
        visible={this.props.customerTable.isShowModal}
        onOk={this.handleSubmit}
        width='70%'
        onCancel={this.props.customerTable.onCancelModal}
        footer={[
          <Button key="cancel" onClick={this.props.customerTable.onCancelModal}>
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
              label={'Họ tên'}
            >
              {getFieldDecorator('Name', {
                rules: [
                  {required: true, message: 'Vui lòng nhập họ tên khách hàng'}
                ],
                initialValue: fillEditData ? dataSource.Name : null
              })(
                <Input
                  placeholder={'Họ tên'}
                />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={'Email'}
            >
              {getFieldDecorator('Email', {
                rules: [
                  {type: 'email', message: 'Email không hợp lệ'},
                  {required: true, message: 'Vui lòng nhập Email'}
                ],
                initialValue: fillEditData ? dataSource.Email : null
              })(
                <Input
                  placeholder={'Email'}
                />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={'Số điện thoại'}
            >
              {getFieldDecorator('Phone', {
                rules: [
                  {required: true, message: 'Vui lòng nhập số điện thoại'}
                ],
                initialValue: fillEditData ? dataSource.Phone : null
              })(
                <Input
                  placeholder={'Số điện thoại'}
                />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={'Loại khách hàng'}
            >
              {getFieldDecorator('KHType', {
                rules: [
                  {required: true, message: 'Vui lòng chọn loại khách hàng'}
                ],
                initialValue: fillEditData ? ObjectPath.get(dataSource, 'KHType.Value') : 2
              })(
                <EnumKHType
                  valueByCode={false}
                  placeholder={'Loại khách hàng'}
                />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={'Chăm sóc'}
            >
              {getFieldDecorator('TookCare', {
                valuePropName: 'checked',
                initialValue: fillEditData ? dataSource.TookCare : false
              })(
                <Switch/>
              )}
            </FormItem>

          </Form>
        }
      </Modal>
    )
  }

}