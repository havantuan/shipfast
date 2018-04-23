import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Row, Spin, Table, Tag} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import './Style.css';
import CrossTableControl from "./CrossTableControl";
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import routerConfig from "../../../../config/router";
import TotalRecord from '../../../../components/TotalRecord/index';
import ObjectPath from "object-path";
import {numberFormat} from "../../../../helpers/utility";
import StatusTag from "../../Common/StatusTag/StatusTag";

@inject(Keys.crossTable, Keys.router)
@observer
export default class crossTable extends Component {

  componentDidMount() {
    this.props.crossTable.reload();
  }

  componentWillUnmount() {
    this.props.crossTable.clear();
  }

  render() {
    const rowSelection = {
      selectedRowKeys: this.props.crossTable.listCode,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.props.crossTable.changeRowKeys(selectedRowKeys);
      }
    };
    let {dataSource, fetching} = this.props.crossTable;
    // let {activeData, deactiveData} = this.props;

    let columns = [{
      title: 'Code',
      dataIndex: 'Code',
      key: 'Code',
      render: (text, record, index) =>
          <Tag color={"blue"}>
            <span><Link to={routerConfig.crossDetail.replace(":code", record.Code)}>{record.Code}</Link> </span>
          </Tag>
    }, {
      title: 'Khách hàng',
      dataIndex: 'Customer',
      key: 'Customer',
      render: (index, record, text) => <div>
        <Tag color="#9f9eef">{ObjectPath.get(record, "Customer.CustomerCode")}</Tag>
        <p><b>Khách hàng: </b>{ObjectPath.get(record, "Customer.Name")}</p>
        <p><b>Điện thoại: </b>{ObjectPath.get(record, "Customer.Phone")}</p>
        <p>{ObjectPath.get(record, "Customer.TookCare") ? `Chăm sóc` : ''}</p>
      </div>
    }, {
      title: 'Số lượng',
      dataIndex: 'TotalOrders',
      key: 'TotalOrders',
      render: (text, record, index) => <div>
        <p><b>Phát: </b> {ObjectPath.get(record, "SuccessfulCount")}</p>
        <p><b>Hoàn: </b>{ObjectPath.get(record, "ReturnCount")}</p>
      </div>,
    }, {
      title: 'Số tiền',
      dataIndex: 'City',
      key: 'City',
      render: (text, record, index) => <div>
        {
          record &&
          <div>
            <p><b>Thu KH: </b> {numberFormat(ObjectPath.get(record, "TotalCod"))} đ </p>
            <p><b>Phí: </b> {numberFormat(ObjectPath.get(record, "TotalCosts"))} đ </p>
            <p>
              <b>Khuyến mãi: </b> {numberFormat(ObjectPath.get(record, "TotalDiscount"))}
              {
                (record.DiscountByPolicy && +record.DiscountByPolicy > 0) ? ` + ${numberFormat(record.DiscountByPolicy)} đ` : ''
              }
            </p>
          </div>
        }
      </div>
    }, {
      title: 'Thực nhận',
      dataIndex: 'NetAmount',
      key: 'NetAmount',
      render: (text, record, index) => <div>{numberFormat(ObjectPath.get(record, "NetAmount"))} đ
      </div>
    }, {
      title: 'Trạng thái',
      dataIndex: 'StatusCode',
      key: 'StatusCode',
      render: (text, record, index) => <StatusTag value={ObjectPath.get(record, "StatusCode")}/>
    }, {
      title: 'Thời gian tạo',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
      width: '15%',
      render: (text, record, index) => <div>{ObjectPath.get(record, "CreatedAt.Pretty")}
      </div>
    }];

    return (
      <PageHeaderLayout title="Danh sách đối soát">
        <ContentHolder>
          <CrossTableControl/>

          <div style={{marginTop: 16}}>
            <TotalRecord total={this.props.crossTable.pagination.total} name={"đối soát"}/>
            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.Code}
                rowSelection={rowSelection}
                pagination={this.props.crossTable.pagination}
                onChange={this.props.crossTable.handleTableChange}
                className={'crossTable-table'}
              />
            </Spin>
          </div>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}


