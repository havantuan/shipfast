import React, {Component} from 'react';
import {Button, Spin, Table, Tag} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import EditPermission from "./EditPermission";
import Permission from "../../../../permissions/index";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

const NodeColumnTable = (data) => {
  return (
    <div className={"tagList"}>
      {data.data.map((el, index) => {
        return <Tag key={index} color="#87d068">{el.Name}</Tag>
      })}
    </div>
  )
};

@inject(Keys.role)
@observer
export default class RoleTable extends Component {

  constructor(props) {
    super(props);
    this.role = props.role;
  }

  componentWillUnmount() {
    this.role.clear();
  }

  componentDidMount() {
    this.role.fetch();
  }

  render() {
    let {dataSource = [], fetching} = this.role;
    const columns = [{
      key: 'stt',
      title: '#',
      dataIndex: '',
      render: (text, record, index) => <span>{index + 1}</span>
    }, {
      title: 'Vai trò',
      dataIndex: 'Role',
      key: 'role',
      render: (text, record, index) => {
        return (
          <div>
            <a>{record.Name ? record.Name : 'Role'}</a>
          </div>
        )
      }
    }, {
      key: 'code',
      title: 'Code',
      dataIndex: 'Code',
      render: (text, record, index) => <span>{text}</span>
    }, {
      width: 700,
      key: 'groupPermission',
      title: 'Nhóm quyền',
      dataIndex: 'Permissions',
      render: (text, record, index) => <NodeColumnTable data={text}/>
    }];
    if (Permission.allowGrantPermissionRole()) {
      columns.push({
        title: 'Hành động',
        key: 'action',
        render: (text, record, index) => {
          return (
            <Button
              type="primary"
              onClick={() => this.role.showModal(record)}
            >
              Chọn quyền
            </Button>
          )
        }
      })
    }
    return (
      <PageHeaderLayout
        title={'Phân quyền vai trò'}
      >
        <ContentHolder>
          <div style={{marginTop: 16}}>
            <Spin spinning={fetching}>
              <Table
                pagination={false}
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.ID}
              />
            </Spin>
          </div>

          <EditPermission/>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}
