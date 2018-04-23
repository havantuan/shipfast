import React from 'react';
import {Modal, Table} from 'antd';
import ObjectPath from "object-path";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

@inject(Keys.staff, Keys.role)
@observer
export default class EditRole extends React.Component {

  constructor(props) {
    super(props);
    this.staff = props.staff;
    this.role = props.role;
  }

  componentDidMount() {
    this.role.fetch();
  }

  handleSubmit = () => {
    let staffID = ObjectPath.get(this.staff, 'isFetchingRowID');
    this.role.grantRoleByStaffID(staffID);
  };

  onSelectChange = (selectedRowKeys) => {
    this.role.onSelectedChange(selectedRowKeys);
  };

  render() {
    let {selectedRowKeys, dataSource} = this.role;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const columns = [{
      title: 'Tên vai trò',
      dataIndex: 'Name',
      key: 'Name',
      render: (text, record, index) => <a>{text}</a>,
    }, {
      title: 'Mã vai trò',
      dataIndex: 'Code',
      key: 'Code',
    }];

    return (
      <Modal
        title="Danh sách vai trò"
        visible={this.staff.isShowRoleModal}
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