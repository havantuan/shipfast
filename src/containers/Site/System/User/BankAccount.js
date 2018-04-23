import React, {Component} from 'react';
import {Button, Dropdown, Form, Icon, Menu, Modal, Spin, Switch, Table} from 'antd';
import BankAccountModel from './BankAccountModel';

import ObjectPath from 'object-path';
import './Style.css';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';

@Form.create()
@inject(Keys.myBank)
@observer
export default class BankAccount extends Component {

  handleActive = (id, checked) => {
    this.myBank.active(id, checked)
  };
  updateData = (record) => {
    this.myBank.showUpdateModal(record)
  }

  constructor(props) {
    super(props);
    this.myBank = props.myBank
  }

  componentDidMount() {
    this.myBank.reload()
  };


  render() {
    let columns = [
      {
        title: '#',
        dataIndex: '',
        key: 'index',
        render: (text, record, index) => <span>{index + 1}</span>
      },
      {
        title: 'Tài khoản',
        dataIndex: 'Name',
        key: 'Name',
        render: (text, record, index) => <div>
          <p><b>Số tài khoản:</b> {ObjectPath.get(record, "AccountNumber")}</p>
          <p><b>Chủ tài khoản</b>: {ObjectPath.get(record, "Owner")}</p>
          <p><b>Ngân hàng</b>: {ObjectPath.get(record, "Bank.ShortenName")}</p>
          <p><b>Chi nhánh</b>: {ObjectPath.get(record, "Branch")}</p>
        </div>
      }, {
        title: 'Trạng thái',
        dataIndex: 'State',
        key: 'State',
        render: (text, record, index) => <span>{ObjectPath.get(record, "State.Name")}</span>
      },
      {
        title: 'Kích hoạt',
        dataIndex: '',
        key: 'active',
        render: (text, record, index) =>
          <Spin
            spinning={this.myBank.isFetchingRowID === record.ID}>
            <Switch
              unCheckedChildren={<Icon type="lock"/>}
              onChange={(checked) => this.handleActive(record.ID, checked)}
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

    const {dataSource, fetching} = this.myBank;
    console.log('%c dataBank dataaaaa', 'color: #00b33c', dataSource);
    return (
      <div>
        <div style={{textAlign: 'right', margin: '10px 0'}}>
          <Button
            type="primary"
            onClick={this.myBank.showModal}
          >
            Thêm mới tài khoản ngân hàng
          </Button>
        </div>
        <Modal
          width={800}
          className="modal"
          visible={this.myBank.isShowModal}
          title={this.myBank.currentRow ? "Cập nhật tài khoản" : "Thêm mới tài khoản"}
          onOk={this.myBank.onOkModal}
          onCancel={this.myBank.onCancelModal}
          footer={[]}
        >
          <BankAccountModel dataUpdate={this.myBank.currentRow}/>
        </Modal>
        <Spin spinning={fetching}>
          <Table
            dataSource={dataSource.slice()}
            columns={columns}
            rowKey={(record, index) => index}
            className={'hub-table'}
          />
        </Spin>

      </div>
    )
  }
}
