import React from 'react';
import ObjectPath from "object-path"
import {Modal, Table} from 'antd';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

@inject(Keys.hub, Keys.staff)
@observer
export default class EditHub extends React.Component {

  constructor(props) {
    super(props);
    this.hub = props.hub;
    this.staff = props.staff;
  }

  componentDidMount() {
    this.hub.fetch(null, {pageSize: -1, current: 1});
  }

  handleSubmit = () => {
    let staffID = ObjectPath.get(this.staff, 'isFetchingRowID');
    this.hub.grantHubByStaffID(staffID);
  };

  onSelectChange = (selectedRowKeys) => {
    this.hub.onSelectedChange(selectedRowKeys);
  };

  render() {
    const {dataSource, selectedRowKeys} = this.hub;
    const rowSelection = {
      selectedRowKeys : selectedRowKeys ? selectedRowKeys.slice() : [],
      onChange: this.onSelectChange,
    };

    const columns = [{
      title: 'Điểm gửi hàng',
      dataIndex: 'Name',
      key: 'Name',
      width: '50%',
      render: (text, record, index) => <a>{text}</a>,
    }, {
      title: 'Mã điểm gửi hàng',
      dataIndex: 'Code',
      key: 'Code',
    }];

    return (
      <Modal
        title="Danh sách điểm gửi hàng"
        visible={this.staff.isShowHubModal}
        onOk={this.handleSubmit}
        onCancel={this.staff.closeModal}
      >
        <Table
          scroll={{y: 400}}
          size={'small'}
          pagination={false}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource.slice()}
          rowKey={(record, index) => record.ID}
        />
      </Modal>
    );
  }
}