import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ObjectPath from "object-path";
import {Button, Checkbox, Icon, message, Popconfirm, Radio, Spin, Table, Tag, Tooltip} from 'antd';
import ContentHolder from '../../../../../components/utility/ContentHolder';
import routerConfig from "../../../../../config/router";
import basicStyle from "../../../../../config/basicStyle";
import "../Style.css";
import MyTasksTableControl from "./MyTasksTableControl";
import Permission from "../../../../../permissions/index";
import StatusTag from "../../../Common/StatusTag/StatusTag";
import TotalRecord from '../../../../../components/TotalRecord';
import PageHeaderLayout from '../../../../../layouts/PageHeaderLayout';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../../stores/index';
import TableFooter from "../../../../../components/TableFooter/index";
import StatusToolTip from "../../../Common/StatusToolTip/StatusToolTip";
import {currencyFormat} from '../../../../../helpers/utility';

const RadioGroup = Radio.Group;

@inject(Keys.myTask, Keys.detailOrder)
@observer
export default class MyTasksTable extends Component {

  componentDidMount() {
    this.props.myTask.reload();
  }

  render() {
    const {dataSource, fetching} = this.props.myTask;
    const {greenBg, redBg} = basicStyle;
    let counter = this.props.myTask.pagination.pageSize * (this.props.myTask.pagination.current - 1);

    const {pagination} = this.props.myTask;
    const columns = [{
      title: '#',
      dataIndex: '',
      key: 'index',
      className: 'col-center',
      render: (text, record, index) => <span>{index + 1 + counter}</span>
    }, {
      title: 'Mã',
      dataIndex: '',
      width: '90px',
      key: 'code',
      render: (text, record, index) =>
        <div>
          <div className={'tagList'}>
            <Link to={routerConfig.detailTask.replace(":code", record.Code)}>
              <Tag color={'red'}>{ObjectPath.get(record, 'Type.Name')} - {record.Code ? record.Code : null}</Tag>
            </Link>
          </div>
          <p><b>Còn: </b>{record.ExpiredAt && record.ExpiredAt.Deadline ? record.ExpiredAt.Deadline : ''}</p>
        </div>
    }, {
      title: 'Trạng thái',
      dataIndex: 'StatusCode',
      key: 'status',
      render: (text, record, index) =>
        <StatusTag value={text}/>
    }, {
      title: 'Địa chỉ',
      key: 'customer',
      render: (text, record, index) =>
        <div>
          <p>
            <Icon type={'user'}/>&nbsp;
            <span>{record.CustomerName}</span> ,&nbsp;
            <Icon type={'phone'}/>&nbsp;
            <span>{record.CustomerPhone}</span>
          </p>
          <p>
            {
              record.Address &&
              <Tooltip title={record.Address}>
                <span>
                    <Icon type="environment"/>&nbsp;{record.Address}
                </span>
                <a
                  href={`https://www.google.com/maps/place/${record.Address}`}
                  target="_blank"
                  style={{marginLeft: '5px'}}
                >
                  <Icon type="global"/>
                </a>
              </Tooltip>
            }
          </p>
        </div>
    }, {
      title: 'Phải thu',
      dataIndex: 'AccountReceivable',
      key: 'AccountReceivable',
      render: (text, record, index) => <span>{currencyFormat(text)}</span>
    }, {
      title: 'Ngày phân công',
      dataIndex: '',
      width: '120px',
      key: 'taskCode',
      render: (text, record, index) =>
        <div className={'tagList'}>
          {ObjectPath.get(record, "AssignedAt.Pretty")}
        </div>
    }, {
      title: 'Hub',
      dataIndex: 'Hub',
      width: '50px',
      key: 'Hub',
      render: (text, record, index) =>
        <StatusToolTip value={ObjectPath.get(record, "Hub")}/>
    }];

    if (Permission.allowUpdateStatusTask()) {
      columns.push({
        title: 'Hành động',
        dataIndex: '',
        width: '90px',
        key: 'action',
        render: (text, record, index) =>
          <div>
            {
              ObjectPath.get(record, 'StatusCode.Code', null) !== 400 &&
              <Popconfirm
                title="Bạn đã hoàn thành công việc?"
                onConfirm={() => this.props.myTask.confirm(record.Code)}
                okText="Có"
                cancelText="Không"
              >
                <Button
                  style={{...greenBg, marginRight: '5px'}}
                  size={'small'}
                >
                  {'Đóng việc'}
                </Button>
              </Popconfirm>
            }

            {
              ObjectPath.get(record, 'StatusCode.Code', null) !== 410 &&
              <Popconfirm
                title="Bạn có chắc chắn muốn hủy công việc?"
                onConfirm={() => this.props.myTask.cancel(record.Code)}
                okText="Có"
                cancelText="Không"
              >
                <Button
                  style={redBg}
                  size={'small'}
                >
                  {'Hủy'}
                </Button>
              </Popconfirm>
            }
          </div>
      })
    }

    return (
      <PageHeaderLayout
        title="Công việc của tôi"
      >
        <ContentHolder>
          <MyTasksTableControl/>

          <div style={{marginTop: 20}}>
            <div className={"standardTable"}>
              <TotalRecord total={this.props.myTask.pagination.total} name={"công việc"}/>
              <Spin spinning={fetching}>
                <Table
                  dataSource={dataSource.slice()}
                  columns={columns}
                  rowKey={record => record.Code}
                  expandedRowRender={(record) => <NestedTable taskCode={record.Code}/>}
                  pagination={this.props.myTask.pagination}
                  onChange={this.props.myTask.handleTableChange}
                  footer={() => <TableFooter name={'đơn hàng'} pagination={pagination}/>}
                />
              </Spin>
            </div>
          </div>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}

@inject(Keys.myTask, Keys.detailOrder)
@observer
class NestedTable extends Component {

  state = {
    statuses: {},
  };

  onChangeOrderStatus = (taskCode, orderCode, statusCode) => {
    let statuses = {...this.state.statuses}; // object
    if (statuses && statuses[taskCode]) {
      let task = [...statuses[taskCode]]; // array
      if (task.filter(val => val.OrderCode === orderCode).length > 0) {
        let order = task.filter(val => val.OrderCode === orderCode);
        let obj = {...order[0], StatusCode: statusCode, Checked: true};
        let tmp = task.filter(val => val.OrderCode !== orderCode);
        statuses[taskCode] = tmp.concat({...obj});
      } else {
        statuses[taskCode] = task.concat({OrderCode: orderCode, StatusCode: statusCode, Checked: true});
      }
    } else {
      statuses[taskCode] = [{OrderCode: orderCode, StatusCode: statusCode, Checked: true}];
    }
    console.log("%cstatuses", 'color: #00b33c', statuses)
    this.setState({
      statuses
    });
  };

  handleConfirm = (taskCode) => {
    let statuses = {...this.state.statuses}; // object
    if (statuses && statuses[taskCode] && statuses[taskCode].length > 0) {
      let tmp = statuses[taskCode].filter(val => val.Checked === true && val.StatusCode !== null);
      if (tmp && tmp.length > 0) {
        let entries = tmp.map(val => {
          return {
            OrderCode: val.OrderCode,
            StatusCode: +val.StatusCode
          }
        });
        this.props.myTask.update(taskCode, {Orders: entries});
        // delete task in statuses state
        let newStatuses = {...this.state.statuses};
        delete newStatuses[taskCode];
        this.setState({
          statuses: newStatuses
        });
      }
      else {
        message.error('Vui lòng chọn đơn hàng/lý do cập nhật');
      }
    } else {
      message.error('Vui lòng chọn đơn hàng cần xử lý');
    }
  };

  getOrderStatus = (taskCode, orderCode, getStatus = true) => {
    let statuses = {...this.state.statuses}; // object
    if (statuses && statuses[taskCode]) {
      let tmp = statuses[taskCode].filter(val => val.OrderCode === orderCode);
      if (tmp && tmp.length > 0) {
        return getStatus === true ? `${tmp[0].StatusCode}` : tmp[0].Checked;
      }
    }
  };

  checkedChange = (taskCode, orderCode, e) => {
    let statuses = {...this.state.statuses}; // object
    let {checked} = e.target;
    if (statuses && statuses[taskCode]) {
      let task = [...statuses[taskCode]]; // array
      if (task.filter(val => val.OrderCode === orderCode).length > 0) {
        let order = task.filter(val => val.OrderCode === orderCode);
        let obj = {...order[0], Checked: checked};
        let tmp = task.filter(val => val.OrderCode !== orderCode);
        statuses[taskCode] = tmp.concat({...obj});
      } else {
        statuses[taskCode] = task.concat({OrderCode: orderCode, StatusCode: null, Checked: checked});
      }
    } else {
      statuses[taskCode] = [{OrderCode: orderCode, StatusCode: null, Checked: checked}];
    }
    console.log("%cstatuses", 'color: #00b33c', statuses);
    this.setState({
      statuses
    });
  };

  render() {
    let {taskCode, detailOrder} = this.props;
    let task = this.props.myTask.dataSource.find(val => val.Code === taskCode);

    const columns = [{
      title: "#",
      dataIndex: '',
      key: 'index',
      render: (text, record, index) => <span>{index + 1}</span>
    }, {
      title: <span><Icon type="barcode"/> Mã đơn hàng</span>,
      dataIndex: '',
      key: 'order',
      render: (text, record, index) =>
        <div>
          <Tag color={'purple'}
               onClick={detailOrder.onShowRootModal(ObjectPath.get(record, 'Order.Code'))}>{ObjectPath.get(record, 'Order.Code')}</Tag>
          <p><b>Tạo: </b>{ObjectPath.get(record, "Order.CreatedAt.Pretty")}</p>
        </div>
    }, {
      title: <span>Sản phẩm</span>,
      dataIndex: '',
      key: 'name',
      render: (text, record, index) =>
        <span>{ObjectPath.get(record, 'Order.Name')}</span>
    }, {
      title: 'Trạng thái',
      dataIndex: '',
      key: 'status',
      render: (text, record, index) =>
        <div className={'tagList'}>
          <div>
            <StatusTag
              value={ObjectPath.get(record, "Order.StatusCode") || {}}
            />
          </div>
          <p>
            <b><Icon type="reload"/> Cập nhật: </b>
            {ObjectPath.get(record, "Order.UpdatedAt.Pretty")}
          </p>
          <div>
            {
              ObjectPath.get(record, "StatusCode") &&
              <StatusTag
                value={ObjectPath.get(record, "StatusCode") || {}}
              />
            }
          </div>
          <div>
            <b><Icon type="home"/> Dịch vụ: </b>
            <Tag color="green">{ObjectPath.get(record, "Order.ServiceType.Name")}</Tag>
          </div>
        </div>
    }, {
      title: 'Lý do',
      dataSource: '',
      key: 'reason',
      render: (text, record, index) => {
        let nextTaskCodes = ObjectPath.get(record, 'Order.NextTaskCodes');
        return (
          <div>
            {
              ObjectPath.get(record, 'Order.CurrentTask.Code') === taskCode &&
              nextTaskCodes && nextTaskCodes.slice().length > 0 &&
              <RadioGroup
                onChange={(e) => this.onChangeOrderStatus(taskCode, ObjectPath.get(record, 'Order.Code'), e.target.value)}
                value={this.getOrderStatus(taskCode, ObjectPath.get(record, 'Order.Code'), true) || undefined}
                style={{width: '100%'}}
              >
                {
                  nextTaskCodes.map((item, index) =>
                    <Radio key={index} value={`${item.Code}`}
                           style={{display: 'block', lineHeight: '30px'}}>
                      {`${item.Name}`}
                    </Radio>
                  )
                }
              </RadioGroup>
            }
          </div>
        )
      }
    }, {
      title:
        <Button
          type={'primary'}
          onClick={() => this.handleConfirm(taskCode)}
          disabled={!(this.state.statuses[taskCode] &&
            this.state.statuses[taskCode].length > 0 &&
            this.state.statuses[taskCode].filter(val => val.Checked === true && val.StatusCode !== null).length > 0
          )}
        >
          Xác nhận
        </Button>,
      key: 'action',
      className: 'col-center',
      render: (text, record, index) =>
        <Checkbox
          checked={this.getOrderStatus(taskCode, ObjectPath.get(record, 'Order.Code'), false)}
          onChange={(e) => this.checkedChange(taskCode, ObjectPath.get(record, 'Order.Code'), e)}
          className={'custom-checkbox'}
        />
    }];

    return (
      <Table
        bordered
        dataSource={task.Entries.slice() || []}
        columns={columns}
        pagination={false}
        rowKey={(record, index) => index}
      />
    );
  }

}