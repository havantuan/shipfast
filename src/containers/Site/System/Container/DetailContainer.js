import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import ObjectPath from "object-path";
import {Button, Card, Col, Row, Spin, Table, Tag} from 'antd';
import LayoutWrapper from '../../../../components/utility/layoutWrapper';
import basicStyle from '../../../../config/basicStyle';
import routerConfig from "../../../../config/router";
import "./Style.css";
import StatusTag from "../../Common/StatusTag/StatusTag";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
@inject(Keys.router, Keys.detailContainer)
@withRouter
@observer
export default class DetailContainer extends Component {

  redirectToPrint = () => {
    window.open(routerConfig.printContainer.replace(":code", this.code));
  };

  constructor(props) {
    super(props);
    this.code = this.props.match.params.code
  }
  componentWillUnmount(){
    this.props.detailContainer.clear();
  }
  componentDidMount() {
    this.props.detailContainer.fetchByID(this.code);
  }

  render() {
    const {rowStyle, colStyle, gutter, orangeButton} = basicStyle;
    let {dataSource, fetching} = this.props.detailContainer;
    console.log('%c', 'color: #00b33c', this.props.detailContainer);

    let columns = [{
      title: '#',
      dataIndex: '',
      key: 'index',
      render: (text, record, index) => <span>{index + 1}</span>
    }, {
      title: 'Mã bảng kê',
      dataIndex: 'Code',
      key: 'Code',
      render: (text, record, index) =>
        <Link to={routerConfig.listDetail.replace(":code", ObjectPath.get(record, "Code"))}>
          <Tag color={"purple"}>{ObjectPath.get(record, "Code")}</Tag>
        </Link>
    }, {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text, record, index) =>
        <StatusTag value={ObjectPath.get(record, "Status")}/>
    }, {
      title: 'Điểm thu',
      dataIndex: 'SourceHub',
      key: 'name',
      render: (text, record, index) => <Tag color={"#97d67f"}>{ObjectPath.get(record.SourceHub, "Name")}</Tag>
    }, {
      title: 'Điểm phát',
      dataIndex: 'DestinationHub',
      key: 'DestinationHub',
      render: (text, record, index) => <Tag color={"#97d67f"}>{ObjectPath.get(record.DestinationHub, "Name")}</Tag>
    }, {
      title: 'Dịch vụ',
      dataIndex: 'Type',
      key: 'Type',
      render: (text, record, index) => <span>{ObjectPath.get(record.Type, "Name")}</span>
    }, {
      title: 'Số lượng',
      dataIndex: 'Quality',
      key: 'quantity',
      render: (text, record, index) => <span>{ObjectPath.get(record.Orders).length}</span>
    }, {
      title: 'Khối lượng (Kg)',
      dataIndex: 'Weight',
      key: 'Weight',
      render: (text, record, index) => <span>{ObjectPath.get(record, "Weight", "0")}</span>
    }, {
      title: 'Thời gian tạo',
      dataIndex: 'PickingLists',
      key: 'PickingLists',
      render: (text, record, index) => <span>{ObjectPath.get(record, "CreatedAt.Pretty", "0")}</span>
    },
      {
        title: 'Thời gian cập nhật',
        dataIndex: 'PickingLists',
        key: 'UpdatedAt',
        render: (text, record, index) => <span>{ObjectPath.get(record, "UpdatedAt.Pretty", "0")}</span>
      }
    ];

    return (
      <LayoutWrapper>
        <div className={"detail-header"}>
          <h1>Chi tiết chuyến thư</h1>
          <div className={"action"}>
            <Button
              style={orangeButton}
              onClick={this.redirectToPrint}
            >In chuyến thư</Button>
          </div>
        </div>
        <Row style={rowStyle} gutter={gutter} justify="start">
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <div>
              <Card title={"Chi tiết"}>
                <Spin spinning={fetching || null}>
                  <Row justify={"start"} type={"flex"} align={"top"}>
                    <Col sm={12} xs={24}>
                      <div className={"pickingList-detail"}>
                        <div className={"row-detail"}>
                          <div>Mã chuyến thư</div>
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
                          <div>Khối lượng</div>
                          <div>
                            {ObjectPath.get(dataSource, "Weight", "0")} Kg
                          </div>
                        </div>
                        <div className={"row-detail"}>
                          <div>Biển số xe</div>
                          <div>
                            {ObjectPath.get(dataSource, "VehicleNumberPlates", "0")}
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} xs={24}>
                      <div className={"pickingList-detail"}>
                        <div className={"row-detail"}>
                          <div>Điểm thu</div>
                          <div>
                            {ObjectPath.get(dataSource, "SourceHub.Name")}
                          </div>
                        </div>
                        <div className={"row-detail"}>
                          <div>Điểm phát</div>
                          <div>
                            {ObjectPath.get(dataSource, "DestinationHub.Name")}
                          </div>
                        </div>

                        <div className={"row-detail"}>
                          <div>Ngày tạo</div>
                          <div>
                            {ObjectPath.get(dataSource, "CreatedAt.Pretty")}
                          </div>
                        </div>
                        <div className={"row-detail"}>
                          <div>Ngày cập nhật</div>
                          <div>
                            {ObjectPath.get(dataSource, "UpdatedAt.Pretty")}
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Spin>
              </Card>
            </div>

            <div style={{marginTop: 20}}>
              <Card title={"Danh sách bảng kê"}>
                <div style={{backgroundColor: "#FFFFFF"}}>
                  <Spin spinning={fetching || null}>
                    <Table
                      bordered={true}
                      dataSource={(dataSource && dataSource.PickingLists) || []}
                      columns={columns}
                      rowKey={record => ObjectPath.get(record, "PickingLists.Code", 0)}
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

