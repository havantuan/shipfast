import React, {Component} from 'react';
import ObjectPath from "object-path";
import {Checkbox, Icon, Spin, Table, Tag, Tooltip} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import {numberFormat} from "../../../../helpers/utility";
import ConfirmTableControl from "../../Common/ConfirmStatus/ConfirmTableControl";
import EventAcceptStatuses from "../../Common/OrderProvider/OrderEventStatus/AcceptStatuses";
import PageLayout from "../../../../layouts/PageLayout";
import TotalRecord from "../../../../components/TotalRecord/index";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import {ReProcessOrderStore} from "../../../../stores/orders/reProcessOrderStore";


const eventCode = 599;

@inject(Keys.me, Keys.detailOrder)
@observer
export default class ReReturnTable extends Component {

  constructor(props) {
    super(props);
    this.reProcessOrder = new ReProcessOrderStore();
  }

  componentDidMount() {
    this.reProcessOrder.onFilter({
      EventStatusCode: eventCode,
      HubID: this.props.me.getCurrentHub()
    })
  }

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
      title: 'Tổng số',
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
            prefixFormID={'ReReturn'}
            code={eventCode} // ReReturn
            handleSubmit={this.reProcessOrder.onFilter}
            reProcessOrder={this.reProcessOrder}
          />

          <div className={"standardTable"}>
            <TotalRecord total={pagination.total} name={"địa chỉ hoàn"}/>
            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.Code}
                pagination={pagination}
                onChange={this.reProcessOrder.handleTableChange}
                expandedRowRender={(record, index) => <NestedTable reProcessOrder={this.reProcessOrder} orderCode={record.Code} rowKey={index}/>}
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
    let {orderCode, rowKey} = this.props;
    let dataSource = this.reProcessOrder.dataSource.filter(val => val.Code === orderCode);
    let {ordersChecked} = this.reProcessOrder;

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
          <p>
            <b>Loại: </b>
            <span>{record.IsProvincialShipping === true ? 'Nội tỉnh' : 'Liên tỉnh'}</span>
          </p>
          <p><b>Tạo: </b>{ObjectPath.get(record, "CreatedAt.Pretty")}</p>
        </div>
    }, {
      title: 'Chuyển hoàn',
      dataIndex: '',
      key: 'return',
      render: (text, record, index) =>
        <div>
          <p>
            <b>Phí: </b>
            <span>{numberFormat(ObjectPath.get(record, 'ReturningCost'))}&nbsp;đ</span>
          </p>
          <p>
            <b>Tổng thu: </b>
            <span>{numberFormat(ObjectPath.get(record, 'TotalCost'))}&nbsp;đ</span>
          </p>
        </div>
    }, {
      title: 'Người nhận',
      dataIndex: 'Receiver',
      key: 'name',
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
      title: <EventAcceptStatuses
        code={eventCode}
        rows={dataSource.length}
        counter={ordersChecked.find(val => val.id === rowKey) !== undefined ? 1 : 0}
        onChange={(statusCode) => this.reProcessOrder.handlePerformReturn(rowKey, statusCode)}
      />,
      key: 'action',
      className: 'col-center',
      render: (text, record, index) =>
        <Checkbox
          checked={ordersChecked.find(val => val.id === rowKey) !== undefined ? 1 : 0}
          onChange={() => this.reProcessOrder.checkedChange(record.Code, rowKey)}
          className={'custom-checkbox'}
        />
    }];

    return (
      <Table
        bordered
        dataSource={dataSource.slice()}
        columns={columns}
        pagination={false}
        rowKey={record => record.Code}
      />
    );
  }

}