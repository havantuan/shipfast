import React from 'react';

import {Modal, Table} from 'antd';
import ObjectPath from "object-path";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

@inject(Keys.role, Keys.permission)
@observer
export default class EditPermission extends React.Component {

  constructor(props) {
    super(props);
    this.role = props.role;
    this.permission = props.permission;
  }

  componentDidMount() {
    this.permission.fetch();
  }

  handleSubmit = () => {
    let roleID = ObjectPath.get(this.role, 'isFetchingRowID');
    this.permission.grantPermissionByRoleID(roleID);
  };

  onSelectChange = (selectedRowKeys) => {
    this.permission.onSelectedChange(selectedRowKeys);
  };

  render() {
    const {dataSource = [], selectedRowKeys} = this.permission;
    const rowSelection = {
      selectedRowKeys: selectedRowKeys ? selectedRowKeys.slice() : [],
      onChange: this.onSelectChange,
    };

    const columns = [{
      title: 'Tên quyền',
      dataIndex: 'Name',
      key: 'Name',
      render: (text, record, index) => <a>{text}</a>,
    }, {
      title: 'Code',
      dataIndex: 'Code',
      key: 'Code',
    }];

    return (
      <Modal
        title="Danh sách quyền"
        visible={this.role.isShowModal}
        onOk={this.handleSubmit}
        onCancel={this.role.cancelModal}
      >
        <Table
          scroll={{y: 700}}
          size={'small'}
          pagination={false}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource.slice()}
          rowKey={record => record.ID}
        />
      </Modal>
    );
  }
}