import React from 'react';
import {Modal, Button, Table, Tag, Spin} from 'antd';
import {inject, observer} from 'mobx-react';
import {isObservableArray} from 'mobx';
import {Keys} from "../../../../stores/index";

@inject(Keys.inventoryStore)
@observer
export default class InventoryModal extends React.PureComponent {

  constructor(props) {
    super(props);
    this.inventoryStore = props.inventoryStore;
  }

  handleOK = () => {
    this.props.onOK();
    this.inventoryStore.clear();
  };

  render() {
    const {dataSource, pagination, fetching} = this.inventoryStore;

    let columns = [{
      title: 'ID',
      width: 50,
      dataIndex: 'ID',
      key: 'ID'
    }, {
      title: 'Mã Kho',
      dataIndex: '',
      width: 50,
      key: 'Code',
      render: (text, record, index) => <Tag color={'#87d068'}>{text.Code}</Tag>
    }, {
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
      }
    }, {
      title: 'Điện thoại',
      dataIndex: 'Phone',
      width: 100,
      key: 'Phone'
    }, {
      title: 'Địa chỉ',
      dataIndex: 'Address',
      key: 'Address'
    }, {
      title: 'Trạng thái',
      dataIndex: 'State',
      width: 150,
      key: 'State',
      render: (text, record, index) => <Tag color={text.Value === 1 ? '#87d068' : '#f50'}>{text.Name}</Tag>
    }];

    return (
      <Modal
        width={'1000px'}
        title="Thông tin kho hàng"
        visible={this.props.visible}
        onOk={this.handleOK}
        onCancel={this.handleOK}
        footer={[
          <Button key="back" onClick={this.handleOK}>OK</Button>
        ]}
      >
        <Spin spinning={fetching}>
          <Table
            dataSource={isObservableArray(dataSource) ? dataSource.slice() : (dataSource || [])}
            columns={columns}
            rowKey={record => record.ID}
            pagination={pagination}
            onChange={this.inventoryStore.handleTableChange}
          />
        </Spin>
      </Modal>
    )
  }

}