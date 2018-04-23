import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Card, Col, Icon, Row, Table, Tag} from 'antd';
import LayoutWrapper from '../../../../../components/utility/layoutWrapper';
import basicStyle from '../../../../../config/basicStyle';
import StatusTag from "../../../Common/StatusTag/StatusTag";
import './Style.css';
import ObjectPath from "object-path";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../stores/index";

@withRouter
@inject(Keys.task, Keys.detailOrder)
@observer
export default class TaskDetail extends Component {

  constructor(props) {
    super(props);
    this.code = props.match.params.code;
    this.task = props.task;
  }

  componentDidMount() {
    this.task.fetchByCode(this.code);
  }

  render() {
    const {rowStyle, gutter} = basicStyle;
    let {currentRow: dataSource} = this.task;

    const listOrder = [{
      title: 'STT',
      dataIndex: '',
      key: 'index',
      render: (text, record, index) => <span>{index + 1}</span>
    }, {
      title: 'Mã đơn hàng',
      dataIndex: '',
      key: 'Code',
      render: (text, record, index) =>
        <Tag color={"blue"} onClick={(e) => this.props.detailOrder.showRootModal(ObjectPath.get(record, 'Order.Code'))}>
          <span>{record.Order.Code}</span>
        </Tag>
    }, {
      title: 'Người nhận',
      dataIndex: '',
      key: 'Receiver',
      render: (text, record, index) => <div>
        <p><b>Họ tên: </b>{ObjectPath.get(record, 'Order.Receiver.Name')}</p>
        <p><b>Số ĐT: </b>{ObjectPath.get(record, 'Order.Receiver.Phone')}</p>
      </div>
    }, {
      title: 'Trạng thái',
      dataIndex: '',
      key: 'StatusCode',
      render: (text, record, index) => <StatusTag value={ObjectPath.get(record, 'Order.StatusCode')}/>
    }];

    return (
      <LayoutWrapper className={"detail-order"}>

        <Row justify="start" style={rowStyle} gutter={gutter}>
          <Col sm={22}>
            <div>
              <h1 className={"title"}><Icon type="right-square-o" style={{color: '#27c24c'}}/> Công
                việc {ObjectPath.get(dataSource, 'Code')}</h1>
            </div>
          </Col>
        </Row>

        <Row style={rowStyle} gutter={gutter} justify="start">
          <Col span={12}>
            <Card title="Thông tin công việc" bordered={false} style={{marginTop: 20}}>
              <div className='row'>
                Mã công việc: <Tag
                color="blue">{ObjectPath.get(dataSource, 'Code', '???')}</Tag>
              </div>
              <div className='row'>
                <p>Khách hàng: {ObjectPath.get(dataSource, 'CustomerName')} - Số điện
                  thoại: {ObjectPath.get(dataSource, 'CustomerPhone')}</p>
              </div>
              <div className='row'>
                <p>Địa chỉ: {ObjectPath.get(dataSource, 'Address')}</p>
              </div>
              <div className='row'>
                <p>Thời gian
                  tạo: {ObjectPath.get(dataSource, 'CreatedAt.Pretty')}</p>
              </div>
              <div className='row'>
                <p>Thời gian giao việc: {ObjectPath.get(dataSource, 'AssignedAt.Pretty')}</p>
              </div>
              <div className='row'>
                <p>Thời gian cam kết: {ObjectPath.get(dataSource, 'ExpiredAt.Pretty')}</p>
              </div>
              <div className='row'>
                Trạng thái: <StatusTag
                value={dataSource && dataSource.StatusCode ? dataSource.StatusCode : ''}/>
              </div>
              <div className='row'>
                <p>Khối lượng: {ObjectPath.get(dataSource, 'TotalWeight')}
                  Kg</p>
              </div>
              <div className='row'>
                <p>Nhân viên: {ObjectPath.get(dataSource, 'Staff.Name')} - Số điện
                  thoại: {ObjectPath.get(dataSource, 'Staff.Phone')}</p>
              </div>
              <div className='row'>
                <Icon type="forward" style={{color: 'red'}}/>Điểm gửi hàng hiện tại: <Tag
                color="#7698e0">{ObjectPath.get(dataSource, "Hub.Code")}
                - {ObjectPath.get(dataSource, "Hub.Name")}</Tag>
              </div>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Danh sách đơn hàng" bordered={false} style={{marginTop: 20}}>
              <Table
                style={{marginTop: '10px'}}
                dataSource={(dataSource && dataSource.Entries) ? dataSource.Entries.slice() : []}
                columns={listOrder}
                rowKey={(record, index) => index}
                pagination={false}
                bordered
              />
            </Card>
          </Col>
        </Row>

      </LayoutWrapper>
    )
  }

}