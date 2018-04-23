import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Card, Col, Form, Icon, Input, message, Popconfirm, Row, Spin, Table, Tag} from "antd";
import ObjectPath from "object-path";
import basicStyle from "../../../../../config/basicStyle";
import ReceiveListTableControl from "./ReceiveListTableControl";
import {checkExist} from "../../../../../helpers/utility";
import "../Style.css";
import PageHeaderLayout from "../../../../../layouts/PageHeaderLayout";
import ContentHolder from "../../../../../components/utility/ContentHolder";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../stores/index";

@Form.create()
@withRouter
@inject(Keys.receivePickingList, Keys.me, Keys.detailOrder, Keys.detailOrder)
@observer
export default class ReceiveListTable extends Component {

  constructor(props) {
    super(props);
    this.receivePickingList = props.receivePickingList;
  }

  componentDidMount() {
    let code = ObjectPath.get(this.props, "match.params.code", null);
    if (code) {
      this.receivePickingList.setPickingListCode(code);
    }
  }

  componentWillUnmount() {
    this.receivePickingList.clear();
  }

  onKeyDown = (e) => {
    // 9 - Tab
    // 13 - Enter
    let scannerKey = this.props.me.scannerKey();
    if (e.which === scannerKey && scannerKey !== 13) {
      this.receiveOrder();
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.receiveOrder();
  };

  receiveOrder = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          OrderCode
        } = values;
        OrderCode = OrderCode && OrderCode.trim();
        if (checkExist(this.receivePickingList.codes.slice(), OrderCode)) {
          this.receivePickingList.receive(OrderCode);
        }
        else {
          message.error('Nhận đơn hàng thất bại');
        }
        this.props.form.resetFields(["OrderCode"]);
      }
    });
  };

  handleLost = (orderCodes) => {
    this.receivePickingList.reportLostPickingListOrders({OrderCodes: [orderCodes]});
  };

  render() {
    const {rowStyle, colStyle, gutter, redBg, greenBg} = basicStyle;
    const {getFieldDecorator} = this.props.form;
    const {dataSource, currentRow, fetching, dataTable, receiveCodes, codes, isFetchingOrder} = this.receivePickingList;

    const columns = [{
      title: '#',
      dataIndex: '',
      key: 'index',
      className: 'col-center',
      render: (text, record, index) => <span>{index + 1}</span>
    }, {
      title: 'Mã đơn hàng',
      dataIndex: 'Code',
      key: 'code',
      render: (text, record, index) =>
        <Tag color="purple" onClick={this.props.detailOrder.onShowRootModal(text)}>{text}</Tag>
    }, {
      title: 'Trạng thái',
      dataIndex: 'StatusCode',
      key: 'status',
      render: (text, record, index) => <Tag color={text && text.Color}>{text && text.Name}</Tag>
    }, {
      title: 'Tên sản phẩm',
      dataIndex: 'Name',
      key: 'name',
      render: (text, record, index) => <span>{text}</span>
    }, {
      title: 'Dịch vụ',
      dataIndex: 'ServiceType',
      key: 'serviceType',
      render: (text, record, index) => <span>{text && text.Name}</span>
      // }, {
      //   title: 'Số lượng',
      //   dataIndex: 'Quantity',
      //   key: 'quantity',
      //   render: (text, record, index) => <span>{text || '0'}</span>
    }, {
      title: 'Khối lượng (Kg)',
      dataIndex: 'NetWeight',
      key: 'weight',
      render: (text, record, index) => <span>{text || '0'}</span>
    }, {
      title: 'Hành động',
      dataIndex: '',
      key: 'action',
      render: (text, record, index) =>
        <Button
          icon="close"
          size="small"
          style={redBg}
          onClick={() => this.receivePickingList.remove(record.Code)}
        >
          Bỏ chọn
        </Button>
    }];

    return (
      <PageHeaderLayout
        title={'Nhận bảng kê'}
      >
        <ContentHolder>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={6} sm={24} xs={24} style={colStyle}>
              <ReceiveListTableControl/>
            </Col>

            <Col md={12} sm={24} xs={24}>
              <Form onSubmit={this.handleSubmit} onKeyDown={this.onKeyDown}>
                <Row gutter={gutter}>
                  <Col md={15} sm={12} xs={24} style={colStyle}>
                    {getFieldDecorator('OrderCode', {
                      rules: [
                        {required: true, message: 'Vui lòng nhập mã đơn hàng!'}
                      ]
                    })(
                      <Input placeholder="Mã đơn hàng"/>
                    )}
                  </Col>

                  <Col md={5} sm={12} xs={24} style={colStyle}>
                    <Button
                      htmlType="submit"
                      type="primary"
                      icon="select"
                      disabled={!(codes.length > 0)}
                    >
                      Nhận
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
          {
            currentRow &&
            <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={6} sm={6} xs={8} style={colStyle}>
                <Spin spinning={fetching}>
                  {
                    codes.length > 0 ?
                      <div>
                        <div style={{lineHeight: '48px'}}>
                          Có {`${codes.length}`} đơn hàng cần nhận
                        </div>
                        <Card bodyStyle={{padding: '0 0 0 12px'}}>
                          {
                            codes.map((val, index) =>
                              <div className="row-flex" key={index}>
                                <div className="flex-left">
                                  <Tag color="purple" onClick={this.props.detailOrder.onShowRootModal(val)}>
                                    {val}
                                  </Tag>
                                </div>

                                <div className="flex-right">
                                  <Tag
                                    color="#87d068"
                                    onClick={() => this.receivePickingList.receive(val)}
                                  >
                                    <Icon type="check-circle-o"/>&nbsp;Nhận
                                  </Tag>

                                  <Popconfirm
                                    title={`Báo thất lạc cho đơn hàng ${val}?`}
                                    onConfirm={() => this.handleLost(val)}
                                    okText="Đồng ý"
                                    cancelText="Bỏ qua"
                                  >
                                    <Tag color="#e82020">
                                      <Icon type="compass"/>&nbsp;Thất lạc
                                    </Tag>
                                  </Popconfirm>
                                </div>
                              </div>
                            )
                          }
                        </Card>
                      </div>
                      :
                      <p>Tất cả đơn hàng đã được quét</p>
                  }
                </Spin>
              </Col>

              <Col md={18} sm={16} xs={16} style={colStyle}>
                <div style={{marginBottom: '15px'}}>
                  <Spin spinning={fetching}>
                    <Card
                      title={
                        <span>
                            <Icon type="info-circle-o"/> Thông tin bảng kê
                        </span>
                      }
                      bodyStyle={{padding: '0'}}
                    >
                      <div className="inline-main">
                        <div className="inline-row">
                          <div>
                            <span className="font-bold">Điểm thu: </span>
                            <span>{ObjectPath.get(currentRow, "SourceHub.DisplayName")}</span>
                          </div>
                          <div>
                            <span className="font-bold">Điểm phát: </span>
                            <span>{ObjectPath.get(currentRow, "DestinationHub.DisplayName")}</span>
                          </div>
                        </div>
                        <div className="inline-row">
                          <div>
                            <span className="font-bold">Trạng thái: </span>
                            <Tag
                              color={ObjectPath.get(currentRow, "Status.Color")}>{ObjectPath.get(currentRow, "Status.Code")}
                              - {ObjectPath.get(currentRow, "Status.Name")}</Tag>
                          </div>
                          <div>
                            <span className="font-bold">Khối lượng: </span>
                            <span>{ObjectPath.get(currentRow, "Weight")} kg</span>
                          </div>
                        </div>
                        <div className="inline-row">
                          <div>
                            <span className="font-bold">Số đơn hàng: </span>
                            <span>{receiveCodes && receiveCodes.length}/{dataSource && dataSource.length}</span>
                          </div>
                          <div>
                            <span className="font-bold">Tạo: </span>
                            <span>{ObjectPath.get(currentRow, "CreatedAt.Pretty")}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Spin>
                </div>

                <Spin spinning={isFetchingOrder}>
                  <Table
                    bordered
                    className="receive-list-table"
                    columns={columns}
                    pagination={false}
                    rowKey={record => record.Code}
                    dataSource={dataTable.slice()}
                  />
                  {
                    receiveCodes.length > 0 &&
                    <div style={{textAlign: 'right', marginTop: '15px'}}>
                      <Button
                        loading={this.receivePickingList.isConfirming}
                        style={greenBg}
                        icon="check-circle-o"
                        onClick={this.receivePickingList.confirmPickingListOrders}
                      >
                        Xác nhận nhận bảng kê
                      </Button>
                    </div>
                  }
                </Spin>
              </Col>
            </Row>
          }
        </ContentHolder>
      </PageHeaderLayout>
    )
  }
}