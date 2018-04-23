import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {Button, Dropdown, Icon, Menu, Spin, Table, Tag} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import routerConfig from "../../../../config/routerSystem";
import './Style.css';
import RouteTableControl from "./RouteTableControl";
import Permission from "../../../../permissions/index";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import TotalRecord from '../../../../components/TotalRecord/index';

const NodeColumnTable = (data) => {
  return (
    <div className={"tagList"}>
      {data.data.map((el, i) => {
        return <Tag color="#87d068" key={i}>{el.Name}</Tag>
      })}
    </div>
  )
};

@inject(Keys.route, Keys.router)
@observer
export default class RouteTable extends Component {

  constructor(props) {
    super(props);
    this.route = props.route;
    this.router = props.router;
  }

  componentDidMount() {
    this.route.reload();
  };

  componentWillUnmount() {
    this.route.clear();
  }

  handleTableChange = (pagination, filters, sort) => {
    this.route.handleTableChange(pagination, filters, sort);
  };

  redirectToCreateRoute = () => {
    this.router.push(routerConfig.createRoute);
  };

  render() {
    let {dataSource, fetching, pagination} = this.route;
    let counter = pagination.pageSize * (pagination.current - 1);

    let columns = [{
      title: '#',
      dataIndex: '',
      key: 'index',
      render: (text, record, index) => <span>{index + 1 + counter}</span>
    }, {
      title: 'Tên tuyến',
      dataIndex: 'Name',
      width: 150,
      key: 'Name',
      // render: (text, record, index) => <span>{text}</span>,

    }, {
      title: 'Mã',
      dataIndex: 'Code',
      key: 'Code',
      render: (text, record, index) => <span>{text}</span>
    }, {
      title: 'Điểm gửi hàng',
      dataIndex: 'Hub',
      width: 150,
      key: 'hub',
      render: (text, record, index) => <Tag color="#87d068">{text && text.DisplayName}</Tag>
    }, {
      title: 'Quận huyện',
      dataIndex: 'Districts',
      key: 'Districts',
      width: 100,
      render: (text, record, index) => {
        return <NodeColumnTable data={text} key={index}/>
      }
    }, {
      title: 'Xã phường',
      dataIndex: 'Wards',
      key: 'Wards',
      width: 500,
      render: (text, record, index) => {
        return <NodeColumnTable data={text} key={index}/>
      }
    }];
    if (Permission.allowUpdateRoute()) {
      columns.push({
        title: 'Xử lý',
        dataIndex: '',
        key: 'action',
        render: (text, record, index) => {
          const menu = (
            <Menu>
              <Menu.Item key="edit">
                <Link to={routerConfig.updateRoute.replace(":id", record.ID)}>
                  <Icon type="edit"/> Chỉnh sửa
                </Link>
              </Menu.Item>
            </Menu>
          );

          return (
            <Dropdown overlay={menu} trigger={['click']}>
              <Button
                icon="ellipsis"
                size="small"
              >
                Hành động
              </Button>
            </Dropdown>
          );
        }
      })
    }
    return (
      <PageHeaderLayout
        title={'Danh sách tuyến'}
      >
        <ContentHolder>
          <RouteTableControl/>

          <div style={{marginTop: 16}}>
            <TotalRecord total={this.route.pagination.total} name={'tuyến'}/>
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

        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}