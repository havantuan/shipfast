import React, {Component} from 'react';
import ObjectPath from "object-path";
import {Button, Checkbox, Form, Icon, Input, Modal, Spin, Table, Tag, Tooltip} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import basicStyle from '../../../../config/basicStyle';
import City from "../../Common/Location/City";
import District from "../../Common/Location/District";
import Ward from "../../Common/Location/Ward";
import ConfirmTableControl from "../../Common/ConfirmStatus/ConfirmTableControl";
import EventAcceptStatuses from "../../Common/OrderProvider/OrderEventStatus/AcceptStatuses";
import PageLayout from "../../../../layouts/PageLayout";
import TotalRecord from "../../../../components/TotalRecord/index";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

import {ReProcessOrderStore} from "../../../../stores/orders/reProcessOrderStore";

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const eventCode = 499;

@Form.create()
@inject(Keys.me, Keys.detailOrder)
@observer
export default class ReDeliveryTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      CityID: null,
      DistrictID: null
    };
    this.reProcessOrder = new ReProcessOrderStore();
  }

  componentDidMount() {
    this.reProcessOrder.onFilter({
      EventStatusCode: eventCode,
      HubID: this.props.me.getCurrentHub()
    })
  }

  componentWillUnmount() {
    this.reProcessOrder.clear();
  }

  onCityIDChange = (CityID) => {
    this.setState({
      CityID: CityID
    });
  };

  onDistrictIDChange = (DistrictID) => {
    this.setState({
      DistrictID: DistrictID
    });
  };

  checkedChange = (e, index) => {
    this.reProcessOrder.checkedChange(e.target.value, index);
  };

  showModal = (data) => {
    this.reProcessOrder.showModal(data);
    this.setState({
      CityID: `${ObjectPath.get(data, "Receiver.City.ID", '')}`,
      DistrictID: `${ObjectPath.get(data, "Receiver.District.ID", '')}`,
    });
    this.props.form.setFieldsValue({
      "Address": ObjectPath.get(data, "Receiver.ToBeModifiedAddress", null),
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          Name,
          Phone,
          DistrictID,
          WardID,
          Address,
          Code
        } = values;
        let credentials = {
          ReceiverName: Name,
          ReceiverAddress: Address,
          ReceiverPhone: Phone,
          ReceiverDistrictID: DistrictID ? +DistrictID : null,
          ReceiverWardID: WardID ? +WardID : null
        };
        this.reProcessOrder.updateReceiver(Code, credentials);
      }
    });
  };

  handleCancel = () => {
    this.reProcessOrder.cancelModal();
    this.props.form.setFieldsValue({
      "Address": '',
    })
  };

  render() {
    const {dataSource, fetching, pagination, currentRow} = this.reProcessOrder;
    let counter = pagination.pageSize * (pagination.current - 1);
    const {textEdit} = basicStyle;
    const {getFieldDecorator} = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: {span: 6}
      },
      wrapperCol: {
        xs: {span: 18}
      }
    };

    const columns = [{
      title: '#',
      dataIndex: '',
      key: 'index',
      className: 'col-center',
      render: (text, record, index) => <span>{index + 1 + counter}</span>
    }, {
      title: 'Người nhận',
      dataIndex: 'Receiver',
      key: 'name',
      render: (text, record, index) =>
        <div>
          <p><Icon type="user"/> {text.Name}</p>
          <p><Icon type="phone"/> {text.Phone}</p>
        </div>
    }, {
      title: 'Địa chỉ phát',
      dataIndex: 'Receiver',
      key: 'receiverAddress',
      render: (text, record, index) =>
        <div>
          <div style={{textAlign: 'justify'}}>
            {
              text && text.Address &&
              <Tooltip title={text.Address}>
                <span>
                    <b>
                        <Icon type="environment"/>
                        Phát:&nbsp;
                    </b>
                  {text.Address}
                </span>

                <a href={`https://www.google.com/maps/place/${text.Address}`} target="_blank"
                   style={{marginLeft: '5px'}}>
                  <Icon type="global"/>
                </a>
              </Tooltip>
            }
          </div>
          <Tooltip title={`${ObjectPath.get(text, "Address")}`}>
            <p style={textEdit} onClick={() => this.showModal(record)}>
              <Icon type="edit"/> Thay đổi địa chỉ phát
            </p>
          </Tooltip>
        </div>
    }, {
      title: 'Số đơn',
      dataIndex: '',
      key: 'total',
      render: (text, record, index) => <span>1</span>
    }, {
      title: 'Đơn hàng',
      dataIndex: 'Code',
      key: 'order',
      render: (text, record, index) =>
        <Tag color={"blue"} onClick={(e) => this.props.detailOrder.showRootModal(record.Code)}>
          <span>{record.Code}</span>
        </Tag>
    }];

    return (
      <PageLayout>
        <ContentHolder>

          <ConfirmTableControl
            prefixFormID={'ReDelivery'}
            code={eventCode} // ReDelivery
            handleSubmit={this.reProcessOrder.onFilter}
            reProcessOrder={this.reProcessOrder}
          />

          <div className={"standardTable"}>
            <TotalRecord total={pagination.total} name={"địa chỉ phát"}/>
            <Modal
              title="Thay đổi địa chỉ phát"
              visible={this.reProcessOrder.isShowModal}
              // onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button
                  key="submit" type="primary" icon="check" onClick={this.handleSubmit}
                  loading={this.reProcessOrder.isUpdatingReceiver}
                >
                  Xác nhận
                </Button>,
                <Button key="back" icon="close" onClick={this.handleCancel}>Hủy bỏ</Button>,
              ]}
            >
              <Form>
                <FormItem
                  {...formItemLayout}
                  label='Mã đơn hàng'
                >
                  {getFieldDecorator('Code', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập mã đơn hàng'}
                    ],
                    initialValue: ObjectPath.get(currentRow, "Code")
                  })(
                    <Input
                      size='default'
                      disabled={true}
                    />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label='Tên người nhận'
                >
                  {getFieldDecorator('Name', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập tên người nhận'}
                    ],
                    initialValue: ObjectPath.get(currentRow, "Receiver.Name")
                  })(
                    <Input
                      size='default'
                    />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label='Số ĐT người nhận'
                >
                  {getFieldDecorator('Phone', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập số điện thoại người nhận'}
                    ],
                    initialValue: ObjectPath.get(currentRow, "Receiver.Phone")
                  })(
                    <Input
                      size='default'
                    />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label='Tỉnh/Thành Phố'
                >
                  {getFieldDecorator('CityID', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập tỉnh thành người nhận'}
                    ],
                    initialValue: ObjectPath.get(currentRow, "Receiver.City.ID")
                  })(
                    <City
                      onValueChange={this.onCityIDChange}
                      form={this.props.form}
                      resetFields={['DistrictID', 'WardID']}
                    />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label='Quận/Huyện'
                >
                  {getFieldDecorator('DistrictID', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập quận huyện nhận'}
                    ],
                    initialValue: ObjectPath.get(currentRow, "Receiver.District.ID")
                  })(
                    <District
                      onValueChange={this.onDistrictIDChange}
                      form={this.props.form}
                      CityID={`${this.state.CityID}`}
                      resetFields={['WardID']}
                    />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label='Phường/Xã'
                >
                  {getFieldDecorator('WardID', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập xã nhận'}
                    ],
                    initialValue: ObjectPath.get(currentRow, "Receiver.Ward.ID")
                  })(
                    <Ward
                      form={this.props.form}
                      DistrictID={this.state.DistrictID}
                    />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label='Địa chỉ'
                >
                  {getFieldDecorator('Address', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập địa chỉ người nhận'}
                    ],
                    initialValue: ObjectPath.get(currentRow, "Receiver.ToBeModifiedAddress")
                  })(
                    <TextArea autosize={false}/>
                  )}
                </FormItem>
              </Form>
            </Modal>

            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.Code}
                expandedRowRender={(record, index) => <NestedTable reProcessOrder={this.reProcessOrder} orderCode={record.Code} rowKey={index}/>}
                pagination={pagination}
                onChange={this.reProcessOrder.handleTableChange}
              />
            </Spin>
          </div>

        </ContentHolder>
      </PageLayout>
    )
  }

}
@inject(Keys.detailOrder)
@observer
class NestedTable extends Component {

