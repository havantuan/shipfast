import React, {Component} from 'react';
import ObjectPath from "object-path";

import {Button, Col, Form, Input, Modal, Row, Spin, Switch} from 'antd';
import basicStyle from '../../../../config/basicStyle';
import City from '../../Common/Location/City';
import District from '../../Common/Location/District';
import Ward from '../../Common/Location/Ward';
import HubTypes from '../../Common/EnumProvider/hubType';
import AutoCompleteAddress from "../../Common/Location/AutoCompleteAddress";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';

const FormItem = Form.Item;

@Form.create()
@inject(Keys.hubTable)
@observer
export default class HubForm extends Component {

  setLocation = (lat, lng) => {
    this.props.form.setFieldsValue({"Lat": lat, "Lng": lng});
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        let {
          Address,
          CloudPrintID,
          Code,
          Name,
          CityID,
          DistrictID,
          WardID,
          Phone,
          Lng,
          Lat,
          Type,
          Accessibility
        } = values;

        let credentials = {
          Address,
          CloudPrintID,
          Code,
          Name,
          CityID: +CityID,
          DistrictID: +DistrictID,
          WardID: +WardID,
          Phone,
          Lng: +Lng,
          Lat: +Lat,
          Type,
          Accessibility: Accessibility === true ? 1 : 2
        };

        this.props.hubTable.onSubmitFormModal(credentials).then(() => {
          this.props.form.resetFields();
        });
      }
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      location: {}
    };
  }


  render() {
    let {currentRow, isUpdateMode} = this.props.hubTable;

    const {gutter, rowStyle} = basicStyle;
    const {getFieldDecorator} = this.props.form;
    let loading = this.props.hubTable.isUpdating || this.props.hubTable.isCreating;
    let fetching = this.props.hubTable.isFetchingCurrentRow;
    let dataSource = currentRow;
    let fillEditData = isUpdateMode;
    return (
      <Modal
        title={`${isUpdateMode ? 'Cập nhật điểm gửi hạng' : 'Tạo điểm gửi hàng'}`}
        visible={this.props.hubTable.isShowModal}
        onOk={this.handleSubmit}
        width='70%'
        onCancel={this.props.hubTable.onCancelModal}
        footer={[
          <Button key="cancel" onClick={this.props.hubTable.onCancelModal}>
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
              <Col md={12} sm={12} xs={12}>
                <FormItem>
                  {getFieldDecorator('Code', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập mã điểm gửi hàng'}
                    ],
                    initialValue: fillEditData ? dataSource.Code : null
                  })(
                    <Input
                      placeholder="Mã điểm gửi hàng"
                      size="default"
                    />
                  )}
                </FormItem>

                <FormItem>
                  {getFieldDecorator('Name', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập tên điểm gửi hàng'}
                    ],
                    initialValue: fillEditData ? dataSource.Name : null
                  })(
                    <Input
                      placeholder="Tên điểm gửi hàng"
                      size="default"
                    />
                  )}
                </FormItem>

                <FormItem>
                  {getFieldDecorator('Type', {
                    rules: [
                      {required: true, message: 'Vui lòng chọn loại dịch vụ'}
                    ],
                    initialValue: fillEditData ? ObjectPath.get(dataSource, "Type.Code") : null
                  })(
                    <HubTypes
                      placeholder={'Loại dịch vụ'}
                      valueByCode={true}
                    />
                  )}
                </FormItem>

                <FormItem>
                  {getFieldDecorator('Phone', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập số điện thoại'}
                    ],
                    initialValue: fillEditData ? dataSource.Phone : null
                  })(
                    <Input
                      placeholder="Số điện thoại"
                      size="default"
                    />
                  )}
                </FormItem>

                <FormItem>
                  {getFieldDecorator('CloudPrintID', {
                    initialValue: fillEditData ? dataSource.CloudPrintID : null
                  })(
                    <Input
                      placeholder="ID máy in"
                      size="default"
                    />
                  )}
                </FormItem>


              </Col>

              <Col md={12} sm={12} xs={12}>
                <FormItem>
                  {getFieldDecorator('CityID', {
                    rules: [
                      {required: true, message: 'Vui lòng chọn tỉnh thành'}
                    ],
                    initialValue: fillEditData ? dataSource.City && `${dataSource.City.ID}` : null
                  })(
                    <City
                      onValueChange={this.props.hubTable.setCityIDForm}
                      form={this.props.form}
                      resetFields={['DistrictID', 'WardID']}
                    />
                  )}
                </FormItem>

                <FormItem
                >
                  {getFieldDecorator('DistrictID', {
                    rules: [
                      {required: true, message: 'Vui lòng chọn quận huyện'}
                    ],
                    initialValue: fillEditData ? dataSource.District && `${dataSource.District.ID}` : null
                  })(
                    <District
                      onValueChange={this.props.hubTable.setDistrictIDForm}
                      form={this.props.form}
                      resetFields={['WardID']}
                      CityID={this.props.hubTable.CityIDForm}
                    />
                  )}
                </FormItem>

                <FormItem
                >
                  {getFieldDecorator('WardID', {
                    rules: [
                      {required: true, message: 'Vui lòng chọn phường xã'}
                    ],
                    initialValue: fillEditData ? dataSource.Ward && `${dataSource.Ward.ID}` : null
                  })(
                    <Ward
                      DistrictID={this.props.hubTable.DistrictIDForm}
                      form={this.props.form}
                    />
                  )}
                </FormItem>

                <FormItem>
                  {getFieldDecorator('Address', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập Địa chỉ'}
                    ],
                    initialValue: fillEditData ? dataSource.Address : null
                  })(
                    <AutoCompleteAddress
                      customStyle={{height: '90px'}}
                      placeholder="Địa chỉ"
                      form={this.props.form}
                      field="Address"
                      address={fillEditData ? dataSource.Address : null}
                      setLocation={this.setLocation}
                    />
                  )}
                </FormItem>


              </Col>
            </Row>
            <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={6} sm={6} xs={12}>
                <FormItem>
                  {getFieldDecorator('Lat', {
                    rules: [
                      {required: false, message: 'Vui lòng nhập Địa chỉ'}
                    ],
                    initialValue: fillEditData ? dataSource.Lat : ObjectPath.get(this.state.location, "lat")
                  })(
                    <Input placeholder="Lat"/>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={6} xs={12}>
                <FormItem>
                  {getFieldDecorator('Lng', {
                    rules: [
                      {required: false, message: 'Vui lòng nhập Địa chỉ'}
                    ],
                    initialValue: fillEditData ? dataSource.Lng : ObjectPath.get(this.state.location, "lng")
                  })(
                    <Input placeholder="Lng"/>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={6} xs={12}>
                <FormItem>
                  {getFieldDecorator('Accessibility', {
                    initialValue: !!(fillEditData && dataSource.Accessibility && ObjectPath.get(dataSource.Accessibility, "Value") === 1),
                    valuePropName: 'checked'
                  })(
                    <Switch checkedChildren="Công khai" unCheckedChildren="Bí mật"/>
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

// const mapStateToProps = state => {
//   return singleHub.mapState(state);
// };
//
// const mapDispatchToProps = dispatch => {
//   return {
//     createHub: (credentials) => dispatch(createHub.request(credentials)),
//     getDataSource: (id) => dispatch(singleHub.request(id)),
//     clear: () => dispatch(singleHub.clear()),
//     updateHub: (id, credentials) => dispatch(updateHub.request(id, credentials))
//   }
// };
//
// HubForm.propTypes = propTypes;
// HubForm.defaultProps = defaultProps;
//
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Form.create()(withRouter(HubForm)));
