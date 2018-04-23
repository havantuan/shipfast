import React from 'react';
import {Table, Tag} from 'antd';
import PageLayout from "../../../../layouts/PageLayout";
import ContentHolder from "../../../../components/utility/ContentHolder";
import {isObservableArray} from 'mobx';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import ObjectPath from 'object-path';
import StatusTag from "../../Common/StatusTag/StatusTag";

@inject(Keys.detailcross)
@observer
export default class CrossHistory extends React.PureComponent {

  render() {
    const {dataSource} = this.props.detailcross;
    const history = [{
      title: 'Thời gian',
      dataIndex: '',
      key: 'createdAt',
      width: 140,
      render: (text, record, index) => <span>{ObjectPath.get(record, 'CreatedAt.Pretty')}</span>
    }, {
      title: 'Trạng thái',
      dataIndex: 'StatusCode',
      key: 'Status',
      render: (text, record, index) => <div>
        <div>{record.StatusCode && record.StatusCode.Name ?
          <StatusTag value={record.StatusCode ? record.StatusCode : 0}/> : ''}</div>
      </div>
    }, {
      title: 'Phí bổ sung',
      dataIndex: 'ExtraFee',
      key: 'ExtraFee',
      render: (text, record, index) => <span>{text ? text : ''}</span>
    }, {
      title: 'Ghi chú',
      dataIndex: 'Note',
      key: 'Note',
      render: (text, record, index) => <div>
        <Tag color="#3d9ecc">{ObjectPath.get(record, "Type")}</Tag>
        <span>{record.Note}</span>
      </div>
    }, {
      title: 'Người Cập nhật',
      dataIndex: 'CreatedBy',
      key: 'createdBy',
      render: (text, record, index) => <span>{text ? text.Name : ''}</span>
    }];

    let CustomerCrossHistory = null;
    if (dataSource) {
      CustomerCrossHistory = dataSource.CustomerCrossHistory;
    }

    return (
      <PageLayout>
        <ContentHolder>
          <Table
            dataSource={isObservableArray(CustomerCrossHistory) ? CustomerCrossHistory.slice() : (CustomerCrossHistory || [])}
            columns={history}
            rowKey={(record, index) => index}
            pagination={false}
          />
        </ContentHolder>
      </PageLayout>
    )
  }

}