import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import "./Style.css";
import {Button, Col, Row, Table} from 'antd';
import ObjectPath from "object-path";
import {numberFormat} from "../../../../helpers/utility";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';

@inject(Keys.router, Keys.handerOverDetail)
@withRouter
@observer
export default class PrintHandOver extends Component {

  constructor(props) {
    super(props);
    this.code = this.props.match.params.code;
  }

  componentWillUnmount() {
    this.props.handerOverDetail.clear();
  }

  componentDidMount() {
    this.props.handerOverDetail.fetchByID(this.code);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.handerOverDetail.dataSource && Object.keys(this.props.handerOverDetail.dataSource).length > 0) {
      setTimeout(() => {
        window.print()
      }, 2000);
    }
  }

  render() {
    const {dataSource, fetching} = this.props.handerOverDetail;
    if (dataSource && dataSource.Entries && dataSource.Entries.length > 0) {
      let totalValue = 0;
      dataSource.Entries.forEach(val => {
        totalValue += parseFloat(ObjectPath.get(val, "Order.TotalCost", 0))
      });
      dataSource.Entries.push({total: {label: 'Tổng cộng', value: totalValue}});
    }

    const columns = [{
      title: 'STT',
      dataIndex: '',
      key: 'index',
      render: (text, record, index) => <span>{record.total ? null : (index + 1)}</span>
    }, {
      title: 'Mã đơn hàng',
      dataIndex: '',
      key: 'code',
      render: (text, record, index) => <span>{record.total ?
        <b>{record.total.label}</b> : record.Order && record.Order.Code}</span>
    }, {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'Order',
      key: 'orderStatus',
      render: (text, record, index) => <span>{ObjectPath.get(text, "StatusCode.Name")}</span>
    }, {
      title: 'Trạng thái trong bảng kê',
      dataIndex: 'Order',
      key: 'handOverStatus',
      render: (text, record, index) =>
        <span>{text && text.HandOverStatusCodes && text.HandOverStatusCodes[0] && text.HandOverStatusCodes[0].Name}</span>
    }, {
      title: 'Tổng thu (đ)',
      dataIndex: 'Order',
      key: 'total',
      render: (text, record, index) =>
        <div>
          {
            record.total ?
              <b>{numberFormat(record.total.value)}</b>
              :
              numberFormat(ObjectPath.get(text, "TotalCost"))
          }
        </div>
    }];

    return (
      <div className="page">
        <div className="btn-print">
          <Button
            icon="printer"
            className="orange-button"
            loading={fetching}
            onClick={() => window.print()}
          >
            In bảng
          </Button>
        </div>
        <div className="page-content">
          <Row type="flex" justify={"end"}>
            <Col span={12} style={{textAlign: 'center'}}>
              <h1>BẢNG KÊ BÀN GIAO HÀNG</h1>
            </Col>
          </Row>
          <Row type="flex" align="middle">
            <Col span={12}>
              <div>
                <p>
                  <span className="font-bold">Nhân viên: </span>
                  <span>{ObjectPath.get(dataSource, "Staff.Name")}</span>
                </p>
                <p>
                  <span className="font-bold">Thời gian in: </span>
                  <span>{ObjectPath.get(dataSource, "CreatedAt.Pretty")}</span>
                </p>
                {/*<p>*/}
                {/*<span className="font-bold">Đã hoàn thành: </span>*/}
                {/*<span>0/1</span>*/}
                {/*</p>*/}
              </div>
            </Col>
            <Col span={12} className="col-center">
              <div>
                <img src={`${dataSource.QRCode}`} alt="QRCode"/>
              </div>
              <p className="font-bold">{dataSource.Code}</p>
            </Col>
          </Row>
          <div style={{margin: '10px 0'}}>
            <Table
              bordered
              dataSource={dataSource && dataSource.Entries && dataSource.Entries.slice()}
              columns={columns}
              rowKey={(record, index) => index}
              pagination={false}
            />
          </div>
          <div className="footer" style={{marginBottom: '10px'}}>
            <p>Số đơn đã thu hộ: {dataSource.Pickups}</p>
            {/*<p>Tổng số tiền thu hộ cần nộp lại: 0 đ</p>*/}
            {/*<p>Số tiền đã thu được: </p>*/}
          </div>
          <Row className="font-bold">
            <Col span={8} className="col-center">
              <p style={{marginBottom: '70px'}}>Nhân viên bưu tá</p>
              <p>{ObjectPath.get(dataSource, "Staff.Name")}</p>
            </Col>
            <Col span={8} className="col-center">
              <p style={{marginBottom: '70px'}}>Nhân viên điểm gửi hàng</p>
            </Col>
            <Col span={8} className="col-center">
              <p style={{marginBottom: '70px'}}>Nhân viên kế toán</p>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
