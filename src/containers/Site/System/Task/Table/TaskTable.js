import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Icon, Spin, Table, Tag} from 'antd';
import routerConfig from "../../../../../config/router";
import StatusTag from "../../../Common/StatusTag/StatusTag";
import './Style.css';
import ObjectPath from "object-path";
import TotalRecord from '../../../../../components/TotalRecord/index';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../../stores/index';
import TableFooter from "../../../../../components/TableFooter/index";
import StatusToolTip from '../../../Common/StatusToolTip/StatusToolTip';
import {currencyFormat} from '../../../../../helpers/utility';

@inject(Keys.task, Keys.router)
@observer
export default class TaskTable extends Component {

  constructor(props) {
    super(props);
    this.task = props.task;
    this.router = props.router;
  }

  componentDidMount() {
    this.task.reload();
  }

  componentWillUnmount() {
    this.task.clear();
  }

  render() {
    let {dataSource, fetching, pagination} = this.task;
    let statusCode = this.task.filter.StatusCode;
    let counter = pagination.pageSize * (pagination.current - 1);

    let columns = [{
      title: '#',
      dataIndex: '',
      key: 'index',
      render: (text, record, index) => <span>{index + 1 + counter}</span>
    }, {
      title: 'Mã công việc',
      dataIndex: 'Code',
      key: 'Code',
      render: (text, record, index) => <div>
        <div className={'tagList'}>
          <Link to={routerConfig.detailTask.replace(":code", record.Code)}>
            <Tag color={'red'}>{ObjectPath.get(record, 'Type.Name')} - {record.Code ? record.Code : null}</Tag>
          </Link>
        </div>
        <p><b>Còn: </b>{record.ExpiredAt && record.ExpiredAt.Deadline ? record.ExpiredAt.Deadline : ''}</p>
      </div>,
    }, {
      title: 'Trạng thái',
      dataIndex: 'Status',
      key: 'Status',
      render: (text, record, index) => <div>
        <div><StatusTag value={record.StatusCode}/></div>
      </div>
    }, {
      title: 'Địa chỉ',
      dataIndex: 'Address',
      key: 'Address',
      width: '40%',
      render: (text, record, index) => <div>
        <p><Icon type="user-delete" style={{
          fontSize: 16,
          color: '#000000'
        }}/> {record && record.CustomerName ? record.CustomerName : ''}, <Icon type="phone" style={{
          fontSize: 16,
          color: '#088'
        }}/> {record && record.CustomerPhone ? record.CustomerPhone : ''}</p>
        <p>
          <Icon type="environment" style={{fontSize: 16, color: '#408822'}}/>
          <span className="font-bold">Thu: </span> {ObjectPath.get(text)}
          {
            text &&
            <a href={`https://www.google.com/maps/place/${text}`} target="_blank"
               style={{marginLeft: '5px'}}>
              <Icon type="global"/>
            </a>
          }
        </p>
      </div>
    }, {
      title: 'Nhân viên',
      dataIndex: 'Staff',
      key: 'Staff',
      render: (text, record, index) => <div>
        <p><Icon type="user-delete" style={{
          fontSize: 16,
          color: '#000000'
        }}/> {record && record.Staff && record.Staff.Name ? record.Staff.Name : ''}</p>
        <p><Icon type="phone" style={{
          fontSize: 16,
          color: '#088'
        }}/> {record && record.Staff && record.Staff.Phone ? record.Staff.Phone : ''}</p>
      </div>
    }, {
      title: 'Phải thu',
      dataIndex: 'AccountReceivable',
      key: 'AccountReceivable',
      render: (text, record, index) => <span>{currencyFormat(text)}</span>
    },
      {
        title: 'Hub',
        dataIndex: 'Hub',
        width: '50px',
        key: 'Hub',
        render: (text, record, index) =>
          <StatusToolTip value={ObjectPath.get(record, "Hub")}/>
      },
      {
        title: 'Ngày phân công',
        dataIndex: 'AssignedAt',
        key: 'AssignedAt',
        render: (text, record, index) => <div>
          {record.AssignedAt && record.AssignedAt.Pretty ? record.AssignedAt.Pretty : ''}
        </div>,
      }
    ];

    if (statusCode === 100) {
      columns.push(
        {
          title: 'Giao việc',
          dataIndex: '',
          render: (text, record, index) =>
            <div style={{whiteSpace: 'nowrap'}}>
              <Link to={routerConfig.task}>
                <Icon type="rocket" style={{fontSize: 16, color: '#1af9eb'}}/>Giao việc
              </Link>
            </div>
        }
      )
    }

    return (
      <div style={{marginTop: 20}} className={"standardTable"}>
        <TotalRecord total={pagination.total} name={"công việc"}/>
        <Spin spinning={fetching}>
          <Table
            dataSource={dataSource.slice()}
            columns={columns}
            rowKey={record => record.Code}
            pagination={this.props.pagination}
            onChange={this.task.handleTableChange}
            footer={() => <TableFooter name={'công việc'} pagination={pagination}/>}
          />
        </Spin>
      </div>
    )
  }

}

