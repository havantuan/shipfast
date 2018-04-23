import React, {Component} from 'react';
import {Button, Form, Icon, Input, Modal, Popconfirm, Spin, Table, Tag} from 'antd';
import ContentHolder from '../../../../../components/utility/ContentHolder';
import basicStyle from '../../../../../config/basicStyle';
import City from "../../../Common/Location/City";
import District from "../../../Common/Location/District";
import Ward from "../../../Common/Location/Ward";
import OrderWattingTableControl from "./OrderWattingTableControl";
import ObjectPath from "object-path";
import TotalRecord from '../../../../../components/TotalRecord/index';
import PageHeaderLayout from '../../../../../layouts/PageHeaderLayout';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../stores/index";
import StatusTag from "../../../Common/StatusTag/StatusTag";
import StatusToolTip from '../../../Common/StatusToolTip/StatusToolTip';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

@Form.create()
@inject(Keys.wattingOrder, Keys.detailOrder)
@observer
export default class OrderWattingTable extends Component {

  handleLost = (code) => {
    this.props.wattingOrder.updateOrderStatus(code, 890);
  };
  showModal = (data) => {
    this.props.wattingOrder.showModal(data);
    this.setState({
      CityID: `${ObjectPath.get(data, "Receiver.City.ID", '')}`,
      DistrictID: `${ObjectPath.get(data, "Receiver.District.ID", '')}`,
    });
    this.props.form.setFieldsValue({
      "Address": ObjectPath.get(data, "Receiver.ToBeModifiedAddress", null),
    });
  };
  onCityIDChange = (CityID) => {
    this.setState({
      CityID: CityID,
    });
  }
  onDistrictIDChange = (DistrictID) => {
    this.setState({
      DistrictID: DistrictID,
    })
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
        this.props.wattingOrder.updateReceiver(Code, credentials);
      }
    });
  };
  handleCancel = () => {
    this.props.wattingOrder.cancelModal();
    this.props.form.setFieldsValue({
      "Address": '',
    })
  };

  constructor() {
    super();
    this.state = {
      modal: {
        visible: false,
        index: null,
        data: {}
      }
    };
  }

  componentDidMount() {
    this.props.wattingOrder.reload();
  }

  componentWillUnmount() {
    this.props.wattingOrder.clear();
  }

  render() {
    const {textEdit} = basicStyle;
    let {dataSource, fetching, pagination, currentRow} = this.props.wattingOrder;
    let counter = pagination.pageSize * (pagination.current - 1);
    const {getFieldDecorator} = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: {span: 8}
      },
      wrapperCol: {
        xs: {span: 16}
      }
    };

    let columns = [{
      title: 'STT',
      dataIndex: 'ID',
      key: 'stt',
      render: (text, record, index) => <span>{index + 1 + counter}</span>
    }, {
      title: 'Mã đơn hàng',
      dataIndex: 'Code',
      key: 'Code',
      render: (text, record, index) =>
        <div className={'tagList'}>
          <Tag
            color="#19a9d5"
            onClick={this.props.detailOrder.onShowRootModal(record.Code)}
          >
            {ObjectPath.get(record, "Code")}
          </Tag>
          <div>
            <StatusTag value={ObjectPath.get(record, 'StatusCode')}/>
          </div>
        </div>
    }, {
      title: 'Dịch vụ',
      dataIndex: 'ServiceType',
      key: 'ServiceType',
      render: (text, record, index) => <span>{ObjectPath.get(record.ServiceType, "Name")}</span>
    }, {
      title: 'Điểm thu',
      dataIndex: 'Sender',
      key: 'sender',
      width: '30%',
      render: (text, record, index) => (
        <div>
          {
            ObjectPath.get(text, "Hub") &&
            <div className={'tagList'}>
              <StatusToolTip value={ObjectPath.get(text, "Hub")}/>
            </div>
          }
          <p>
            <Icon type="environment"/>
            <span className="font-bold">Thu: </span> {ObjectPath.get(text, 'Address')}
            {
              ObjectPath.get(text, 'Address') &&
              <a href={`https://www.google.com/maps/place/${text.Address}`} target="_blank"
                 style={{marginLeft: '5px'}}>
                <Icon type="global"/>
              </a>
            }
          </p>
        </div>
      )
    }, {
      title: 'Điểm phát',
      dataIndex: 'Receiver',
      key: 'Receiver',
      width: '30%',
      render: (text, record, index) => (
        <div>
          {
            ObjectPath.get(text, "Hub") &&
            <div className={'tagList'}>
              <StatusToolTip value={ObjectPath.get(text, "Hub")}/>
            </div>
          }
          <p>
            <Icon type="environment"/>
            <span className="font-bold">Phát: </span> {ObjectPath.get(text, 'Address')}
            {
              ObjectPath.get(text, 'Address') &&
              <a href={`https://www.google.com/maps/place/${text.Address}`} target="_blank"
                 style={{marginLeft: '5px'}}>
                <Icon type="global"/>
              </a>
            }
          </p>
          <p style={textEdit} onClick={() => this.showModal(record)}><Icon type="edit"/> Thay đổi địa chỉ
            phát</p>
        </div>
      )
    }, {
      title: 'Ngày Tạo',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
      render: (text, record, index) => <div>
        {ObjectPath.get(record, 'CreatedAt.Pretty')}
      </div>,
    }
      , {
        title: 'Hành động',
        dataIndex: '',
        key: 'action',
        render: (text, record, index) =>
          <div>
            <Popconfirm
              title={`Bạn có chắc chắn cập nhật trạng thái mất hàng cho đơn hàng ?`}
              onConfirm={() => this.handleLost(ObjectPath.get(record, "Code"))}
              okText="Đồng ý"
              cancelText="Bỏ qua"
            >
              <Tag color="#e82020">
                <Icon type="compass"/>&nbsp;Thất lạc
              </Tag>
            </Popconfirm>
          </div>
      }];

    return (
      <PageHeaderLayout title="Danh sách chờ đóng bảng kê">
        <ContentHolder>
          <OrderWattingTableControl/>

          <Modal
            title="Thay đổi địa chỉ phát"
            visible={this.props.wattingOrder.isShowModal}
            // onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              <Button
                key="submit" type="primary" icon="check"
                loading={this.props.wattingOrder.isUpdatingReceiver}
                onClick={this.handleSubmit}>
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
          <div style={{marginTop: 20}} className={"standardTable"}>
            <TotalRecord total={pagination.total} name={"bảng kê"}/>
            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.Code}
                pagination={pagination}
                onChange={this.props.wattingOrder.handleTableChange}
              />
            </Spin>
          </div>

        </ContentHolder>

      </PageHeaderLayout>
    )
  }

}


