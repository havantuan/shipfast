import React, {Component} from 'react';
import ObjectPath from 'object-path';
import {Button, Dropdown, Icon, Menu, Spin, Switch, Table, Tag, Tooltip} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import SellerListControl from "./SellerListControl";
import Permission from "../../../../permissions/index";
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import TotalRecord from '../../../../components/TotalRecord/index';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import SellerForm from "./SellerForm";
import {isObservableArray} from 'mobx';
import InventoryModal from "./InventoryModal";

@inject(Keys.customerTable, Keys.inventoryStore)
@observer
export default class SellerList extends Component {

  handleChange = (id, checked) => {
    this.props.customerTable.active(id, checked);
  };

  componentDidMount() {
    this.props.customerTable.reload();
  }

  componentWillUnmount() {
    this.props.customerTable.clear();
  }

  handleClickMenu = (id, {item, key, keyPath}) => {
    switch (key) {
      case 'edit':
        this.props.customerTable.showUpdateModal(id);
        break;
      case 'inventory':
        this.props.customerTable.showInventoryModal(id);
        this.props.inventoryStore.onFilter({UserID: id});
        break;
      default:
        return;
    }
  };

  render() {
    let {dataSource, fetching, pagination} = this.props.customerTable;
    let counter = pagination.pageSize * (pagination.current - 1);
    const columns = [{
      title: '#',
      dataIndex: '',
      key: 'index',
      render: (text, record, index) => <span>{index + 1 + counter}</span>
    }, {
      title: 'Mã',
      dataIndex: 'Code',
      key: 'ID',
      render: (text, record, index) => <div>
        <div className={'tagList'}>
          <div>
            <Tag color="#8797CF">{record.CustomerCode}</Tag>
          </div>
          {record.TookCare === true ? <div><Tag color={'#2db7f5'}>Đã chăm sóc</Tag></div> : ''}
        </div>
      </div>,
    }, {
      title: 'Thông tin',
      dataIndex: 'Name',
      key: 'Name',
      render: (text, record, index) => <div>
        <p>{ObjectPath.get(record, "Name")}</p>
        <p>{ObjectPath.get(record, "Phone")}</p>
        <p>{ObjectPath.get(record, "Email")}</p>
      </div>
    },{
      title: 'Tài khoản',
      dataIndex: 'AccountBank',
      key: 'AccountIndex',
      render: (text, record, index) => <div>{ObjectPath.get(record, "BankAccounts", []).map((val, index) => <Tooltip title={`${val.Owner} - ${val.Branch}`} key={index}><Tag color={"blue"}>{val.AccountNumber} - {val.Bank.ShortenName}</Tag></Tooltip>)}</div>
    }, {
      title: 'Loại',
      dataIndex: 'KHType',
      key: 'KHType',
      width: 80,
      render: (text, record, index) => <span>{ObjectPath.get(record, "KHType.Name")}</span>
    }, {
      title: 'Ngày Tạo',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
      width: 140,
      render: (text, record, index) => <span>{ObjectPath.get(record, "CreatedAt.Pretty")}</span>
    }, {
      title: 'Trạng thái',
      dataIndex: 'State',
      key: 'state',
      render: (text, record, index) => <Tag color={text.Value === 1 ? '#87d068' : '#f50'}>{text.Name}</Tag>
    }];

    if (Permission.allowUpdateStateCustomer()) {
      columns.push({
        title: 'Kích hoạt',
        width: 80,
        dataIndex: '',
        key: 'active',
        render: (text, record, index) =>
          <Spin spinning={this.props.customerTable.isFetchingRowID === record.ID}>
            <Switch
              unCheckedChildren={<Icon type="lock"/>}
              onChange={(checked) => this.handleChange(record.ID, checked)}
              checked={ObjectPath.get(record, 'State.Code', "").toUpperCase() === 'ACTIVE'}
            />
          </Spin>
      })
    }

    columns.push({
      title: 'Xử lý',
      dataIndex: '',
      key: 'action',
      render: (text, record, index) => {
        const menu = (
          <Menu onClick={(e) => this.handleClickMenu(record.ID, e)}>
            {
              Permission.allowUpdateCustomer() &&
              <Menu.Item key="edit">
                <Icon type="edit"/> Chỉnh sửa
              </Menu.Item>
            }
            <Menu.Item key="inventory">
              <Icon type="hdd"/> Kho hàng
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button
              icon="ellipsis"
              size={'small'}
            >
              Hành động
            </Button>
          </Dropdown>
        );
      }
    });

    return (
      <PageHeaderLayout title="Khách hàng">
        <SellerForm/>

        <InventoryModal
          visible={this.props.customerTable.isShowInventoryModal}
          onOK={this.props.customerTable.cancelInventoryModal}
        />

        <ContentHolder>
          <SellerListControl/>

          <div style={{marginTop: 20}} className={"standardTable"}>
            <TotalRecord total={this.props.customerTable.pagination.total} name={"khách hàng"}/>

            <Spin spinning={fetching || false}>
              <Table
                dataSource={isObservableArray(dataSource) ? dataSource.slice() : []}
                columns={columns}
                rowKey={(record, index) => index}
                pagination={this.props.customerTable.pagination}
                onChange={this.props.customerTable.handleTableChange}
              />
            </Spin>
          </div>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}
