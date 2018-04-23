import React from 'react';
import {Card, Table, Col, Row} from 'antd';
import ObjectPath from 'object-path';
import {numberFormat} from "../../../../helpers/utility";

const NodeColumnTable = (data) => {
  return (
    <Row>
      <Col md={{span: 8, offset: 8}} sm={{span: 8, offset: 8}} xs={{span: 24}}>
        <b>Số Tiền Đối Soát: </b>
        <span style={{color: 'green', fontSize: '15px'}}>[1] + [2] = </span>
        <span style={{color: 'red', fontSize: '15px'}}>{numberFormat(data.data.NetAmount)} ₫</span>
      </Col>
      <Col md={{span: 8}} sm={{span: 8}} xs={{span: 24}}>
        <b>Số đơn không thành công: </b>
        <span style={{color: 'blue', fontSize: '15px'}}>{data.data.CanceledCount}</span>
      </Col>
    </Row>
  )
};

class CashFlowInformation extends React.PureComponent {

  render() {
    let {dataSource = {}} = this.props;
    let data = [];
    data.push({
      ...dataSource['Success'],
      Name: 'Giao Thành Công',
      Code: 1
    });
    data.push({
      ...dataSource['Return'],
      Name: 'Hoàn Thành Công',
      Code: 2
    });
    data.push({
      ...dataSource['Performing'],
      Name: 'Đang Luân Chuyển',
      Code: 3
    });

    console.log('%cdatadatadata', 'color: #00b33c', data)
    const columns = [{
      title: 'Danh mục',
      dataIndex: 'Name',
      key: 'Name',
      render: (text, record, index) => <span><b>{ObjectPath.get(record, "Name")}</b></span>
    }, {
      title: 'Số đơn',
      key: 'Count',
      dataIndex: 'Count',
      render: (text, record, index) => <span>{ObjectPath.get(record, "Count")}</span>
    }, {
      title: 'Thu hộ',
      key: 'Cod',
      dataIndex: 'Cod',
      render: (text, record, index) => <span>{numberFormat(ObjectPath.get(record, "Cod"), 0)} đ</span>
    }, {
      title: 'Phí giao hàng',
      dataIndex: 'Cost',
      key: 'Cost',
      render: (text, record, index) => <span>{numberFormat(ObjectPath.get(record, "Cost"))} đ</span>
    }, {
      title: 'Phí chuyển hoàn',
      dataIndex: 'ReturningCost',
      key: 'ReturningCost',
      render: (text, record, index) => <span>{numberFormat(ObjectPath.get(record, "ReturningCost"))} đ</span>
    }, {
      title: 'Khuyến mãi',
      dataIndex: 'Discount',
      key: 'Discount',
      render: (text, record, index) => <span>{numberFormat(ObjectPath.get(record, "Discount"))} đ</span>
    }, {
      title: 'Thực nhận',
      dataIndex: 'NetAmount',
      key: 'NetAmount',
      render: (text, record, index) => <span>{numberFormat(ObjectPath.get(record, "NetAmount"))} đ {record.Code === 1 ?
        <span style={{color: 'green', fontSize: '16px'}}>[1]</span> : (record.Code === 2 ?
          <span style={{color: 'green', fontSize: '16px'}}>[2]</span> : '')} </span>
    }];

    return (
      <Card
        title={'THÔNG TIN DÒNG TIỀN'}
        bodyStyle={{padding: "5px 10px"}}
      >
        <Table
          dataSource={data}
          title={() => <div>
            <h3 style={{color: "#dc2525"}}>Thực Nhận = Thu Hộ + Trả Trước - Phí Giao Hàng - Phí Chuyển Hoàn - Phí Bảo
              Hiểm +
              Khuyến Mãi</h3>
          </div>}

          columns={columns}
          rowKey={record => record.Code}
          pagination={false}
          footer={() => <NodeColumnTable data={dataSource}/>}
        />
      </Card>
    )
  }

}

export default CashFlowInformation;