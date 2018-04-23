import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ObjectPath from 'object-path';

import {Button, Col, Dropdown, Icon, Menu, Row, Spin, Switch, Table, Tag, Tooltip} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import routerSystemConfig from "../../../../config/routerSystem";
import './Style.css';
import StaffTableControl from "./StaffTableControl";
import Permission from "../../../../permissions/index";
import EditRole from "./EditRole";
import EditHub from "./EditHub";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import TotalRecord from '../../../../components/TotalRecord/index';

@inject(Keys.staff, Keys.router, Keys.auth)
@observer
export default class StaffTable extends Component {

  constructor(props) {
    super(props);
    this.staff = props.staff;
    this.router = props.router;
  }

  componentDidMount() {
    this.staff.reload();
  };
  componentWillUnmount() {
    this.staff.clear();
  }

  redirectToCreateStaff = () => {
    this.router.push(routerSystemConfig.createStaff);
  };

  redirectToCreateStaffFromUser = () => {
    this.router.push(routerSystemConfig.createStaffFromUser);
  };

  showHubModal = (e, data) => {
    e.preventDefault();
    this.staff.showHubModal(data);
  };

  showRoleModal = (e, data) => {
    e.preventDefault();
    this.staff.showRoleModal(data);
  };

  render() {
    let {dataSource, fetching, pagination} = this.staff;
    let counter = pagination ? (pagination.pageSize * (pagination.current - 1)) : 0;

    let columns = [{
      title: '#',
      dataIndex: '',
      key: 'index',
      render: (text, record, index) => <span>{index + 1 + counter}</span>
    }, {
      title: 'Nhân viên',
      dataIndex: '',
      width: 230,
      key: 'Name',
      render: (text, record, index) => {
        return (
          <div>
            <div>Mã : <Tag color="#87d068" key={index}>{record.Code}</Tag></div>
            <a>Tên: {record.Name}</a>
            <div>Điện Thoại: {record.Phone}</div>
          </div>
        )
      },
      sorter: true
    }, {
      title: 'Điểm gửi hàng',
      dataIndex: 'Hubs',
      key: 'Hubs',
      render: (text, record, index) => (
        <div className={"tagList"}>
          {text.map((hub, i) =>
            <Tooltip title={`${hub.Name}`} key={i}>
              <Tag color="purple">{hub.Code + ' '}</Tag>
            </Tooltip>
          )}
        </div>
      )
    }, {
      title: 'Nhóm quyền',
      dataIndex: 'Roles',
      key: 'roles',
      width: 100,
      render: (text, record, index) => (
        <div className={"tagList"}>
          {
            text.map((el, i) => <Tag color="#87d068" key={i}>{el.Name}</Tag>)
          }
        </div>
      )
    }, {
      title: 'Trạng thái',
      dataIndex: 'State',
      key: 'State',
      render: (text, record, index) => <Tag color={text.Value ? "#87d068" : "#f50"}>{text.Name}</Tag>,
      sorter: true
    }];
    if (Permission.allowUpdateStateStaff()) {
      columns.push({
        title: 'Kích hoạt',
        dataIndex: '',
        key: 'active',
        render: (text, record, index) =>
          <Spin
            spinning={this.staff.isActiveID === record.ID ? this.staff.isActiveFetching : false}>
            {
              <Switch
                unCheckedChildren={<Icon type="lock"/>}
                onChange={(checked) => this.staff.onActiveChange(record.ID, checked)}
                checked={ObjectPath.get(record, 'State.Code', '').toUpperCase() === 'ACTIVE'}
              />
            }
          </Spin>
      })
    }
    if (Permission.allowUpdateStaff()) {
      columns.push({
        title: 'Xử lý',
        dataIndex: '',
        key: 'action',
        render: (text, record, index) => {
          const menu = (
            <Menu>
              <Menu.Item key="edit">
                <Link to={routerSystemConfig.updateStaff.replace(":id", record.ID)}>
                  <Icon type="edit"/> Chỉnh sửa
                </Link>
              </Menu.Item>

              <Menu.Item key="hub">
                <Link to={'/'} onClick={(e) => this.showHubModal(e, record)}>
                  <Icon type="home"/> Điểm gửi hàng
                </Link>
              </Menu.Item>

              <Menu.Item key="role">
                <Link to={'/'} onClick={(e) => this.showRoleModal(e, record)}>
                  <Icon type="safety"/> Vai trò
                </Link>
              </Menu.Item>
            </Menu>
          );

          return (
            <Dropdown overlay={menu} trigger={['click']}>
              <Button
                icon="ellipsis"
              >
              </Button>
            </Dropdown>
          );
        }
      })
    }
    return (
      <PageHeaderLayout
        title={'Danh sách nhân viên'}
      >
        <ContentHolder>
          <Row>
            <Col sm={16} xs={24}>
              <StaffTableControl/>
            </Col>
            <Col sm={8} xs={24} style={{textAlign: 'right'}}>
              {Permission.allowCreateStaff() ?
                <div>
                  <Button
                    icon="plus"
                    type="primary"
                    onClick={this.redirectToCreateStaff}
                  >Thêm</Button>
                  <Button
                    className="addUser"
                    icon="plus"
                    type="primary"
                    onClick={this.redirectToCreateStaffFromUser}
                  >Thêm từ người dùng</Button>
                </div>
                : null}
            </Col>
          </Row>

          <div style={{marginTop: 16}}>
            <TotalRecord total={this.staff.pagination.total} name={'nhân viên'}/>
            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.ID}
                pagination={pagination}
                onChange={this.staff.handleTableChange}
              />
            </Spin>
          </div>

          <EditRole/>
          <EditHub/>

        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}