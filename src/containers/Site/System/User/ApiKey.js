import React, {Component} from 'react';
import {Button, Dropdown, Form, Icon, Menu, Modal, Popconfirm, Spin, Switch, Table} from 'antd';
import ApiKeyModel from './ApiKeyModel';
import ObjectPath from 'object-path';
import './Style.css';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';

@Form.create()
@inject(Keys.myApiKey)
@observer
export default class ApiKey extends Component {
  updateData = (record) => {
    this.myApiKey.showUpdateModal(record)
  }

  constructor(props) {
    super(props);
    this.myApiKey = props.myApiKey
  }

  componentDidMount() {
    this.myApiKey.reload();
  };

  render() {
    console.log("this.myApiKey", this.myApiKey)
    let counter = this.myApiKey.pagination.pageSize * (this.myApiKey.pagination.current - 1);
    let columns = [
      {
        title: '#',
        dataIndex: '',
        key: 'index',
        render: (text, record, index) => <span>{index + 1 + counter}</span>
      }, {
        title: 'Trạng thái',
        dataIndex: 'State',
        key: 'State',
        render: (text, record, index) => <span>{ObjectPath.get(record, "State.Name")}</span>
      }, {
        title: 'Tên',
        dataIndex: 'Name',
        key: 'Name',
        render: (text, record, index) => <a>{text}</a>

      }, {
        title: 'Mô tả',
        dataIndex: 'Description',
        key: 'Description',
        render: (text, record, index) => <span>{ObjectPath.get(record, "Description")}</span>
      }, {
        title: 'Thời gian khởi tạo',
        dataIndex: 'CreatedAt',
        key: 'CreatedAt',
        render: (text, record, index) => <span>{ObjectPath.get(record, "CreatedAt.Pretty")}</span>
      },
      {
        title: 'Kích hoạt',
        dataIndex: '',
        key: 'active',
        render: (text, record, index) =>
          <Spin
            spinning={this.myApiKey.isFetchingRowID === record.AccessKey}>
            <Switch
              unCheckedChildren={<Icon type="lock"/>}
              onChange={(checked) => this.myApiKey.active(record.AccessKey, checked)}
              defaultChecked={ObjectPath.get(record, 'State.Code') === 'Active'}
            />
          </Spin>
      },
      {
        title: '',
        dataIndex: '',
        key: 'action',
        render: (text, record, index) => {
          const menu = (
            <Menu>
              <Menu.Item key="edit">
                <div onClick={() => this.updateData(record)}>
                  <Icon type="edit"/> Chỉnh sửa
                </div>
              </Menu.Item>
              <Menu.Item key="delete">
                <Popconfirm title="Bạn có chắc chắn muốn xóa API này không?"
                            onConfirm={() => this.myApiKey.delete(record.AccessKey)} okText="Yes"
                            cancelText="No">
                  <a href="#">
                    <Icon type="close"/> Xoá
                  </a>
                </Popconfirm>
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
      }
    ];

    const {dataSource, fetching} = this.myApiKey;
    return (
      <div>
        <div style={{textAlign: 'right', margin: '10px 0'}}>
          <Button
            type="primary"
            onClick={this.myApiKey.showModal}
          >
            Thêm mới Api
          </Button>
        </div>
        <Modal
          width={800}
          className="modal"
          visible={this.myApiKey.isShowModal}
          title={this.myApiKey.currentRow ? "Cập nhật API" : "Thêm mới API"}
          onOk={this.myApiKey.onOkModal}
          onCancel={this.myApiKey.onCancelModal}
          footer={[]}
        >
          <ApiKeyModel dataUpdate={this.myApiKey.currentRow}/>
        </Modal>
        <Spin spinning={fetching}>
          <Table
            dataSource={dataSource.slice()}
            columns={columns}
            rowKey={(record, index) => index}
            onChange={this.myApiKey.handleTableChange}
            pagination={this.myApiKey.pagination}
          />
        </Spin>
      </div>

    )
  }
}
