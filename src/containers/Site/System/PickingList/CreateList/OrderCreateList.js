import React, {Component} from 'react';
import ObjectPath from "object-path";
import {Button, Col, Form, Input, Row, Spin, Table, Tag} from 'antd';
import basicStyle from '../../../../../config/basicStyle';
import {numberFormat} from "../../../../../helpers/utility";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../stores/index";

const FormItem = Form.Item;
const formItem = {marginBottom: '12px'};

const customizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onFormChange(props.id, changedFields)
  },
  mapPropsToFields(props) {
    return {
      OrderCode: Form.createFormField({
        ...props.OrderCode,
        value: ObjectPath.get(props, "OrderCode.value"),
      }),
    };
  },
  onValuesChange(_, values) {
    // console.log("onValuesChange", values);
  },
});

@customizedForm
@inject(Keys.createPickingList, Keys.me, Keys.detailOrder)
@observer
export default class OrderCreateList extends Component {

  constructor(props) {
    super(props);
    this.createPickingList = props.createPickingList;
  }

  onKeyDown = (e) => {
    // 9 - Tab
    // 13 - Enter
    let scannerKey = this.props.me.scannerKey();
    if (e.which === scannerKey && scannerKey !== 13) {
      this.getOrder();
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.getOrder();
  };

  getOrder = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          OrderCode
        } = values;
        this.createPickingList.addOrder(this.props.id, OrderCode);
        this.props.form.resetFields(["OrderCode"]);
      }
    });
  };

  render() {
    const {gutter, redBg} = basicStyle;
    const {getFieldDecorator} = this.props.form;
    const {id, dataSource = []} = this.props;
    const {isFetchingCurrentRow} = this.createPickingList;

    const columns = [{
      title: '#',
      dataIndex: '',
      key: 'index',
      className: 'col-center',
      render: (text, record, index) => <span>{index + 1}</span>
    }, {
      title: 'Mã đơn hàng',
      dataIndex: 'Code',
      key: 'orderCode',
      render: (text, record, index) =>
        <Tag color="purple" onClick={this.props.detailOrder.onShowRootModal(text)}>{text}</Tag>
    }, {
      title: 'Sản phẩm',
      dataIndex: 'Name',
      key: 'product',
      render: (text, record, index) => <span>{text}</span>
    }, {
      title: 'Dịch vụ',
      dataIndex: 'ServiceType',
      key: 'vas',
      render: (text, record, index) => <span>{text && text.Name}</span>
      // }, {
      //     title: 'Tuyến',
      //     dataIndex: '',
      //     key: 'route',
    }, {
      title: 'Điểm thu',
      dataIndex: 'Sender',
      key: 'senderHub',
      render: (text, record, index) => <span>{ObjectPath.get(text, "Hub.DisplayName")}</span>
    }, {
      title: 'Điểm phát',
      dataIndex: 'Receiver',
      key: 'receiverHub',
      render: (text, record, index) => <span>{ObjectPath.get(text, "Hub.DisplayName")}</span>
    }, {
      title: 'Khối lượng (Kg)',
      dataIndex: 'NetWeight',
      key: 'weight',
      render: (text, record, index) => <span>{text || '0'}</span>
    }, {
      title: 'Phí',
      dataIndex: '',
      key: 'cost',
      render: (text, record, index) =>
        <div>
          <div>
            COD:&nbsp;<b>{numberFormat(ObjectPath.get(record, "Cod", 0))}&nbsp;đ</b>
          </div>
          <div>
            Tổng cước:&nbsp;<b>{numberFormat(ObjectPath.get(record, "TotalCost", 0))}&nbsp;đ</b>
          </div>
          <div>
            Thu hộ:&nbsp;<b>{numberFormat(ObjectPath.get(record, "Receiver.AccountReceivable", 0))}&nbsp;đ</b>
          </div>
          <div>
            Thanh toán:&nbsp;{ObjectPath.get(record, "PaymentType.Name")}
          </div>
        </div>
    }, {
      title: 'Hành động',
      dataIndex: '',
      key: 'action',
      render: (text, record, index) =>
        <Button
          icon="close"
          style={redBg}
          size="small"
          onClick={() => this.createPickingList.removeOrder(id, record.Code)}
        >
          Bỏ chọn
        </Button>
    }];

    return (
      <div>
        <Form onSubmit={this.handleSubmit} onKeyDown={this.onKeyDown}>
          <Row gutter={gutter} justify="start">
            <Col md={6} sm={12} xs={24}>
              <FormItem style={formItem}>
                {getFieldDecorator(`OrderCode`, {
                  rules: [
                    {required: true, message: 'Vui lòng nhập mã đơn hàng/ kiện'}
                  ]
                })(
                  <Input
                    placeholder="Mã đơn hàng/ kiện"
                    size="default"
                  />
                )}
              </FormItem>
            </Col>

            <Col md={3} sm={12} xs={24}>
              <Button
                type="primary"
                htmlType="submit"
                icon="plus"
              >
                Thêm đơn hàng
              </Button>
            </Col>
          </Row>
        </Form>

        <p style={{marginBottom: '5px'}}>Tổng&nbsp;<b>{dataSource ? dataSource.length : 0}</b>&nbsp;kiện</p>

        <Spin spinning={isFetchingCurrentRow}>
          <Table
            bordered
            dataSource={dataSource.slice()}
            columns={columns}
            rowKey={record => record.Code}
            pagination={false}
          />
        </Spin>
      </div>
    )
  }

}