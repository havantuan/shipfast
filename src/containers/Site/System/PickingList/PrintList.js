import React, {Component} from 'react';
import ObjectPath from "object-path";
import {Button, Col, Row, Table} from 'antd';
import "./Style.css";
import basicStyle from "../../../../config/basicStyle";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import {withRouter} from "react-router-dom";

@withRouter
@inject(Keys.pickingList)
@observer
export default class PrintList extends Component {

  constructor(props) {
    super(props);
    this.code = props.match.params.code;
  }

  componentDidMount() {
    this.props.pickingList.fetchByCode(this.code);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.pickingList.fetchCurrentRowSuccess === true) {
      setTimeout(() => {
        window.print()
      }, 2000);
    }
  }

  render() {
    const {orangeButton} = basicStyle;
    const {currentRow: dataSource, isFetchingCurrentRow: fetching} = this.props.pickingList;
    const columns = [{
      title: 'STT',
      dataIndex: '',
      key: 'index',
      render: (text, record, index) => <span>{index + 1}</span>
    }, {
      title: 'Mã đơn hàng',
      dataIndex: 'Order',
      key: 'code',
      render: (text, record, index) => <span className="font-bold">{text && text.Code}</span>
    }, {
      title: 'Dịch vụ',
      dataIndex: 'Order',
      key: 'ServiceType',
      render: (text, record, index) => <span>{ObjectPath.get(text, "ServiceType.Name")}</span>
      // }, {
      //     title: 'Tuyến',
      //     dataIndex: 'Route',
      //     key: 'route',
      //     render: (text, record, index) => <span>{text}</span>
    // }, {
    //   title: 'Số lượng',
    //   dataIndex: 'Order',
    //   key: 'quantity',
    //   render: (text, record, index) => <span>{text && text.Quantity}</span>
    }, {
      title: 'Khối lượng (Kg)',
      dataIndex: 'Order',
      key: 'weight',
      render: (text, record, index) => <span>{text && text.NetWeight}</span>
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
              <h1>BẢNG KÊ {ObjectPath.get(dataSource, "Code")}</h1>
            </Col>
          </Row>
          <Row type="flex" align="middle" style={{lineHeight: "25px"}}>
            <Col span={8}>
              <div>
                <p>
                  <span className="font-bold">Điểm phát: </span>
                  <span>{ObjectPath.get(dataSource, "DestinationHub.DisplayName")}</span>
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
                  <span className="font-bold">Loại bảng kê: </span>
                  <span>{ObjectPath.get(dataSource, "Type.Name")}</span>
                </p>
                <p>
                  <span className="font-bold">Tổng số đơn: </span>
                  <span>{(dataSource && dataSource.Entries && dataSource.Entries.length) || '0'}</span>
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
              bordered
              dataSource={(dataSource && dataSource.Entries.slice()) || []}
              columns={columns}
              rowKey={record => ObjectPath.get(record, "Order.Code")}
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