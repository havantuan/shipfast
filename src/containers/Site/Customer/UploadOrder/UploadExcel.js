import {Button, Upload, Row, Col, Form} from 'antd';
import React, {Component} from 'react';
import apiUrl from "../../../../config/apiUrl";
import {isObservableArray} from 'mobx';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import basicStyle from "../../../../config/basicStyle";
import InventoryList from "../../Common/InventoryProvider/inventoryList";

const FormItem = Form.Item;

@Form.create()
@inject(Keys.uploadOrder, Keys.me)
@observer
export default class UploadExcel extends Component {

  constructor(props) {
    super(props);
    this.uploadOrder = props.uploadOrder;
  };

  beforeUpload = (file) => {
    this.uploadOrder.beforeUpload(file);
    return false;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {UploadInventoryID} = values;
        let credentials = {
          InventoryID: UploadInventoryID ? +UploadInventoryID : null
        };
        this.uploadOrder.handleSave(credentials);
      }
    });
  };

  render() {
    let URL = apiUrl.CUSTOMER_IMPORT_EXCEL_URL;
    const {getFieldDecorator} = this.props.form;
    const {selectedRowKeys} = this.uploadOrder;
    const hasSelected = isObservableArray(selectedRowKeys) ? selectedRowKeys.slice().length > 0 : false;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row gutter={basicStyle.gutter}>
          <Col sm={18} xs={24}>
            <FormItem
              labelCol={{
                xs: {span: 24},
                sm: {span: 4},
              }}
              wrapperCol={{
                xs: {span: 24},
                sm: {span: 20},
              }}
              label={'Kho hàng'}
            >
              {getFieldDecorator('UploadInventoryID', {
                rules: [
                  {required: true, message: 'Kho hàng không được bỏ trống'}
                ]
              })(
                <InventoryList
                  defaultInventory
                  params={['Address']}
                  userID={this.props.me.getUserID}
                />
              )}
            </FormItem>
          </Col>

          <Col sm={6} xs={24}>
            <Row gutter={basicStyle.gutter}>
              <Col sm={12} xs={24} className={'col-upload'}>
                <FormItem>
                  <Upload
                    action={URL}
                    onRemove={this.uploadOrder.removeFile}
                    beforeUpload={this.beforeUpload}
                    fileList={this.uploadOrder.fileList}
                  >
                    <Button
                      icon={'upload'}
                      style={{...basicStyle.greenButton, width: '100%'}}
                      loading={this.uploadOrder.uploading}
                    >
                      Tải file
                    </Button>
                  </Upload>
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem>
                  <Button
                    htmlType={'submit'}
                    type={'primary'}
                    style={{width: '100%'}}
                    icon={'save'}
                    disabled={!hasSelected}
                    loading={this.uploadOrder.isImporting}
                  >
                    Lưu
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    );
  }
}