  constructor(props) {
    super(props);
    this.reProcessOrder = props.reProcessOrder;
  }

  render() {
    let {orderCode, rowKey} = this.props;
    let {ordersChecked} = this.reProcessOrder;
    let dataSource = this.reProcessOrder.dataSource.filter(val => val.Code === orderCode);

    const columns = [{
      title: '#',
      dataIndex: '',
      key: 'key',
      className: 'col-center',
      render: (text, record, index) => <span>{index + 1}</span>
    }, {
      title: <span><Icon type="barcode"/> Mã đơn hàng</span>,
      dataIndex: '',
      key: 'order',
      render: (text, record, index) =>
        <div>
          <Tag color={"blue"} onClick={(e) => this.props.detailOrder.showRootModal(record.Code)}>
            <span>{record.Code}</span>
          </Tag>
          <p><b>Tạo: </b>{ObjectPath.get(record, "CreatedAt.Pretty")}</p>
        </div>
    }, {
      title: 'Người gửi',
      dataIndex: 'Sender',
      key: 'sender',
      render: (text, record, index) =>
        <div>
          <p><Icon type="user"/> {text && text.Name}</p>
          <p><Icon type="phone"/> {text && text.Phone}</p>
          <div style={{textAlign: 'justify'}}>
            {
              text && text.Address &&
              <Tooltip title={text.Address}>
                <span>
                    <b>
                        <Icon type="environment"/>
                        Thu:&nbsp;
                    </b>
                  {text.Address}
                </span>
                <a href={`https://www.google.com/maps/place/${text.Address}`} target="_blank"
                   style={{marginLeft: '5px'}}>
                  <Icon type="global"/>
                </a>
              </Tooltip>
            }
          </div>
        </div>
    }, {
      title: 'Trạng thái',
      dataIndex: '',
      key: 'status',
      render: (text, record, index) =>
        <div>
          <Tag color={`${ObjectPath.get(record, "StatusCode.Color")}`}>
            {ObjectPath.get(record, "StatusCode.Code")} - {ObjectPath.get(record, "StatusCode.Name")}
          </Tag>
          <p><b><Icon type="reload"/> Cập nhật: </b>{ObjectPath.get(record, "UpdatedAt.Pretty")}</p>
          <div>
            <b><Icon type="home"/> Dịch vụ: </b>
            <Tag color={"green"}>{ObjectPath.get(record, "ServiceType.Name")}</Tag>
          </div>
        </div>
    }, {
      title: 'Nhân viên',
      dataIndex: 'Staff',
      key: 'staff',
      render: (text, record, index) =>
        <div>
          <p><Icon type="user"/> {ObjectPath.get(text, "Name")}</p>
          <p><Icon type="phone"/> {ObjectPath.get(text, "Phone")}</p>
          <p><b><Icon type="edit"/> Lý do:</b></p>
        </div>
    }, {
      title:
        <EventAcceptStatuses
          code={eventCode}
          rows={1}
          counter={ordersChecked.find(val => val.id === rowKey) !== undefined ? 1 : 0}
          onChange={(statusCode) => this.reProcessOrder.handleUpdate(rowKey, statusCode)}
        />,
      key: 'action',
      className: 'col-center',
      render: (text, record, index) =>
        <Checkbox
          checked={ordersChecked.find(val => val.id === rowKey) !== undefined}
          onChange={() => this.reProcessOrder.checkedChange(record.Code, rowKey)}
          className={'custom-checkbox'}
        />
    }];

    return (
      <Table
        bordered
        dataSource={dataSource.slice()}
        columns={columns}
        pagination={false}
        rowKey={record => record.Code}
      />
    );
  }

}