import React, {Component} from 'react';
import ObjectPath from "object-path";
import {Button, Icon, Input, message, Modal, Spin, Table, Tag, Tooltip} from 'antd';
import basicStyle from "../../../../../config/basicStyle";
import './Style.css';
import ConfirmTableControl from "../../../Common/ConfirmStatus/ConfirmTableControl";
import HubList from "../../../Common/HubProvider/hubList";
import PageHeaderLayout from '../../../../../layouts/PageHeaderLayout';
import TotalRecord from '../../../../../components/TotalRecord';
import ContentHolder from "../../../../../components/utility/ContentHolder";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../stores/index";
import TableFooter from "../../../../../components/TableFooter/index";


const {TextArea} = Input;

@inject(Keys.orderingOrder, Keys.detailOrder)
@observer
export default class OrderingOrdersTable extends Component {

  constructor(props) {
    super(props);
    this.orderingOrder = props.orderingOrder;
  }

  componentDidMount() {
    this.orderingOrder.reload();
  }

  componentWillUnmount() {
    this.orderingOrder.clear();
  }

  handleChangeReason = (e) => {
    let {value} = e.target;
    this.orderingOrder.onChangeRejectReason(value);
  };

  senderHubChange = (orderCode, hubID) => {
    let {assignValue} = this.orderingOrder;
    let tmp = {...assignValue};
    tmp[orderCode] = (assignValue && assignValue[orderCode]) ? {
      ...assignValue[orderCode],
      SenderHubID: hubID
    } : {SenderHubID: hubID};
    this.orderingOrder.onChangeAssignValue(tmp);
  };

  receiverHubChange = (orderCode, hubID) => {
    let {assignValue} = this.orderingOrder;
    let tmp = {...assignValue};
    tmp[orderCode] = (assignValue && assignValue[orderCode]) ? {
      ...assignValue[orderCode],
      ReceiverHubID: hubID
    } : {ReceiverHubID: hubID};
    this.orderingOrder.onChangeAssignValue(tmp);
  };

  handleConfirm = (orderCode) => {
    let {assignValue} = this.orderingOrder;
    if (assignValue && assignValue[orderCode]) {
      let senderHubID = assignValue[orderCode].SenderHubID || null;
      let receiverHubID = assignValue[orderCode].ReceiverHubID || null;
      if (senderHubID === null) {
        message.error('Vui lòng chọn điểm thu');
        return;
      }
      if (receiverHubID === null) {
        message.error('Vui lòng chọn điểm phát');
        return;
      }
      this.orderingOrder.assignOrderToHub(orderCode, {SenderHubID: +senderHubID, ReceiverHubID: +receiverHubID});
    }
    else {
      message.error('Vui lòng chọn điểm gửi hàng');
    }
  };

  render() {
    const {dataSource, fetching, isRejecting, pagination, isShowModal, assignValue, rejectValue} = this.orderingOrder;
    const {greenBg, redBg} = basicStyle;
    let counter = pagination ? (pagination.pageSize * (pagination.current - 1)) : 0;

    const columns = [{
      title: '#',
      dataIndex: '',
      key: 'index',
      className: 'col-center',
      render: (text, record, index) => <span>{index + 1 + counter}</span>
    }, {
      title: 'Đơn hàng',
      dataIndex: 'Code',
      width: '200px',
      key: 'order',
      render: (text, record, index) =>
        <div>
          <p><Tag color={"blue"} onClick={(e) => this.props.detailOrder.showRootModal(record.Code)}>
            <span>{record.Code}</span>
          </Tag></p>
          <p><b><Icon type="reload"/> Tạo: </b>{ObjectPath.get(record, "CreatedAt.Pretty")}</p>
          <p><b>{ObjectPath.get(record, "Name")}</b></p>

        </div>
    }, {
      title: 'Người gửi',
      dataIndex: 'Sender',
      key: 'name',
      render: (text, record, index) =>
        <div>
          <p><Icon type="user"/> {text && text.Name}  <Icon type="phone"/> {text && text.Phone}</p>
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
        </div>
    }, {
      title: 'Người nhận',
      dataIndex: 'Receiver',
      key: 'receiver',
      render: (text, record, index) =>
        <div>
          <p><Icon type="user"/> {text.Name}  <Icon type="phone"/> {text.Phone}</p>
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
      title: 'Điểm gửi hàng',
      key: 'hub',
      width: '200px',
      render: (text, record, index) =>
        <div style={{width: 200}}>
          <div style={{marginBottom: '10px'}}>
            <HubList
              onChange={(hubID) => this.senderHubChange(record.Code, hubID)}
              placeholder="Chọn điểm thu"
              show={true}
              value={(assignValue && assignValue[record.Code] && assignValue[record.Code].SenderHubID) || null}
            />
          </div>
          <HubList
            onChange={(hubID) => this.receiverHubChange(record.Code, hubID)}
            placeholder="Chọn điểm phát"
            show={true}
            value={(assignValue && assignValue[record.Code] && assignValue[record.Code].ReceiverHubID) || null}
          />
        </div>
    }, {
      title: 'Hành động',
      key: 'action',
      width: '100px',
      render: (text, record, index) =>
        <div>
          <Button
            icon={"check"}
            size={"small"}
            style={{...greenBg, marginBottom: '10px'}}
            className={"act-button"}
            onClick={() => this.handleConfirm(record.Code)}
          >
            Duyệt
          </Button>
          <Button
            icon={"close"}
            size={"small"}
            style={redBg}
            className={"act-button"}
            onClick={() => this.orderingOrder.showModal(record.Code)}
          >
            Hủy
          </Button>
        </div>
    }];

    return (
      <PageHeaderLayout
        title="Duyệt đơn"
      >
        <ContentHolder>
          <ConfirmTableControl
            noPrint={true}
            handleSubmit={this.orderingOrder.onFilter}
            reProcessOrder={this.orderingOrder}
          />

          <div className={"standardTable"}>
            <div>
              <Modal
                visible={isShowModal}
                title={`Hủy đơn hàng ${ObjectPath.get(rejectValue, "OrderCode")}`}
                onOk={this.handleReject}
                onCancel={this.orderingOrder.onCancelModal}
                footer={[
                  <Button key="back" onClick={this.orderingOrder.onCancelModal}>Đóng</Button>,
                  <Button
                    icon={"close"}
                    key="submit"
                    style={redBg}
                    loading={isRejecting || false}
                    onClick={this.orderingOrder.handleReject}
                  >
                    Hủy đơn
                  </Button>,
                ]}
              >
                <TextArea
                  placeholder={"Lý do hủy..."}
                  value={ObjectPath.get(rejectValue, "Note", null)}
                  onChange={this.handleChangeReason}
                />
              </Modal>
              <TotalRecord total={pagination.total} name={"đơn hàng"}/>
              <Spin spinning={fetching}>
                <Table
                  dataSource={dataSource.slice()}
                  columns={columns}
                  rowKey={record => record.Code}
                  pagination={pagination}
                  onChange={this.orderingOrder.handleTableChange}
                  footer={() => <TableFooter name={'đơn hàng'} pagination={pagination}/>}
                />
              </Spin>
            </div>
          </div>
        </ContentHolder>
      </PageHeaderLayout>

    )
  }

}