import React, {Component} from 'react';
import ObjectPath from "object-path";
import {Checkbox, Icon, Spin, Table, Tag, Tooltip} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import ConfirmTableControl from "../../Common/ConfirmStatus/ConfirmTableControl";
import EventAcceptStatuses from "../../Common/OrderProvider/OrderEventStatus/AcceptStatuses";
import TotalRecord from "../../../../components/TotalRecord/index";
import PageLayout from "../../../../layouts/PageLayout";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

import {ReProcessOrderStore} from "../../../../stores/orders/reProcessOrderStore";

const eventCode = 891;

@inject(Keys.me, Keys.detailOrder)
@observer
export default class DamagesProductTable extends Component {

  constructor(props) {
    super(props);
    this.reProcessOrder = new ReProcessOrderStore();
  }

  componentDidMount() {
    this.onFilter({
      HubID: this.props.me.getCurrentHub()
    });
  }

  onFilter = (filter) => {
    this.reProcessOrder.onFilter({
      ...filter,
      EventStatusCode: eventCode
    })
  };

  componentWillUnmount() {
    this.reProcessOrder.clear();
  }

  render() {
    const {dataSource, fetching, pagination} = this.reProcessOrder;
    let counter = pagination.pageSize * (pagination.current - 1);

    const columns = [{
      title: '#',
      dataIndex: '',
      key: 'index',
      className: 'col-center',
      render: (text, record, index) => <span>{index + 1 + counter}</span>
    }, {
      title: 'Người gửi',
      dataIndex: 'Sender',
      key: 'name',
      render: (text, record, index) =>
        <div>
          <p><Icon type="user"/> {text && text.Name}</p>
          <p><Icon type="phone"/> {text && text.Phone}</p>
        </div>
    }, {
      title: 'Địa chỉ gửi',
      dataIndex: 'Sender',
      key: 'address',
      width: '30%',
      render: (text, record, index) =>
        <div style={{wordBreak: 'keep-all', textAlign: 'justify'}}>
          {
            text && text.Address &&
            <Tooltip title={text.Address}>
                            <span>
                                <b>
                                    <Icon type="environment"/>
                                    Thu:&nbsp;
                                </b>
                              {text.Address}
                            </span>
              <a href={`https://www.google.com/maps/place/${text.Address}`} target="_blank"
                 style={{marginLeft: '5px'}}>
                <Icon type="global"/>
              </a>
            </Tooltip>
          }
        </div>
    }, {
      title: 'Tổng số đơn',
      dataIndex: '',
      key: 'total',
      render: (text, record, index) => <span>1</span>
    }, {
      title: 'Đơn hàng',
      dataIndex: 'Code',
      key: 'order',
      render: (text, record, index) =>
        <Tag color={"blue"} onClick={(e) => this.props.detailOrder.showRootModal(record.Code)}>
          <span>{record.Code}</span>
        </Tag>
    }];

    return (
      <PageLayout>

        <ContentHolder>
          <ConfirmTableControl
            prefixFormID={'DamagesProduct'}
            reProcessOrder={this.reProcessOrder}
            handleSubmit={this.onFilter}
            code={eventCode}
          />

          <div className={"standardTable"}>
            <TotalRecord total={pagination.total} name={"đơn hàng"}/>
            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.Code}
                expandedRowRender={(record) => <NestedTable reProcessOrder={this.reProcessOrder} orderCode={record.Code}/>}
                pagination={pagination}
                onChange={this.reProcessOrder.handleTableChange}
              />
            </Spin>
          </div>

        </ContentHolder>
      </PageLayout>
    )
  }

}
@inject(Keys.detailOrder)
@observer
class NestedTable extends Component {
  
  constructor(props) {
    super(props);
    this.reProcessOrder = props.reProcessOrder;
  }

  render() {
    let {orderCode} = this.props;
    let {ordersChecked} = this.reProcessOrder;
    let dataSource = this.reProcessOrder.dataSource.filter(val => val.Code === orderCode);
    let rowKey = orderCode;

    const columns = [{
      title: '#',
      dataIndex: '',
      key: 'key',
      className: 'col-center',
      render: (text, record, index) => <span>{index + 1}</span>
    }, {
      title: <span><Icon type="barcode"/> Mã đơn hàng</span>,
      dataIndex: '',
      key: 'order',
      render: (text, record, index) =>
        <div>
          <Tag color={"blue"} onClick={(e) => this.props.detailOrder.showRootModal(record.Code)}>
            <span>{record.Code}</span>
          </Tag>
          <p><b>Tạo: </b>{ObjectPath.get(record, "CreatedAt.Pretty")}</p>
        </div>
    }, {
      title: 'Người nhận',
      dataIndex: 'Receiver',
      key: 'name',
      width: '40%',
      render: (text, record, index) =>
        <div>
          <p><Icon type="user"/> {text.Name}</p>
          <p><Icon type="phone"/> {text.Phone}</p>
          <div style={{wordBreak: 'keep-all', textAlign: 'justify'}}>
            {
              text && text.Address &&
              <Tooltip title={text.Address}>
                            <span>
                                <b>
                                    <Icon type="environment"/>
                                    Phát:&nbsp;
                                </b>
                              {text.Address}
                            </span>
                <a href={`https://www.google.com/maps/place/${text.Address}`} target="_blank"
                   style={{marginLeft: '5px'}}>
                  <Icon type="global"/>
                </a>
              </Tooltip>
            }
          </div>
        </div>
    }, {
      title: 'Trạng thái',
      dataIndex: '',
      key: 'status',
      render: (text, record, index) =>
        <div>
          <Tag color={`${ObjectPath.get(record, "StatusCode.Color")}`}>
            {ObjectPath.get(record, "StatusCode.Code")} - {ObjectPath.get(record, "StatusCode.Name")}
          </Tag>
          <p><b><Icon type="reload"/> Cập nhật: </b>{ObjectPath.get(record, "UpdatedAt.Pretty")}</p>
          <div>
            <b><Icon type="home"/> Dịch vụ: </b>
            <Tag color={"green"}>{ObjectPath.get(record, "ServiceType.Name")}</Tag>
          </div>
        </div>
    }, {
      title:
        <EventAcceptStatuses
          code={eventCode}
          rows={dataSource.length}
          counter={ordersChecked.find(val => val.id === rowKey) !== undefined ? 1 : 0}
          onChange={(statusCode) => this.reProcessOrder.handleUpdate(rowKey, statusCode)}
        />,
      key: 'action',
      className: 'col-center',
      render: (text, record, index) =>
        <Checkbox
          checked={ordersChecked.find(val => val.id === rowKey) !== undefined}
          onChange={() => this.reProcessOrder.checkedChange(record.Code, rowKey)}
          className={'custom-checkbox'}
        />
    }];

    return (
      <div>
        <Table
          bordered
          dataSource={dataSource.slice()}
          columns={columns}
          pagination={false}
          rowKey={record => record.Code}
        />
      </div>
    );
  }

}