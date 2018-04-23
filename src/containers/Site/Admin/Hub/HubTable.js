import React, {Component} from 'react';
import ObjectPath from 'object-path';

import {Button, Col, Dropdown, Icon, Menu, Row, Spin, Switch, Table, Tag} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import './Style.css';
import HubTableControl from "./HubTableControl";
import Permission from "../../../../permissions/index";
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';

import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import TotalRecord from '../../../../components/TotalRecord/index';
import HubForm from './HubForm';

@inject(Keys.hubTable)
@observer
export default class HubTable extends Component {

  handleChange = (id, checked) => {
    this.props.hubTable.active(id, checked);
  };

  componentDidMount() {
    this.props.hubTable.reload();
  }

  componentWillUnmount() {
    this.props.hubTable.clear();
  }

  handleClickMenu = (id, {item, key, keyPath}) => {
    console.log("handleClickMenu", key);
    switch (key) {
      case 'edit':
        this.props.hubTable.showUpdateModal(id);
        break;
      default:
        return;
    }
  };

  render() {
    let {dataSource, fetching} = this.props.hubTable;
    // let {activeData, deactiveData} = this.props;

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
    }, {
      title: 'Public/Private',
      dataIndex: 'Accessibility',
      key: 'Accessibility',
      render: (text, record, index) => <span>{ObjectPath.get(record, "Accessibility.Name")}</span>
    }, {
      title: 'Trạng thái',
      dataIndex: 'State',
      key: 'state',
      render: (text, record, index) => <Tag
        color={text && text.Code && text.Code.toUpperCase() === 'ACTIVE' ? '#87d068' : '#f50'}>{text && text.Name}</Tag>
    }];
    if (Permission.allowUpdateStateHub()) {
      columns.push({
        title: 'Kích hoạt',
        dataIndex: '',
        key: 'active',
        render: (text, record, index) =>
          <Spin spinning={this.props.hubTable.isFetchingRowID === record.ID}>
            <Switch
              unCheckedChildren={<Icon type="lock"/>}
              onChange={(checked) => this.handleChange(record.ID, checked)}
              checked={ObjectPath.get(record, 'State.Code', "").toUpperCase() === 'ACTIVE'}
            />
          </Spin>
      })
    }
    if (Permission.allowUpdateHub()) {
      columns.push({
        title: '',
        dataIndex: '',
        key: 'action',
        render: (text, record, index) => {
          const menu = (
            <Menu onClick={(e) => this.handleClickMenu(record.ID, e)}>
              <Menu.Item key="edit">
                <Icon type="edit"/> Chỉnh sửa
              </Menu.Item>
            </Menu>
          );

          return (
            <Dropdown overlay={menu} trigger={['click']}>
              <Button
                icon="ellipsis"
                size="small"
              >
                Hành động
              </Button>
            </Dropdown>
          )
        }
      })
    }

    return (
      <PageHeaderLayout title="Danh sách điểm gửi hàng">
        <HubForm/>
        <ContentHolder>
          <Row>
            <Col sm={18} xs={24}>
              <HubTableControl/>
            </Col>
            <Col sm={6} xs={24} style={{textAlign: 'right'}}>
              {Permission.allowCreateHub() ?
                <Button
                  icon="plus"
                  type="primary"
                  onClick={this.props.hubTable.showCreateModal}
                >Thêm điểm gửi hàng mới</Button>
                : null}
            </Col>
          </Row>
          <div style={{marginTop: 16}}>
            <TotalRecord total={this.props.hubTable.pagination.total} name={"điểm gửi hàng"}/>
            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.ID}
                pagination={this.props.hubTable.pagination}
                onChange={this.props.hubTable.handleTableChange}
                className={'hub-table'}
              />
            </Spin>
          </div>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}
