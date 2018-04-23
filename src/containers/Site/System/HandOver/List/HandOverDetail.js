import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Card, Col, Row, Spin, Table, Tag} from 'antd';
import LayoutWrapper from '../../../../../components/utility/layoutWrapper';
import basicStyle from '../../../../../config/basicStyle';
import './css/Style.css';
import routerConfig from "../../../../../config/router";
import ObjectPath from "object-path";
import {numberFormat} from "../../../../../helpers/utility";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../../stores/index';
@inject(Keys.router, Keys.handerOverDetail, Keys.detailOrder)
@withRouter
@observer
export default class HandOverDetail extends Component {

  redirectToPrint = () => {
    window.open(routerConfig.printList.replace(":code", this.code));
  };

  constructor(props) {
    super(props);
    this.code = this.props.match.params.code
  }

  componentWillUnmount(){
    this.props.handerOverDetail.clear();
  }
  componentDidMount() {
    this.props.handerOverDetail.fetchByID(this.code);
  }
  render() {
    const {rowStyle, colStyle, gutter} = basicStyle;
    let {dataSource, fetching} = this.props.handerOverDetail;

    let columns = [
      {
        title: 'Mã đơn hàng',
        dataIndex: 'Code',
        key: 'Code',
        render: (text, record, index) =>
          <Tag color={"blue"} onClick={(e) => this.props.detailOrder.showRootModal(record.Order.Code)}>
            <span>{record.Order.Code}</span>
          </Tag>
      }, {
        title: 'Trạng thái',
        dataIndex: 'Order',
        key: 'status',
        render: (text, record, index) =>
          <div>
            <Tag color={ObjectPath.get(record.Order, "StatusCode.Color")}>
              {ObjectPath.get(record.Order, "StatusCode.Code")}
              - {ObjectPath.get(record.Order, "StatusCode.Name")}
            </Tag>
            <p>Ghi chú: {ObjectPath.get(record.Order, "DeliveryNote")}</p>
            <p>Cod: {numberFormat(ObjectPath.get(record.Order, "Cod"))}</p>
            <p>{(ObjectPath.get(record.Order, "CanCheck.Name"))}</p>
          </div>
      }, {
        title: 'Tên sản phẩm',
        dataIndex: 'Order',
        key: 'name',
        render: (text, record, index) => <span>{ObjectPath.get(record.Order, "Name")}</span>
      }, {
        title: 'Dịch vụ',
        dataIndex: 'Order',
        key: 'ServiceType',
        render: (text, record, index) => <div>
          <p>Dịch vụ: {ObjectPath.get(record.Order, "ServiceType.Name")}</p>
          <p>Người trả: {ObjectPath.get(record.Order, "PaymentType.Name")}</p>
          <p>Tổng tiền: {numberFormat(ObjectPath.get(record.Order, "TotalCost"))} đ</p>
        </div>
      }, {
        title: '',
        dataIndex: 'Order',
        key: 'quantity',
        render: (text, record, index) => <div>
          <p>Khối lượng: {ObjectPath.get(text, "NetWeight", "0")} Kg</p>
          <p>Chiều rộng: {ObjectPath.get(text, "Width", "0")} Kg</p>
          <p>Chiều dài: {ObjectPath.get(text, "Length", "0")} Kg</p>
          <p>Chiều cao: {ObjectPath.get(text, "Height", "0")} Kg</p>
        </div>
      }];

    return (
      <LayoutWrapper>
        <div className={"detail-header"}>
          <h1>Chi tiết bàn giao</h1>
        </div>
        <Row style={{...rowStyle, marginRight: 0}} gutter={gutter} justify="start">
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <div>
              <Card title={"Chi tiết"}>
                <Spin spinning={fetching || false}>
                  <Row justify={"start"} type={"flex"} align={"top"}>
                    <Col sm={12} xs={24}>
                      <div className={"pickingList-detail"}>
                        <div className={"row-detail"}>
                          <div>Mã bàn giao</div>
                          <div>
                            <Tag color={"purple"}>{ObjectPath.get(dataSource, "Code")}</Tag>
                          </div>
                        </div>
                        <div className={"row-detail"}>
                          <div>Người giao việc</div>
                          <div>
                            {`${ObjectPath.get(dataSource, "AssignStaff.Name")}`}
                          </div>
                        </div>
                        <div className={"row-detail"}>
                          <div>Tiền phải thu</div>
                          <div>
                            {numberFormat(ObjectPath.get(dataSource, "AccountReceivables"))}
                            đ
                          </div>
                        </div>
                        <div className={"row-detail"}>
                          <div>Phát</div>
                          <div>
                            {ObjectPath.get(dataSource, "Deliveries")}
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} xs={24}>
                      <div className={"pickingList-detail"}>
                        <div className={"row-detail"}>
                          <div>Điểm thu</div>
                          <div>
                            {ObjectPath.get(dataSource, "Hub.DisplayName")}
                          </div>
                        </div>
                        <div className={"row-detail"}>
                          <div>Nhân viên</div>
                          <div>
                            {ObjectPath.get(dataSource, "Staff.Name")}
                          </div>
                        </div>
                        <div className={"row-detail"}>
                          <div>Thu</div>
                          <div>
                            {ObjectPath.get(dataSource, "Pickups")}
                          </div>
                        </div>
                        <div className={"row-detail"}>
                          <div>Ngày tạo</div>
                          <div>
                            {ObjectPath.get(dataSource, "CreatedAt.Pretty")}
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Spin>
              </Card>
            </div>

            <div style={{marginTop: 20}}>
              <Card title={"Danh sách đơn hàng"}>
                <div style={{backgroundColor: "#FFFFFF"}}>
                  <Spin spinning={fetching || false}>
                    <Table
                      bordered={true}
                      dataSource={(dataSource && dataSource.Entries) ? dataSource.Entries.slice() : []}
                      columns={columns}
                      rowKey={record => ObjectPath.get(record, "Order.Code", 0)}
                      pagination={false}
                    />
                  </Spin>
                </div>
              </Card>
            </div>

          </Col>
        </Row>
      </LayoutWrapper>
    )
  }

}

