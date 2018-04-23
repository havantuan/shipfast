import React from 'react';
import {Modal, Form, Input, Button} from 'antd';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import NumberFormat from "react-number-format";
import {formatNumber} from "../../../../helpers/utility";

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

@Form.create()
@inject(Keys.detailcross)
@observer
export default class ModalUpdateCross extends React.PureComponent {

  constructor(props) {
    super(props);
    this.detailcross = props.detailcross;
  }

  handleClickCancel = () => {
    this.props.form.resetFields();
    this.props.form.setFieldsValue({ExtraFee: ''});
    this.detailcross.closeModal();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          ExtraFee,
          Note
        } = values;
        let credentials = {
          ExtraFee: ExtraFee ? formatNumber(ExtraFee) : undefined,
          Note
        };
        console.log('%cvalues...', 'color: #00b33c', this.props.crossCode);
        this.detailcross.updateCustomerCross(this.props.crossCode, credentials);
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    let {isShowModal, isUpdating} = this.detailcross;
    return (
      <Modal
        title="Cập nhật đối soát"
        visible={isShowModal}
        onOk={this.handleSubmit}
        onCancel={this.detailcross.closeModal}
        footer={[
          <Button key="back" onClick={this.handleClickCancel}>Hủy</Button>,
          <Button key="submit" type="primary" loading={isUpdating} onClick={this.handleSubmit}>
            Cập nhật
          </Button>,
        ]}
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label={'Phí bổ sung'}
          >
            {getFieldDecorator('ExtraFee', {
              rules: [
                {required: true, message: 'Vui lòng nhập phí bổ sung'}
              ]
            })(
              <NumberFormat
                placeholder="VNĐ" thousandSeparator={true}
                suffix={' VNĐ'} className="ant-input"
              />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={'Ghi chú'}
          >
            {getFieldDecorator('Note')(
              <Input.TextArea placeholder={'Nhập ghi chú'}/>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }

}