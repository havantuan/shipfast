import React, {Component} from 'react';
import ObjectPath from "object-path";
import {Button, Col, Row, Table} from 'antd';
import "./Style.css";
import basicStyle from "../../../../config/basicStyle";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
@inject(Keys.router, Keys.detailContainer)
@observer
export default class PrintContainer extends Component {

  constructor(props) {
    super(props);
    this.code = this.props.match.params.code;
  }

  componentDidMount() {
    this.props.detailContainer.fetchByID(this.code);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.detailContainer.dataSource !== null) {
      setTimeout(() => {
        window.print()
      }, 2000);
    }
  }

  render() {
    const {orangeButton} = basicStyle;
    const {dataSource, fetching} = this.props.detailContainer;
    console.log('%c dataSource dataSource;', 'color: #00b33c', this.props.detailContainer.dataSource);
    const columns = [{
      title: 'STT',
      dataIndex: '',
      key: 'index',
      render: (text, record, index) => <span>{index + 1}</span>
    }, {
      title: 'Mã bảng kê/Kiện',
      key: 'code',
      render: (text, record, index) => <span className="font-bold">{ObjectPath.get(record, "Code")}</span>
    }, {
      title: 'Dịch vụ',
      key: 'ServiceType',
      render: (text, record, index) => <span>{ObjectPath.get(record.Type, "Name")}</span>

    },
      {
        title: 'Điểm phát',
        key: 'DestinationHub',
        render: (text, record, index) => <span>{ObjectPath.get(record.DestinationHub, "Name")}</span>

      },
      {
        title: 'Điểm thu',
        key: 'SourceHub',
        render: (text, record, index) => <span>{ObjectPath.get(record.SourceHub, "Name")}</span>

      }, {
        title: 'Số lượng',
        dataIndex: 'Order',
        key: 'quantity',
        render: (text, record, index) => <span>{ObjectPath.get(record.Orders).length}</span>
      }, {
        title: 'Khối lượng (Kg)',
        dataIndex: 'Order',
        key: 'weight',
        render: (text, record, index) => <span>{ObjectPath.get(record, "Weight", "0")}</span>
      }];

    return (
      <div className="page">
        <div className="btn-print">
          <Button
            icon="printer"
            loading={fetching}
            style={orangeButton}
            onClick={() => window.print()}
          >
            In bảng
          </Button>
        </div>
        <div className="page-content">
          <Row type="flex" justify={"end"}>
            <Col span={24} style={{textAlign: 'center'}}>
              <h1>Chuyến thư {ObjectPath.get(dataSource, "Code")}</h1>
            </Col>
          </Row>
          <Row type="flex" align="middle" style={{lineHeight: "25px"}}>
            <Col span={8}>
              <div>
                <p>
                  <span className="font-bold">Điểm phát: </span>
                  <span>{ObjectPath.get(dataSource, "DestinationHub.Name")}</span>
                </p>
                <p>
                  <span className="font-bold">Trạng thái: </span>
                  <span>{ObjectPath.get(dataSource, "Status.Name")}</span>
                </p>
                <p>
                  <span className="font-bold">Ngày tạo: </span>
                  <span>{ObjectPath.get(dataSource, "CreatedAt.Pretty")}</span>
                </p>
                <p>
                  <span className="font-bold">Cập nhật: </span>
                  <span>{ObjectPath.get(dataSource, "UpdatedAt.Pretty")}</span>
                </p>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <p>
                  <span className="font-bold">Điểm thu: </span>
                  <span>{ObjectPath.get(dataSource, "SourceHub.Name")}</span>
                </p>
                <p>
                  <span className="font-bold">Trạng thái: </span>
                  <span>{ObjectPath.get(dataSource, "Status.Code")} - {ObjectPath.get(dataSource, "Status.Name")}</span>
                </p>
                <p>
                  <span className="font-bold">Biển số xe: </span>
                  <span>{ObjectPath.get(dataSource, "VehicleNumberPlates")}</span>
                </p>
                <p>
                  <span className="font-bold">Khối lượng: </span>
                  <span>{ObjectPath.get(dataSource, "Weight", "0")} Kg</span>
                </p>
              </div>
            </Col>
            <Col span={8} className="col-center">
              <div>
                <img src={`${ObjectPath.get(dataSource, "QRCode")}`} alt={`${ObjectPath.get(dataSource, "Code")}`}/>
              </div>
              <p className="font-bold">{`${ObjectPath.get(dataSource, "Code")}`}</p>
            </Col>
          </Row>
          <div style={{margin: '10px 0'}}>
            <Table
              bordered={true}
              dataSource={(dataSource && dataSource.PickingLists) || []}
              columns={columns}
              rowKey={record => ObjectPath.get(record, "PickingLists.Code")}
              pagination={false}
            />
          </div>
          <Row style={{marginBottom: '30px'}}>
            <Col span={12} className="col-center">
              <p className={"font-bold"}>Nhân viên bàn giao</p>
              <p>Ký ghi rõ họ tên</p>
            </Col>
            <Col span={12} className="col-center">
              <p className={"font-bold"}>Người nhận ký nhận</p>
              <p>Ký ghi rõ họ tên</p>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
