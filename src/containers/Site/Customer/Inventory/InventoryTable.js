import React, {Component} from 'react';
import {Button, Dropdown, Icon, Menu, Spin, Table, Tag} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import InventoryTableControl from "./InventoryTableControl";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import TotalRecord from "../../../../components/TotalRecord/index";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import InventoryForm from "./InventoryForm";
import './Style.css';

@inject(Keys.myInventory)
@observer
export default class InventoryTable extends Component {


  constructor(props) {
    super(props);
    this.myInventory = props.myInventory;
  }

  componentDidMount() {
    this.myInventory.reload();
  };

  componentWillUnmount() {
    this.myInventory.clear();
  }

  handleClickMenu = (id, {item, key, keyPath}) => {
    switch (key) {
      case 'edit':
        this.myInventory.showUpdateModal(id);
        break;
      default:
        return;
    }
  };
  handleTableChange = (pagination, filters, sort) => {
    this.myInventory.handleTableChange(pagination, filters, sort);
  };

  onSuccessCreateMyInventory = () => {
    this.myInventory.reload();
  };


  render() {
    let {dataSource, fetching, pagination} = this.myInventory;

    let columns = [{
      title: 'ID',
      width: 50,
      dataIndex: 'ID',
      key: 'ID',
      render: (text, record, index) => <span>{text}</span>
    },
      {
        title: 'Mã Kho',
        dataIndex: '',
        width: 50,
        key: 'Code',
        render: (text, record, index) => {
          return (
            <span><Tag color={'#87d068'}>{text.Code}</Tag></span>
          )
        },
      },
      {
        title: 'Tên',
        dataIndex: '',
        width: 200,
        key: 'Name',
        render: (text, record, index) => {
          return (
            <div>
              <span>{text.Name}</span>
              {record.IsDefault === true && <Tag color={'#87d068'}>Kho mặc định</Tag>}
            </div>
          )
        },
        sorter: true
      }, {
        title: 'Điện thoại',
        dataIndex: 'Phone',
        width: 100,
        key: 'Phone',
        render: (text, record, index) => <span>{text}</span>
      }, {
        title: 'Địa chỉ',
        dataIndex: 'Address',
        key: 'Address',
        render: (text, record, index) => <span>{text}</span>
        // }, {
        //     title: 'Điểm gửi hàng',
        //     dataIndex: 'Hub',
        //     key: 'Hub',
        //     render: (text, record, index) => <span>{text && text.DisplayName ? text.DisplayName : ''}</span>
      }, {
        title: 'Trạng thái',
        dataIndex: 'State',
        width: 150,
        key: 'State',
        render: (text, record, index) => <Tag color={text.Value === 1 ? '#87d068' : '#f50'}>{text.Name}</Tag>
      }, {
        title: 'Hành động',
        dataIndex: '',
        width: 120,
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
              >Hành động</Button>
            </Dropdown>
          );
        }
      }];

    return (
      <PageHeaderLayout title="Danh sách kho hàng">
        <ContentHolder>
          <InventoryTableControl/>
          <InventoryForm onSuccess={this.onSuccessCreateMyInventory}/>
          <div style={{marginTop: 20}}>
            <div className={"standardTable"}>
              <TotalRecord total={this.myInventory.pagination.total} name={"kho hàng"}/>
              <Spin spinning={fetching}>
                <Table
                  dataSource={dataSource.slice()}
                  columns={columns}
                  rowKey={record => record.ID}
                  pagination={pagination}
                  onChange={this.handleTableChange}
                />
              </Spin>
            </div>
          </div>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }
}

