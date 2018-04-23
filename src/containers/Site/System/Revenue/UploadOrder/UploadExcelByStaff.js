import {Button, Upload, Row, Col, Form, Switch} from 'antd';
import React, {Component} from 'react';
import apiUrl from "../../../../../config/apiUrl";
import {isObservableArray} from 'mobx';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../stores/index";
import InventoryProvider from '../../../Common/InventoryProvider/inventoryList';
import basicStyle from "../../../../../config/basicStyle";
import HubsList from "../../../Common/HubProvider/hubList";

const FormItem = Form.Item;
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
@inject(Keys.uploadOrderByStaff, Keys.me)
@observer
export default class UploadExcel extends Component {

  constructor(props) {
    super(props);
    this.uploadOrderByStaff = props.uploadOrderByStaff;
  };

  // onChangeInventory = (inventory) => {
  //   this.props.form.setFieldsValue({
  //     'UploadInventoryID': inventory ? inventory.ID : undefined
  //   });
  //   this.uploadOrderByStaff.onChangeInventory(inventory);
  // };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let {IsPickUpInHub, UploadInventoryID, UploadHubID} = values;
        let credentials = {
          IsPickUpInHub,
          InventoryID: UploadInventoryID ? +UploadInventoryID : null,
          SenderHubID: UploadHubID ? +UploadHubID : null
        };
        this.uploadOrderByStaff.handleSave(credentials);
      }
    });
  };

  beforeUpload = (file) => {
    this.uploadOrderByStaff.beforeUpload(file);
    return false;
  };

  render() {
    let {selectedRowKeys} = this.uploadOrderByStaff;
    const {getFieldDecorator} = this.props.form;
    const hasSelected = isObservableArray(selectedRowKeys) ? selectedRowKeys.slice().length > 0 : false;
    let URL = apiUrl.CUSTOMER_IMPORT_EXCEL_URL;

    return (
      <Form onSubmit={this.handleSubmit} className={'custom-form'}>
        <Row gutter={basicStyle.gutter}>
          <Col span={24}>
            <FormItem
              labelCol={{
                xs: {span: 24},
                sm: {span: 3},
              }}
              wrapperCol={{
                xs: {span: 24},
                sm: {span: 21},
              }}
              label={'Kho hàng'}
            >
              {getFieldDecorator('UploadInventoryID', {
                rules: [
                  {required: true, message: 'Kho hàng không được bỏ trống'}
                ]
              })(
                <InventoryProvider
                  defaultInventory
                  params={['Address']}
                  userID={this.uploadOrderByStaff.userID}
                />
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={basicStyle.gutter}>
          <Col sm={9} xs={24} style={{paddingRight: 0}}>
            <FormItem
              {...formItemLayout}
              label={'Điểm gửi hàng'}
            >
              {getFieldDecorator('UploadHubID', {
                initialValue: this.props.me.getCurrentHub()
              })(
                <HubsList
                  show
                  disabled={false}
                />
              )}
            </FormItem>
          </Col>

          <Col sm={9} xs={24}>
            <FormItem
              {...formItemLayout}
              label={'Nhận hàng tại Hub'}
            >
              {getFieldDecorator('IsPickUpInHub', {
                valuePropName: 'checked',
                initialValue: true
              })(
                <Switch/>
              )}
            </FormItem>
          </Col>

          <Col sm={3} xs={24} className={'col-upload'}>
            <FormItem>
              <Upload
                action={URL}
                onRemove={this.uploadOrderByStaff.removeFile}
                beforeUpload={this.beforeUpload}
                fileList={this.uploadOrderByStaff.fileList}
              >
                <Button
                  icon={'upload'}
                  style={{width: '100%', ...basicStyle.greenButton}}
                  loading={this.uploadOrderByStaff.uploading}
                >
                  Tải file
                </Button>
              </Upload>
            </FormItem>
          </Col>

          <Col sm={3} xs={24}>
            <FormItem>
              <Button
                style={{width: '100%'}}
                htmlType={'submit'}
                type={'primary'}
                icon={'save'}
                disabled={!hasSelected}
                loading={this.uploadOrderByStaff.isImporting}
              >
                Lưu
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      // <Row type={'flex'} gutter={10} justify={'center'}>
      //   <Col md={8} sm={12} xs={16} className={'col-upload'}>
      //     <Upload
      //       action={URL}
      //       onRemove={this.uploadOrderByStaff.removeFile}
      //       beforeUpload={this.beforeUpload}
      //       fileList={this.uploadOrderByStaff.fileList}
      //     >
      //       <Button
      //         icon={'upload'}
      //         size={'large'}
      //         type={'primary'}
      //         style={{width: '100%'}}
      //       >
      //         Chọn file excel
      //       </Button>
      //     </Upload>
      //   </Col>
      //
      //   <Col md={3} sm={6} xs={6}>
      //     <Button
      //       size={'large'}
      //       key="submit"
      //       type={'primary'}
      //       style={{width: '100%'}}
      //       onClick={this.uploadOrderByStaff.handleUploadByStaff}
      //       disabled={this.uploadOrderByStaff.fileList.slice().length === 0}
      //       loading={this.uploadOrderByStaff.uploading}
      //     >
      //       Tải lên
      //     </Button>
      //   </Col>
      // </Row>
    );
  }
}