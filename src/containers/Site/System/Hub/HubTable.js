import React, {Component} from 'react';
import {Spin, Table, Tag} from 'antd';
import HubTableControl from "./HubTableControl";
import {getCurrentSite} from "../../../../helpers/utility";
import ObjectPath from "object-path";
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import TotalRecord from '../../../../components/TotalRecord';
import ContentHolder from '../../../../components/utility/ContentHolder';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
@inject(Keys.hubTable)
@observer
export default class HubTable extends Component {

  componentDidMount() {
    this.props.hubTable.reload();
  }
  componentWillUnmount() {
    this.props.hubTable.clear();
  }

  render() {
    let {dataSource, fetching} = this.props.hubTable;

    let columns = [{
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
    }, {
      title: 'Tên điểm gửi hàng',
      dataIndex: 'Name',
      key: 'Name',
      render: (text, record, index) => <a>{text}</a>,
      sorter: true
    }, {
      title: 'Mã điểm gửi hàng',
      dataIndex: 'Code',
      key: 'Code',
    }, {
      title: 'Địa chỉ',
      dataIndex: 'City',
      key: 'City',
      render: (text, record, index) => <div>
        <p>Tỉnh/thành: {ObjectPath.get(record, "City.Name")}</p>
        <p>Quận/huyện: {ObjectPath.get(record, "District.Name")}</p>
        <p>Địa chỉ: {ObjectPath.get(record, "Address")}</p>
      </div>
    }];

    if (getCurrentSite() !== 'KH') {
      columns.push({
        title: 'Public/Private',
        dataIndex: 'Accessibility',
        key: 'Accessibility',
        render: (text, record, index) => <span>{ObjectPath.get(record, "Accessibility.Name")}</span>
      });
    }

    columns.push({
      title: 'Trạng thái',
      dataIndex: 'State',
      key: 'state',
      render: (text, record, index) =>
        <Tag color={text && text.Code && text.Code.toUpperCase() === 'ACTIVE' ? '#87d068' : '#f50'}>
          {text && text.Name}
        </Tag>
    });

    return (
      <PageHeaderLayout title="Danh sách điểm gửi hàng">
        <ContentHolder>

          <HubTableControl
            handleSubmit={this.props.hubTable.onFilter}
          />
          <div style={{marginTop: 20}}>
            <div className={"standardTable"}>
              <TotalRecord total={this.props.hubTable.pagination.total} name={"điểm gửi hàng"}/>
              <Spin spinning={fetching}>
                <Table
                  dataSource={dataSource.slice()}
                  columns={columns}
                  rowKey={record => record.ID}
                  pagination={this.props.hubTable.pagination}
                  onChange={this.props.hubTable.handleTableChange}
                />
              </Spin>
            </div>
          </div>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}

