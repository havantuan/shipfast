import React, {Component} from 'react';
import {Form, Icon, Spin, Table, Tag, Tooltip} from 'antd';
import {Link} from "react-router-dom";
import TaskOrderTableControl from "./TaskOrderTableControl";
import ObjectPath from "object-path";
import TotalRecord from '../../../../components/TotalRecord/index';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import ContentHolder from "../../../../components/utility/ContentHolder";
import {numberFormat} from "../../../../helpers/utility";
import StatusTag from "../../Common/StatusTag/StatusTag";
import StatusToolTip from "../../Common/StatusToolTip/StatusToolTip";
import routerConfig from '../../../../config/router';

@Form.create()
@inject(Keys.TaskOrder, Keys.detailOrder)
@observer
export default class TaskOrder extends Component {


  componentDidMount() {
    this.props.TaskOrder.reload();
  }

  componentWillUnmount() {
    this.props.TaskOrder.clear();
  }

  render() {
    let {dataSource, fetching, pagination} = this.props.TaskOrder;
    let counter = pagination.pageSize * (pagination.current - 1);

    const columns = [{
      title: '#',
      dataIndex: '',
      key: 'index',
      width: '30px',
      render: (text, record, index) => <span>{index + 1 + counter}</span>
    }, {
      title: 'công việc',
      dataIndex: 'Task',
      key: 'Task.Code',
      render: (text, record, index) => <div>
        <p><Icon type="user"/> <b>{ObjectPath.get(record, "Task.Staff.Name")}</b></p>
        <p><Icon type="phone"/> <b>{ObjectPath.get(record, "Task.Staff.Phone")}</b></p>
        <div className={'tagList'}>
          <Link to={routerConfig.detailTask.replace(":code", text.Code)}>
            <Tag color={'red'}>{ObjectPath.get(text, 'Type.Name')} - {text.Code ? text.Code : null}</Tag>
          </Link>
        </div>
      </div>,
    }, {
      title: 'Đơn hàng',
      dataIndex: 'Order',
      key: 'Order.Code',
      width: 50,
      render: (value, record, index) =>
        <div className={'tableCellItem tagList'}>
          <div className={'item'}>
            <Tag color={"blue"} onClick={(e) => this.props.detailOrder.showRootModal(value.Code)}>
              <span>{value.Code}</span>
            </Tag>
          </div>
          <div className={'item'}>
            <Tag color="purple">{ObjectPath.get(value, "ServiceType.Name")}</Tag>
          </div>
          {
            ObjectPath.get(value, "Vases", []).length > 0 &&
            ObjectPath.get(value, "Vases", []).map((vas, i) =>
              <div className={'item'} key={i}>
                <Tag color="purple">{vas.Name}</Tag>
              </div>
            )
          }
          <p>{ObjectPath.get(record, "Task.TotalWeight")} Kg</p>
        </div>
    }, {
      title: 'Phí / Thu hộ',
      dataIndex: 'Order',
      width: 100,
      key: 'Order.Cost',
      render: (record, row, index) =>
        <div className={'tableCellItem'}>
          <p>
            <span className="font-bold">Cod: </span>
            <span className="nowrap">{record.Cod ? numberFormat(record.Cod, 0, '.') : '0'}</span>
          </p>
          <p>
            <span className="font-bold">Cước: </span>
            <span className="nowrap">{record.TotalCost ? numberFormat(record.TotalCost, 0, '.') : '0'}</span>
          </p>
          <p>
            <Tooltip placement="bottom" title={`${record.PaymentType.Name} thanh toán`}>
              <b>{record.PaymentType.Name}</b>
            </Tooltip>
          </p>
        </div>
    }, {
      title: 'Tổng thu',
      dataIndex: '',
      key: 'AccountReceivable',
      render: (text, record, index) =>
        <span>{numberFormat(ObjectPath.get(record, "AccountReceivable"), '.')}</span>
    }, {
      title: 'Thời gian',
      dataIndex: '',
      key: 'AssignedAt',
      render: (text, record, index) => <div>
        <p><b>Gửi đơn: </b>{ObjectPath.get(record, "CreatedAt.Pretty")}</p>
        <p><b>Giao việc: </b>{ObjectPath.get(record, "Task.AssignedAt.Pretty")}</p>
        <p><b>Cập nhật: </b>{ObjectPath.get(record, "UpdatedAt.Pretty")}</p>
      </div>
    }, {
      title: 'Trạng thái',
      dataIndex: '',
      key: 'StatusCode',
      render: (text, record, index) => <StatusTag value={ObjectPath.get(record, "TasksOrdersGroupStatus")}/>
    }, {
      title: 'Người nhận/Ghi chú',
      dataIndex: '',
      key: 'DeliveryNote',
      render: (text, record, index) => <span>{ObjectPath.get(record, "Note")}
        - {ObjectPath.get(record, "Note")}</span>
    },{
      title: 'Hub',
      dataIndex: '',
      key: 'bill',
      render: (text, record, index) => <StatusToolTip value={ObjectPath.get(record, "Task.Hub")}/>
    }];

    return (
      <PageHeaderLayout title="Báo cáo sản lượng">
        <ContentHolder>
          <TaskOrderTableControl/>

          <div style={{marginTop: 20}} className={"standardTable"}>
            <TotalRecord total={pagination.total} name={"đơn hàng"}/>
            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={(record, index) => index}
                pagination={pagination}
                onChange={this.props.TaskOrder.handleTableChange}
              />
            </Spin>
          </div>

        </ContentHolder>

      </PageHeaderLayout>
    )
  }

}


