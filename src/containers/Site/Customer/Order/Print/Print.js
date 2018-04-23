import React, {Component} from 'react';
import {Icon, Spin, Table, Tag} from 'antd';
import ContentHolder from '../../../../../components/utility/ContentHolder';
import StatusTag from "../../../Common/StatusTag/StatusTag";
import PrintControl from "./PrintControl";
import PageLayout from "../../../../../layouts/PageLayout";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../../stores/index';
import ObjectPath from 'object-path';
import {isObservableArray} from 'mobx';

@inject(Keys.myLabelOrder, Keys.detailOrder)
@observer
export default class Print extends Component {

  componentWillUnmount() {
    this.props.myLabelOrder.clear();
  }

  render() {
    const {dataSource, fetching} = this.props.myLabelOrder;
    const columns = [{
      title: 'Mã đơn hàng',
      dataIndex: 'Code',
      key: 'Code',
      width: '20%',
      render: (text, record, index) =>
        <div>
          <p>
            <Tag color={"blue"} onClick={(e) => this.props.detailOrder.showRootModal(record.Code)}>
              <span>{record.Code}</span>
            </Tag>
          </p>
          <div>
            <StatusTag value={record.StatusCode ? record.StatusCode : 0}/>
          </div>
          <div>
            Tạo: {ObjectPath.get(record, 'CreatedAt.Pretty')}
          </div>
        </div>
    }, {
      title: 'Nhân viên',
      dataIndex: 'Staff',
      key: 'staff',
      render: (text, record, index) =>
        <div>
          {
            text &&
            <div>
              <div><Icon type="user" style={{color: '#000000'}}/> {text.Name}</div>
              <div><Icon type="phone" style={{color: '#000000'}}/> {text.Phone}</div>
            </div>
          }
        </div>
    }, {
      title: 'Người gửi',
      dataIndex: 'Sender',
      key: 'Sender',
      width: '30%',
      render: (text, record, index) =>
        <div>
          {
            text &&
            <div>
              <div><Icon type="user" style={{color: '#000000'}}/> {text.Name}</div>
              <div><Icon type="phone" style={{color: '#000000'}}/> {text.Phone}</div>
              <div><Icon type="home" style={{color: '#000000'}}/><b>Thu: </b> {text.Address}</div>
            </div>
          }
        </div>
    }, {
      title: 'Người nhận',
      dataIndex: 'Receiver',
      key: 'receiver',
      width: '30%',
      render: (text, record, index) =>
        <div>
          {
            text &&
            <div>
              <div><Icon type="user" style={{color: '#000000'}}/> {text.Name}</div>
              <div><Icon type="phone" style={{color: '#000000'}}/> {text.Phone}</div>
              <div><Icon type="home" style={{color: '#000000'}}/><b>Phát: </b> {text.Address}</div>
            </div>
          }
        </div>
    }];

    const rowSelection = {
      selectedRowKeys: this.props.myLabelOrder.code,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.props.myLabelOrder.changeRowKeys(selectedRowKeys);
      }
    };

    return (
      <PageLayout>
        <ContentHolder>
          <PrintControl/>

          <div style={{marginTop: 16}}>
            <Spin spinning={fetching}>
              <Table
                dataSource={isObservableArray(dataSource) ? dataSource.slice() : []}
                columns={columns}
                rowSelection={rowSelection}
                rowKey={record => record.Code}
                pagination={this.props.myLabelOrder.pagination}
                onChange={this.props.myLabelOrder.handleTableChange}
              />
            </Spin>
          </div>
        </ContentHolder>
      </PageLayout>
    )
  }

}

