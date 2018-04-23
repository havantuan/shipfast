import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Spin, Table, Tag} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import './Style.css';
import ContainerTableControl from "./ContainerTableControl";
import ObjectPath from "object-path";
import StatusTag from "../../Common/StatusTag/StatusTag";
import routerConfig from "../../../../config/router";
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import TotalRecord from '../../../../components/TotalRecord/index';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import {isObservableArray} from 'mobx';
import StatusToolTip from "../../Common/StatusToolTip/StatusToolTip";

@inject(Keys.letterContainer, Keys.router)
@observer
export default class ContainerTable extends Component {

  constructor(props) {
    super(props);
    this.letterContainer = props.letterContainer;
    this.router = props.router;
  }

  componentDidMount() {
    this.letterContainer.reload();
  }

  componentWillUnmount() {
    this.letterContainer.clear();
  }

  render() {
    let {dataSource, fetching, pagination} = this.letterContainer;
    let counter = pagination.pageSize * (pagination.current - 1);

    let columns = [{
      title: 'STT',
      dataIndex: 'ID',
      key: 'stt',
      render: (text, record, index) => <span>{index + 1 + counter}</span>
    }, {
      title: 'Mã chuyến thư',
      dataIndex: 'Code',
      key: 'Code',
      render: (text, record, index) => <Link to={routerConfig.detailContainer.replace(":code", record.Code)}>
        <Tag color="#19a9d5">{ObjectPath.get(record, "Code")}</Tag>
      </Link>
    }, {
      title: 'Trạng thái',
      dataIndex: 'Status',
      key: 'Status',
      render: (text, record, index) => <StatusTag value={ObjectPath.get(record, "Status")}/>
    }, {
      title: 'Biển số xe',
      dataIndex: 'VehicleNumberPlates',
      key: 'VehicleNumberPlates',
      render: (text, record, index) => <span>{ObjectPath.get(record, "VehicleNumberPlates")}</span>
    }, {
      title: 'Số lượng bảng kê',
      dataIndex: 'PickingLists',
      key: 'PickingLists',
      render: (text, record, index) => <span>{text.length}</span>
    }, {
      title: 'Điểm thu',
      dataIndex: 'SourceHub',
      key: 'name',
      render: (text, record, index) => <StatusToolTip value={ObjectPath.get(record, "SourceHub")} />
    }, {
      title: 'Điểm phát',
      dataIndex: 'DestinationHub',
      key: 'DestinationHub',
      render: (text, record, index) => <StatusToolTip value={ObjectPath.get(record, "DestinationHub")} />
    }, {
      title: 'Khối lượng(Kg)',
      dataIndex: 'Weight',
      key: 'Weight',
      render: (text, record, index) => <span>{ObjectPath.get(record, "Weight")}</span>
    }, {
      title: 'Thời gian tạo',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
      render: (text, record, index) => <span>{ObjectPath.get(record.CreatedAt, "Pretty")}</span>
    }];

    return (
      <PageHeaderLayout title="Chuyến thư">
        <ContentHolder>
          <ContainerTableControl
            handleSubmit={this.letterContainer.onFilter}
          />

          <div style={{marginTop: 16}} className={"standardTable"}>
            <TotalRecord total={pagination.total} name={"chuyến thư"}/>

            <Spin spinning={fetching}>
              <Table
                dataSource={isObservableArray(dataSource) ? dataSource.slice() : []}
                columns={columns}
                rowKey={record => record.ID}
                pagination={pagination}
                onChange={this.letterContainer.handleTableChange}
              />
            </Spin>
          </div>

        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}

