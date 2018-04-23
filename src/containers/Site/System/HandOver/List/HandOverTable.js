import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Spin, Table, Tag} from 'antd';
import ContentHolder from '../../../../../components/utility/ContentHolder';
import basicStyle from '../../../../../config/basicStyle';
import routerConfig from "../../../../../config/router";
import './Style.css';
import HandOverTableControl from "./HandOverTableControl";
import ObjectPath from "object-path";
import {numberFormat} from "../../../../../helpers/utility";
import TotalRecord from '../../../../../components/TotalRecord/index';
import PageHeaderLayout from '../../../../../layouts/PageHeaderLayout';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../stores/index";
import StatusToolTip from '../../../Common/StatusToolTip/StatusToolTip';
@inject(Keys.handerOver, Keys.router)
@observer
export default class HandOverTable extends Component {

  constructor(props) {
    super(props)
    this.handerOver = props.handerOver;
  }

  componentDidMount() {
    this.handerOver.reload();
  }

  componentWillUnmount() {
    this.handerOver.clear();
  }

  render() {
    const {orangeButton} = basicStyle;
    let {dataSource, fetching, pagination} = this.handerOver;
    let counter = pagination.pageSize * (pagination.current - 1);

    let columns = [{
      title: '#',
      dataIndex: '',
      key: 'index',
      width: '30px',
      render: (text, record, index) => <span>{index + 1 + counter}</span>
    }, {
      title: 'Mã',
      dataIndex: 'Code',
      key: 'Code',
      render: (text, record, index) => <div>
        <Tag color={"blue"}>
          <Link to={routerConfig.detailHandOver.replace(":code", record.Code)}>
            {record.Code}
          </Link>
        </Tag>
      </div>
    },
      {
        title: 'Ngày lập',
        dataIndex: 'Created',
        key: 'Created',
        render: (text, record, index) => <div>
          {ObjectPath.get(record, "CreatedAt.Pretty")}
        </div>
      }, {
        title: 'Hub',
        dataIndex: 'Hub',
        key: 'Hub',
        render: (text, record, index) =>
          <StatusToolTip value={record.Hub}> </StatusToolTip>
      },
      {
        title: 'Người nhận',
        dataIndex: 'AssignStaff',
        key: 'AssignStaff',
        render: (text, record, index) => <div>
          {ObjectPath.get(record.AssignStaff, "Name")} - {ObjectPath.get(record.AssignStaff, "Phone")}
        </div>
      }, {
        title: 'Nhân viên',
        dataIndex: 'Staff',
        key: 'Staff',
        render: (text, record, index) => <div>
          {ObjectPath.get(record.Staff, 'Name')} - {ObjectPath.get(record.Staff, 'Phone')}
        </div>
      }, {
        title: 'Phải thu',
        dataIndex: 'Status',
        key: 'Status',
        render: (text, record, index) => <div>
          {ObjectPath.get(record, "AccountReceivables") ? numberFormat(ObjectPath.get(record, "AccountReceivables")) : '0'}
        </div>
      }, {
        title: 'Hành động',
        key: 'action',
        render: (text, record, index) =>
          <Button
            style={orangeButton}
            icon={'printer'}
            onClick={() => window.open(routerConfig.printHandOver.replace(":code", record.Code))}
          >
            In
          </Button>
      }];
    // if (Permission.allowPermission(permissions.updateHandOver)) {
    //   columns.push({
    //     title: '',
    //     dataIndex: '',
    //     key: 'action',
    //     render: (text, record, index) => {
    //       const menu = (
    //         <Menu>
    //           <Menu.Item key="edit">
    //             <Link to={routerConfig.updateHandOver.replace(":id", record.ID)}>
    //               <Icon type="edit"/> Chỉnh sửa
    //             </Link>
    //           </Menu.Item>
    //         </Menu>
    //       );
    //
    //       return (
    //         <Dropdown overlay={menu} trigger={['click']}>
    //           <Button
    //             icon="ellipsis"
    //             size="small"
    //           >
    //             Hành động
    //           </Button>
    //         </Dropdown>
    //       )
    //     }
    //   })
    // }
    return (
      <PageHeaderLayout title="Danh sách bàn giao">
        <ContentHolder>
          <HandOverTableControl/>

          <div style={{marginTop: 16}} className={"standardTable"}>
            <TotalRecord total={pagination.total} name={"đơn hàng"}/>
            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource ? dataSource.slice() : []}
                columns={columns}
                rowKey={record => record.ID}
                pagination={pagination}
                onChange={this.handerOver.handleTableChange}
                style={{border: '1px solid #e9e9e9', borderTop: 'none'}}
              />
            </Spin>
          </div>
        </ContentHolder>

      </PageHeaderLayout>
    )
  }

}

