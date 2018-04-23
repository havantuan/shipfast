import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Col, Icon, Popconfirm, Row, Spin, Table, Tag, Tooltip} from 'antd';
import {numberFormat} from '../../../../helpers/utility';
import routerConfig from "../../../../config/router";
import './Style.css';
import LabelStatus from '../../Common/StatusTag/LabelStatus';
import TaskTableControl from './TaskTableControl';
import StatusTag from "../../Common/StatusTag/StatusTag";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

@inject(Keys.grantTask, Keys.router, Keys.taskAssignGroup, Keys.detailOrder)
@observer
export default class TaskTable extends Component {

  constructor(props) {
    super(props);
    this.grantTask = props.grantTask;
    this.taskAssignGroup = props.taskAssignGroup;
    this.router = props.router;
  };

  rejectTask = (code) => {
    this.grantTask.handleRejectTask([code]);
  };

  printTask = () => {
    window.open(routerConfig.printTask.replace(":code", `${this.taskAssignGroup.assignCode}`));
  };

  assignConfirm = () => {
    this.taskAssignGroup.taskAssignConfirm(this.grantTask.staffID, {Codes: this.taskAssignGroup.taskCodes});
  };

  handleCheck(array, val) {
    return array.some(item => val === item);
  }

  render() {
    const {dataSource, fetching, label} = this.taskAssignGroup;
    const labelContent = (record) => {
      return {
        children: <LabelStatus status={record.status} total={record.total}/>,
        props: {
          colSpan: 7,
        },
      };
    };

    const columns = [{
      title: '',
      dataIndex: '',
      key: 'delete',
      className: 'col-center',
      render: (text, record, index) => {
        return (
          this.handleCheck(label, index) ?
            labelContent(record)
            :
            <Popconfirm title="Bạn có muốn hủy?" onConfirm={() => this.rejectTask(record.Code)}>
              <a href="#">
                <Icon type="delete"/>
              </a>
            </Popconfirm>
        )
      }
    }, {
      title: 'Mã đơn hàng',
      dataIndex: 'Orders',
      key: 'orderID',
      className: 'col-center',
      render: (text, record, index) => {
        return (
          this.handleCheck(label, index) ?
            {props: {colSpan: 0}}
            :
            record.Orders.map((element, index) =>
              <div key={index}>
                <Tag color={'purple'} onClick={this.props.detailOrder.onShowRootModal(element.Code)}>
                  {element.Code}
                </Tag>
              </div>
            )
        )
      }
    }, {
      title: 'Mã công việc',
      dataIndex: '',
      key: 'taskID',
      className: 'col-center',
      render: (text, record, index) => {
        return (
          this.handleCheck(label, index) ?
            {props: {colSpan: 0}}
            :
            <Link to={routerConfig.detailTask.replace(":code", record.Code)}>
              <Tag color={'blue'}>{record.Code}</Tag>
            </Link>
        )
      }
    }, {
      title: 'Trạng thái',
      dataIndex: 'StatusCode',
      key: 'statusCode',
      className: 'col-center',
      render: (text, record, index) => {
        return (
          this.handleCheck(label, index) ?
            {props: {colSpan: 0}}
            :
            <StatusTag value={text}/>
        )
      }
    }, {
      title: 'Địa chỉ',
      dataIndex: 'Address',
      key: 'address',
      render: (text, record, index) => {
        return (
          this.handleCheck(label, index) ?
            {props: {colSpan: 0}}
            :
            <div style={{wordBreak: 'keep-all', textAlign: 'justify'}}>
              <Tooltip title={text}>
                <span>
                    <Icon type="environment"/>
                  {text}
                </span>

                <a href={`https://www.google.com/maps/place/${text}`} target="_blank"
                   style={{marginLeft: '5px'}}>
                  <Icon type="global"/>
                </a>
              </Tooltip>
            </div>
        )
      }
    }, {
      title: 'Khối lượng (Kg)',
      dataIndex: 'Orders',
      key: 'weight',
      className: 'col-right',
      render: (text, record, index) => {
        return (
          this.handleCheck(label, index) ?
            {props: {colSpan: 0}}
            :
            text.map((element, index) =>
              <p key={index}>
                {numberFormat(+element.NetWeight, 1)} Kg
              </p>
            )
        )
      }
    }, {
      title: 'Thu hộ (đ)',
      dataIndex: 'Orders',
      key: 'money',
      className: 'col-right',
      render: (text, record, index) => {
        return (
          this.handleCheck(label, index) ?
            {props: {colSpan: 0}}
            :
            text.map((element, index) =>
              <p key={index}>
                {numberFormat(+element.Receiver.AccountReceivable, 0)} đ
              </p>
            )
        )
      }
    }];

    return (
      <div>
        <TaskTableControl/>

        <Spin spinning={fetching || false}>
          <Table
            className="task-table"
            size="middle"
            dataSource={dataSource ? dataSource.slice() : []}
            rowKey={(record, index) => index}
            columns={columns}
            pagination={false}
            bordered={true}
          />
        </Spin>

        {
          dataSource && dataSource.length > 0 &&
          <Row>
            <Col md={17} sm={17} xs={24}>
              {
                this.taskAssignGroup.assignCode &&
                <div>
                  <div>
                    <span>{'Bạn đã cập nhật các công việc trên vào bảng kê '}</span>
                    <Tag color={'blue'}>
                      {this.taskAssignGroup.assignCode}
                    </Tag>
                  </div>
                  <p>{'Hãy chuẩn bị hàng hóa và in bảng kê khi bàn giao công việc cho nhân viên.'}</p>
                </div>
              }
            </Col>
            <Col md={7} sm={7} xs={24} style={{textAlign: 'right'}}>
              {
                this.taskAssignGroup.assignCode === null ?
                  <Button
                    icon="check-circle-o"
                    className="green-button"
                    type="primary"
                    onClick={this.assignConfirm}
                  >
                    Xác nhận giao việc
                  </Button>
                  :
                  <Button
                    icon="file-text"
                    className="orange-button"
                    onClick={this.printTask}
                  >
                    In biên bản giao việc
                  </Button>
              }
            </Col>
          </Row>
        }

      </div>
    );
  };
}