import React, {Component} from 'react';
import ObjectPath from "object-path";
import {Button, Icon, Input, Spin, Table, Tag, Tooltip} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import {numberFormat} from "../../../../helpers/utility";
import ConfirmTableControl from "../../Common/ConfirmStatus/ConfirmTableControl";
import TotalRecord from "../../../../components/TotalRecord/index";
import PageLayout from "../../../../layouts/PageLayout";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import {ReProcessOrderStore} from "../../../../stores/orders/reProcessOrderStore";


const eventCode = 599;

@inject(Keys.me, Keys.detailOrder)
@observer
export default class WaitingReturnTable extends Component {

  constructor(props) {
    super(props);
    this.reProcessOrder = new ReProcessOrderStore();
  }

  componentDidMount() {
    this.onFilter({
      HubID: this.props.me.getCurrentHub()
    });
  }

  componentWillUnmount() {
    this.reProcessOrder.clear();
  }

  handleConfirm = (code) => {
    if (code && this.state.statuses[code]) {
      this.props.updateOrderStatus(code, {StatusCode: +this.state.statuses[code]});
      let tmp = {...this.state.statuses};
      delete tmp[code];
      this.setState({
        statuses: tmp
      });
    }
  };

  onFilter = (filter) => {
    this.reProcessOrder.onFilter({
      ...filter,
      StatusCodes: [500]
    })
  };

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
            prefixFormID={'WaitingReturn'}
            code={eventCode} // WaitingReturn
            handleSubmit={this.onFilter}
            reProcessOrder={this.reProcessOrder}
          />

          <div className={"standardTable"}>
            <TotalRecord total={pagination.total} name={"đơn chờ xác nhận hoàn"}/>

            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.Code}
                pagination={pagination}
                onChange={this.reProcessOrder.handleTableChange}
                expandedRowRender={(record, index) => <NestedTable reProcessOrder={this.reProcessOrder} orderCode={record.Code}/>}
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
    let reason = this.reProcessOrder.reason.slice();
    let dataSource = this.reProcessOrder.dataSource.filter(val => val.Code === orderCode);

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
      title: 'Hành động',
      dataIndex: '',
      key: 'act',
      width: '40%',
      render: (text, record, index) => (
        <div style={{textAlign: 'center'}}>
          <Input
            placeholder='Lý do...'
            style={{marginBottom: 20}}
            value={(reason && reason.find(val => val.code === record.Code) !== undefined) ? reason.find(val => val.code === record.Code).note : ''}
            onChange={(e) => this.reProcessOrder.changeReason(e.target.value, record.Code)}
          />

          <Button
            icon={'reload'}
            size="small"
            type="primary"
            style={{marginRight: 5}}
            onClick={() => this.reProcessOrder.handlePerformInWaitingReturn(record.Code)}
          >
            Gửi yêu cầu phát lại
          </Button>

          <Button
            icon={'check'}
            size="small"
            type="danger"
            onClick={() => this.reProcessOrder.handleConfirmInWaitingReturn(record.Code)}
          >
            Xác nhận duyệt hoàn
          </Button>
        </div>
      )
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