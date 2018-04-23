import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import ObjectPath from "object-path";
import {Button, Card, Col, Row, Spin, Table, Tag} from 'antd';
import LayoutWrapper from '../../../../components/utility/layoutWrapper';
import basicStyle from '../../../../config/basicStyle';
import routerConfig from "../../../../config/router";
import "./Style.css";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

@withRouter
@inject(Keys.pickingList,Keys.detailOrder)
@observer
export default class ListTable extends Component {

  constructor(props) {
    super(props);
    this.code = props.match.params.code;
  }

  componentDidMount() {
    this.props.pickingList.fetchByCode(this.code);
  }

  redirectToPrint = () => {
    window.open(routerConfig.printList.replace(":code", this.code));
  };

  render() {
    const {rowStyle, colStyle, gutter, orangeButton} = basicStyle;
    let {currentRow: dataSource, isFetchingCurrentRow: fetching} = this.props.pickingList;

    let columns = [{
      title: '#',
      dataIndex: '',
      key: 'index',
      render: (text, record, index) => <span>{index + 1}</span>
    }, {
      title: 'Mã đơn hàng',
      dataIndex: 'Order',
      key: 'code',
      render: (text, record, index) =>

          <Tag color={"purple"} onClick={this.props.detailOrder.onShowRootModal(text && text.Code)}>{text && text.Code}</Tag>
    }, {
      title: 'Trạng thái',
      dataIndex: 'Order',
      key: 'status',
      render: (text, record, index) =>
        <Tag color={ObjectPath.get(text, "StatusCode.Color")}>
          {ObjectPath.get(text, "StatusCode.Code")} - {ObjectPath.get(text, "StatusCode.Name")}
        </Tag>
    }, {
      title: 'Trạng thái trong bảng kê',
      dataIndex: 'Status',
      key: 'statusPickingList',
      render: (text, record, index) =>
        <Tag color={ObjectPath.get(text, "Color")}>
          {ObjectPath.get(text, "Code")} - {ObjectPath.get(text, "Name")}
        </Tag>
    }, {
      title: 'Tên sản phẩm',
      dataIndex: 'Order',
      key: 'name',
      render: (text, record, index) => <span>{ObjectPath.get(text, "Name")}</span>
    }, {
      title: 'Dịch vụ',
      dataIndex: 'Order',
      key: 'ServiceType',
      render: (text, record, index) => <span>{ObjectPath.get(text, "ServiceType.Name")}</span>
    }, {
    //   title: 'Số lượng',
    //   dataIndex: 'Order',
    //   key: 'quantity',
    //   render: (text, record, index) => <span>{ObjectPath.get(text, "Quantity", "0")}</span>
    // }, {
      title: 'Khối lượng (Kg)',
      dataIndex: 'Order',
      key: 'weight',
      render: (text, record, index) => <span>{ObjectPath.get(text, "NetWeight", "0")}</span>
    }];

    return (
      <LayoutWrapper>
        <div className={"detail-header"}>
          <h1>Chi tiết bảng kê</h1>
          <div className={"action"}>
            <Button
              style={orangeButton}
              onClick={this.redirectToPrint}
            >
              In bảng kê
            </Button>
          </div>
        </div>

        <Row style={{...rowStyle, marginRight: 0}} gutter={gutter} justify="start">
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Card title={"Chi tiết"}>
              <Spin spinning={fetching || false}>
                <Row justify={"start"} type={"flex"} align={"top"}>
                  <Col sm={12} xs={24}>
                    <div className={"pickingList-detail"}>
                      <div className={"row-detail"}>
                        <div>Mã bảng kê</div>
                        <div>
                          <Tag color={"purple"}>{ObjectPath.get(dataSource, "Code")}</Tag>
                        </div>
                      </div>
                      <div className={"row-detail"}>
                        <div>Trạng thái</div>
                        <div>
                          <Tag color={ObjectPath.get(dataSource, "Status.Color")}>
                            {`${ObjectPath.get(dataSource, "Status.Code")} - ${ObjectPath.get(dataSource, "Status.Name")}`}
                          </Tag>
                        </div>
                      </div>
                      <div className={"row-detail"}>
                        <div>Loại bảng kê</div>
                        <div>
                          {ObjectPath.get(dataSource, "Type.Name")}
                        </div>
                      </div>
                      <div className={"row-detail"}>
                        <div>Khối lượng</div>
                        <div>
                          {ObjectPath.get(dataSource, "Weight", "0")} Kg
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col sm={12} xs={24}>
                    <div className={"pickingList-detail"}>
                      <div className={"row-detail"}>
                        <div>Điểm thu</div>
                        <div>
                          {ObjectPath.get(dataSource, "SourceHub.DisplayName")}
                        </div>
                      </div>
                      <div className={"row-detail"}>
                        <div>Điểm phát</div>
                        <div>
                          {ObjectPath.get(dataSource, "DestinationHub.DisplayName")}
                        </div>
                      </div>
                      <div className={"row-detail"}>
                        <div>Loại dịch vụ</div>
                        <div>
                          {ObjectPath.get(dataSource, "ServiceType.Name")}
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

            <div style={{marginTop: 20}}>
              <Card title={"Danh sách đơn hàng"}>
                <div style={{backgroundColor: "#FFFFFF"}}>
                  <Spin spinning={fetching || false}>
                    <Table
                      bordered
                      dataSource={(dataSource && dataSource.Entries.slice()) || []}
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