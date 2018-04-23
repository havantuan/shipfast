import React, {Component} from 'react';
import ObjectPath from 'object-path';

import {Button, Col, Form, Input, Modal, Row, Spin, Switch} from 'antd';
import basicStyle from '../../../../config/basicStyle';
import City from '../../Common/Location/City';
import District from '../../Common/Location/District';
import Ward from '../../Common/Location/Ward';
import EnumState from "../../Common/EnumProvider/state";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

const FormItem = Form.Item;


const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8},
  },
  wrapperCol: {
    xs: {span: 16},
    sm: {span: 16},
  },
};

@Form.create()
@inject(Keys.myInventory)
@observer
export default class InventoryForm extends Component {

  // onCityIDChange = (CityID) => {
  //     this.setState({
  //         CityID: CityID,
  //         DistrictID: null
  //     });
  // };
  // onDistrictIDChange = (DistrictID) => {
  //     this.setState({
  //         DistrictID: DistrictID,
  //     });
  // };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log("", values.IsDefault);
      if (!err) {
        let {
          Address,
          Code,
          DistrictID,
          // HubID,
          Name,
          Phone,
          State,
          WardID,
          IsDefault
        } = values;
        let credentials = {
          Address,
          Code,
          DistrictID: DistrictID ? +DistrictID : null,
          // HubID: +HubID,
          Name,
          Phone,
          State: State ? +State : null,
          WardID: WardID ? +WardID : null,
          IsDefault: IsDefault === true ? 1 : 0
        };
        this.myInventory.onSubmitFormModal(credentials).then(() => {
          this.props.form.resetFields();
          console.log("onSuccess");
          if (this.props.onSuccess) {
            this.props.onSuccess();
          }
        });
      }
    });
  };

  constructor(props) {
    super(props);
    this.myInventory = props.myInventory;
  }


  render() {


    let {currentRow, isUpdateMode} = this.myInventory;

    const {gutter, rowStyle} = basicStyle;
    const {getFieldDecorator} = this.props.form;
    let loading = this.myInventory.isUpdating || this.myInventory.isCreating;
    let fetching = this.myInventory.isFetchingCurrentRow;
    let dataSource = currentRow;
    let fillEditData = isUpdateMode;
    return (
      <Modal
        title={`${isUpdateMode ? 'Cập nhật kho hàng' : 'Tạo kho hàng mới'}`}
        visible={this.myInventory.isShowModal}
        onOk={this.handleSubmit}
        width='70%'
        onCancel={this.myInventory.onCancelModal}
        footer={[
          <Button key="cancel" onClick={this.myInventory.onCancelModal}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
            {isUpdateMode ? 'Cập nhật' : 'Tạo'}
          </Button>
        ]}
      >
        {fetching ? <Spin spinning/> :
          <Form onSubmit={this.handleSubmit}>

            <Row style={rowStyle} gutter={gutter} justify="start">
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="Tên kho hàng"
                  extra='Bạn có thể đặt theo “[Họ tên] - Kho [Tên quận]”'
                >
                  {getFieldDecorator('Name', {
                    rules: [
                      {
                        required: true,
                        message: 'Vui lòng nhập người liên hệ giao hàng'
                      }
                    ],
                    initialValue: fillEditData ? dataSource.Name : null
                  })(
                    <Input
                      size="default"
                    />
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="Số điện thoại"
                >
                  {getFieldDecorator('Phone', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập số điện thoại'}
                    ],
                    initialValue: fillEditData ? dataSource.Phone : null
                  })(
                    <Input
                      placeholder="09xxxxxxxx"
                      size="default"
                    />
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="Trạng thái"
                >
                  {getFieldDecorator('State', {
                    rules: [
                      {required: true, message: 'Vui lòng chọn trạng thái'}
                    ],
                    initialValue: fillEditData ? dataSource.State && `${dataSource.State.Value}` : '1'
                  })(
                    <EnumState/>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="Mã kho đối tác"
                >
                  {getFieldDecorator('Code', {
                    initialValue: fillEditData ? dataSource.Code : null
                  })(
                    <Input
                      size='default'
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="Tỉnh/Thành phố"
                >
                  {getFieldDecorator('CityID', {
                    rules: [
                      {required: true, message: 'Vui lòng chọn tỉnh thành'}
                    ],
                    initialValue: fillEditData ? ObjectPath.get(dataSource, 'City.ID') : `18`
                  })(
                    <City
                      onValueChange={this.myInventory.setCityID}
                      form={this.props.form}
                      resetFields={['DistrictID', 'WardID']}
                    />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="Quận/Huyện"
                >
                  {getFieldDecorator('DistrictID', {
                    rules: [
                      {required: true, message: 'Vui lòng chọn quận huyện'}
                    ],
                    initialValue: fillEditData ? ObjectPath.get(dataSource, 'District.ID') : null
                  })(
                    <District
                      onValueChange={this.myInventory.setDistrictID}
                      form={this.props.form}
                      resetFields={['WardID']}
                      CityID={this.myInventory.CityID}
                    />
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="Phường/Xã"
                >
                  {getFieldDecorator('WardID', {
                    rules: [
                      {required: true, message: 'Vui lòng chọn phường xã'}
                    ],
                    initialValue: fillEditData ? ObjectPath.get(dataSource, 'Ward.ID') : null
                  })(
                    <Ward
                      DistrictID={this.myInventory.DistrictID}
                      form={this.props.form}
                    />
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="Địa chỉ"
                >
                  {getFieldDecorator('Address', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập địa chỉ'}
                    ],
                    initialValue: fillEditData ? dataSource.Address : null
                  })(
                    <Input
                      size='default'
                      placeholder='Địa chỉ'
                    />
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="Kho mặc định"
                >
                  {getFieldDecorator('IsDefault', {
                    initialValue: fillEditData && dataSource.IsDefault,
                    valuePropName: 'checked'
                  })(
                    <Switch/>
                  )}
                </FormItem>
              </Col>

            </Row>
          </Form>
        }
      </Modal>
    )
  }

}