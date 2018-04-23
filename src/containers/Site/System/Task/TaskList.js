import React, {Component} from 'react';
import {Link} from "react-router-dom";
import moment from 'moment';
import {Button, Checkbox, Col, Row, Spin, Table, Tag} from 'antd';
import TaskListControl from "./TaskListControl";
import Permission from "../../../../permissions/index";
import routerConfig from "../../../../config/router";
import 'moment/locale/vi';
import ObjectPath from 'object-path';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

moment.locale('vi');

@inject(Keys.grantTask)
@observer
export default class TaskList extends Component {

  constructor(props) {
    super(props);
    this.grantTask = props.grantTask;
  }

  componentDidMount() {
    this.grantTask.reload();
  };

  onChange = (e, index) => {
    let {checked, value} = e.target;
    this.grantTask.onChange(checked, value, index);
  };

  onCheckAllChange = (e) => {
    this.grantTask.onCheckAll(e.target.checked);
  };

  render() {
    const {dataSource = [], fetching, checkAll, indeterminate, isAssign, checkedList, pagination} = this.grantTask;

    const title = () => (
      <Row justify={'start'}>
        <Col span={12}>
          <Checkbox
            indeterminate={indeterminate}
            onChange={this.onCheckAllChange}
            checked={checkAll}
            style={{display: 'inline-block'}}
          >
            Chọn tất cả các đơn hàng
          </Checkbox>
        </Col>

        <Col span={12} style={{textAlign: 'right'}}>
          {Permission.allowAssignTaskStaff() ?
            <Button
              icon={'rocket'}
              type="primary"
              ghost
              className='purple-button'
              disabled={!isAssign}
              onClick={this.grantTask.handleGrantTask}
            >
              Giao việc
            </Button>
            : ''}
        </Col>
      </Row>
    );

    const columns = [{
      dataIndex: '',
      key: '',
      className: 'grantTask-list-item',
      render: (text, record, index) =>
        <div>
          <div className="content">
            <Checkbox
              onChange={(e) => this.onChange(e, index)}
              checked={checkedList ? checkedList[index] : false}
              value={record.Code}
            >
              <Link to={routerConfig.detailTask.replace(":code", record.Code)}>
                <Tag color={"blue"} style={{margin: "0"}}>{record.Code}</Tag>
              </Link>
            </Checkbox>

            <b>{record.Orders && record.Orders.length} đơn - {record.TotalWeight} Kg</b>
            <p>
              <span className="grantTask-type">{ObjectPath.get(record, 'Type.Name')}</span>&nbsp;
              <span>{record.Address}</span>
            </p>
          </div>
          <div className="time-out">
            {'Cách đây: '}<b>{record.CreatedAt && record.CreatedAt.Pretty && moment(record.CreatedAt.Pretty, 'DD/MM/YYYY h:mm').fromNow()}</b>
          </div>
        </div>
    }];

    return (
      <div>
        <TaskListControl/>

        <div className="grantTask-total">
          {`Có ${pagination.total} công việc`}
        </div>

        <div>
          <Spin spinning={fetching}>
            <Table
              title={title}
              bordered={true}
              showHeader={false}
              size={'middle'}
              dataSource={dataSource.slice()}
              columns={columns}
              rowKey={(record, index) => index}
              pagination={pagination}
              onChange={this.grantTask.handleTableChange}
            />
          </Spin>
        </div>
      </div>
    );
  }
}