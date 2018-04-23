import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Icon, Spin, Table, Tag} from 'antd';
import ContentHolder from '../../../../../../components/utility/ContentHolder';
import StatusTag from "../../../../Common/StatusTag/StatusTag";
import PrintTaskControl from "./PrintTaskControl";
import routerConfig from "../../../../../../config/router";
import PageLayout from "../../../../../../layouts/PageLayout";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../../../stores/index';
import ObjectPath from 'object-path';
import StatusToolTip from '../../../../Common/StatusToolTip/StatusToolTip';

@inject(Keys.printTasks, Keys.detailOrder)
@observer
export default class PrintTasksTable extends Component {

  constructor(props) {
    super(props);
    this.printTasks = props.printTasks;
  }

  componentWillUnmount() {
    this.printTasks.clear();
  }

  render() {
    const {dataSource, fetching} = this.printTasks;

    const columns = [{
      title: 'Công việc',
      key: 'code',
      width: 80,
      render: (text, record, index) =>
        <div>
          <Link to={routerConfig.detailTask.replace(":code", record.Code)}>
            {record.Code}
          </Link>
        </div>
    }, {
      title: 'Loại',
      key: 'type',
      width: 70,
      render: (text, record, index) =>
        <div>
          {ObjectPath.get(record, 'Type.Name', '')}
        </div>
    }, {
      title: 'Trạng thái',
      key: 'status',
      render: (text, record, index) =>
        <div>
          <StatusTag value={record.StatusCode ? record.StatusCode : 0}/>
        </div>
    }, {
      title: 'Điểm gửi hàng',
      dataIndex: 'Hub',
      key: 'hub',
      width: 150,
      render: (text, record, index) => <StatusToolTip value={record.Hub}/>
    }, {
      title: 'Khách hàng',
      key: 'customer',
      render: (text, record, index) =>
        <div>
          <div><Icon type="user" style={{color: '#000'}}/> {ObjectPath.get(record, 'CustomerName')} , <Icon
            type="phone" style={{color: '#000'}}/> {ObjectPath.get(record, 'CustomerPhone')}</div>
          <div><Icon type="home" style={{color: '#000'}}/> {ObjectPath.get(record, 'Address')}</div>
        </div>
    }, {
      title: 'Đơn hàng',
      key: 'orders',
      render: (text, record, index) =>
        <div>
          {
            ObjectPath.get(record, 'Entries', []).length > 0 &&
            record.Entries.map((val, idx) => {
              if (ObjectPath.has(val, 'Order.Code')) {
                return (
                  <Tag
                    key={idx}
                    color={'purple'}
                    onClick={this.props.detailOrder.onShowRootModal(val.Order.Code)}
                  >{val.Order.Code}</Tag>
                )
              }
              else return <span/>
            })
          }
        </div>
    }];

    const rowSelection = {
      selectedRowKeys: this.printTasks.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.printTasks.changeRowKeys(selectedRowKeys);
      }
    };

    return (
      <PageLayout>
        <ContentHolder>
          <PrintTaskControl/>

          <div style={{marginTop: 16}}>
            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowSelection={rowSelection}
                rowKey={record => record.Code}
                pagination={this.printTasks.pagination}
                onChange={this.printTasks.handleTableChange}
              />
            </Spin>
          </div>
        </ContentHolder>
      </PageLayout>
    )
  }

}

