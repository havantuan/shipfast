import React, {Component} from 'react';
import ObjectPath from 'object-path';

import {Button, Col, Row, Spin, Table} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import NotificationTableControl from "./NotificationTableControl";
import Permission from "../../../../permissions/index";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import NotificationModal from "./NotificationModal";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import TotalRecord from '../../../../components/TotalRecord/index';

@inject(Keys.notification)
@observer
export default class NotificationTable extends Component {


  constructor(props) {
    super(props);
    this.notification = this.props.notification;
  }

  componentWillUnmount() {
    this.notification.clear();
  }

  componentDidMount() {
    this.notification.reload();
  }


  render() {
    let {dataSource, fetching} = this.notification;

    let columns = [{
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
    }, {
      title: 'Tiêu đề',
      dataIndex: 'Title',
      key: 'Title',
      width: '20%',
      render: (text, record, index) => <div>
        <p>{text}</p>
      </div>,
    }, {
      title: 'Chi tiết',
      dataIndex: 'Body',
      key: 'Body',
      width: '30%',
      render: (text, record, index) => <span>{text}</span>
    }, {
      title: 'Đối tượng nhận',
      dataIndex: 'AppType',
      key: 'AppType',
      render: (text, record, index) => <span>{ObjectPath.get(record, "AppType.Name")}</span>
    }, {
      title: 'Thời gian gửi',
      dataIndex: 'Date',
      key: 'Date',
      width: '20%',
      render: (text, record, index) => <div>
        <p>{ObjectPath.get(record, "Date.Pretty")}</p>
      </div>
    }, {
      title: 'Trạng thái gửi thông báo',
      dataIndex: 'detail',
      key: 'detail',
      render: (text, record, index) => <div>
        <p><b>Thiết bị nhận thành công :</b> {ObjectPath.get(record, "TotalPushSuccess")}</p>
        <p><b>Tổng số thiết bị gửi:</b> {ObjectPath.get(record, "TotalPushTokens")}</p>
      </div>
    }];

    return (
      <PageHeaderLayout
        title={'Danh sách thông báo'}
      >
        <ContentHolder>
          <Row justify={'start'}>
            <Col sm={18} xs={24}>
              <NotificationTableControl/>
            </Col>

            <Col sm={6} xs={24} style={{textAlign: 'right'}}>
              {
                Permission.allowUpdateNotification() &&
                <Button
                  icon="plus"
                  type="primary"
                  onClick={this.notification.showCreateModal}
                  // onClick={this.redirectToCreateNotifi}
                >
                  {'Thêm thông báo mới'}
                </Button>
              }
            </Col>
          </Row>

          <NotificationModal/>

          <div style={{marginTop: 20}}>
            <TotalRecord total={this.notification.pagination.total} name={'thông báo'}/>
            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource ? dataSource.slice() : []}
                columns={columns}
                rowKey={record => record.ID}
                pagination={this.notification.pagination}
                onChange={this.notification.handleTableChange}
              />
            </Spin>
          </div>

        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}