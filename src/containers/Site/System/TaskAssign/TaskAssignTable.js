import React, {Component} from 'react';
import {Button, Spin, Table, Tag} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import basicStyle from '../../../../config/basicStyle';
import routerConfig from "../../../../config/router";
import TaskAssignTableControl from './TaskAssignTableControl';
import Permission from "../../../../permissions/index";
import ObjectPath from "object-path";
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import StatusToolTip from '../../Common/StatusToolTip/StatusToolTip';

@inject(Keys.assignConfirm, Keys.router)
@observer
export default class TaskAssignTable extends Component {

  printTask = (code) => {
    window.open(routerConfig.printTask.replace(":code", `${code}`));
  };

  constructor(props) {
    super(props);
    this.assignConfirm = props.assignConfirm;
  }

  componentDidMount() {
    this.assignConfirm.fetchFirst();
  }

  componentWillUnmount() {
    this.assignConfirm.clear();
  }

  render() {
    const {orangeButton} = basicStyle;
    let {dataSource, fetching, pagination} = this.assignConfirm;
    let counter = pagination.pageSize * (pagination.current - 1);

    let columns = [{
      title: '#',
      dataIndex: '',
      key: 'index',
      width: '30px',
      render: (text, record, index) => <span>{index + 1 + counter}</span>
    }, {
      title: 'Mã giao việc',
      dataIndex: 'Code',
      key: 'code',
      render: (text, record, index) => <div>
        <Tag color="purple">{text}</Tag>
      </div>
    }, {
      title: 'Thời gian tạo',
      dataIndex: 'Created',
      key: 'Created',
      render: (text, record, index) => <div>
        {ObjectPath.get(record.CreatedAt, "Pretty")}
      </div>
    }, {
      title: 'Hub',
      dataIndex: 'Hub',
      key: 'hub',
      render: (text, record, index) => <div>
        <StatusToolTip value={record.Hub}/>
      </div>
    }, {
      title: 'Nhân viên',
      dataIndex: 'Staff',
      key: 'staff',
      render: (text, record, index) => <div>
        <p> {ObjectPath.get(record.Staff, "Name")}</p>
        <p>{ObjectPath.get(record.Staff, "Phone")}</p>
      </div>
    }, {
      title: 'Người giao việc',
      dataIndex: 'assgin',
      key: 'assgin',
      render: (text, record, index) => <div>
        <p>{ObjectPath.get(record.AssignStaff, "Name")}</p>
        <p>{ObjectPath.get(record.AssignStaff, "Phone")}</p>
      </div>
    }, {
      title: 'Công việc',
      dataIndex: 'status',
      key: 'status',
      render: (text, record, index) => <div>
        <b>Hoàn: </b>{ObjectPath.get(record, "Returns")}
        <b> Thu: {ObjectPath.get(record, "Pickups")}</b><b> Phát: {ObjectPath.get(record, "Deliveries")}</b>

      </div>
    }];
    if (Permission.allowReadTask()) {
      columns.push({
        title: 'Hành động',
        dataIndex: '',
        key: 'print',
        render: (text, record, index) =>
          <Button
            style={orangeButton}
            size={'small'}
            icon={'printer'}
            onClick={() => this.printTask(record.Code)}
          >
            In biên bản
          </Button>
      })
    }

    return (
      <PageHeaderLayout title={'Danh sách giao việc'}>
        <ContentHolder>
          <TaskAssignTableControl
            handleSubmit={this.assignConfirm.onFilter}
          />

          <div style={{marginTop: 20}}>
            <Spin spinning={fetching || false}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.Code}
                pagination={pagination}
                onChange={this.assignConfirm.handleTableChange}
              />
            </Spin>
          </div>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}
