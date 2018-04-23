import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ObjectPath from "object-path";
import {Button, Dropdown, Icon, Input, Menu, Modal, Spin, Table, Tag, Tooltip} from 'antd';
import routerConfig from "../../../../config/router";
import routerUserConfig from "../../../../config/routerUser";
import './Style.css';
import {numberFormat} from "../../../../helpers/utility";
import basicStyle from "../../../../config/basicStyle";
import StatusTag from "../../Common/StatusTag/StatusTag";
import TotalRecord from "../../../../components/TotalRecord/index";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import TableFooter from "../../../../components/TableFooter/index";

const {TextArea} = Input;
@inject(Keys.myOrder, Keys.router, Keys.detailOrder)
@observer
export default class OrderTable extends Component {
  constructor(props) {
    super(props);
    this.myOrder = props.myOrder;
    this.router = props.router;
  }

  showModal = (e, record) => {
    e.preventDefault();
    this.setState({
      visible: true,
      titleOrder: record,
      reasonCancel: ''
    });
  };

  handleReject = () => {
    let {titleOrder, reasonCancel} = this.state;
    console.log("%c titleOrer", 'color: #00b33c', titleOrder, reasonCancel);
    this.props.canCelOrder(titleOrder, reasonCancel)
  };

  redirectToPrintOrder = (e, orderCode) => {
    e.preventDefault();
    window.open(routerConfig.printMuti.replace(":code", orderCode));
  };

  redirectToUpdateOrder = (e, orderCode) => {
    e.preventDefault();
    this.router.push(routerUserConfig.updateOrder.replace(':code', orderCode));
  };

  showUpdateModel = (e, code) => {
    e.preventDefault();
    this.myOrder.showUpdateModel(code);
  };

  componentWillUnmount() {
    this.myOrder.clear();
  }

  render() {
    // let {visible, titleOrder} = this.state;
    let {dataSource, fetching, pagination} = this.myOrder;

    // const {CancelOrderData} = this.props;
    let counter = pagination.pageSize * (pagination.current - 1);

    const {redBg} = basicStyle;
    const columns = [{
      title: '#',
      dataIndex: '',
      key: 'index',
      width: 5,
      render: (text, record, index) => <span>{index + 1 + counter}</span>
    }, {
      title: 'Đơn hàng',
      dataIndex: 'Code',
      key: 'Code',
      width: 50,
      sorter: true,
      render: (text, record, index) =>
        <div className={'tableCellItem tagList'}>
          <div className={'item'}>
            <Tag color={"blue"} onClick={(e) => this.props.detailOrder.showRootModal(record.Code)}>
              <span>{record.Code}</span>
            </Tag>
          </div>
          <div className={'item'}>

            <Tag color="purple">{ObjectPath.get(record, "ServiceType.Name")}</Tag>
          </div>
          {
            ObjectPath.get(record, "Vases", []).length > 0 &&
            ObjectPath.get(record, "Vases", []).map((vas, i) =>
              <div className={'item'} key={i}>
                <Tag color="purple">{vas.Name}</Tag>
              </div>
            )
          }
        </div>
    }, {
      title: 'Sản phẩm',
      dataIndex: 'Name',
      width: 280,
      key: 'Name',
      render: (text, record, index) =>
        <div className={'tableCellItem'}>
          <p className={'item'}>
            <span><b>{text}</b></span>
          </p>
          <p className={'item'}>
            {'Ngày Tạo: '}{ObjectPath.get(record, "CreatedAt.Pretty")}
          </p>
          <div className={'item'}>
            <StatusTag value={ObjectPath.get(record, 'StatusCode', {})}/>
          </div>
        </div>
    },
      {
        title: 'Phí / Thu hộ',
        dataIndex: 'Cost',
        width: 50,
        key: 'Cost',
        render: (text, record, index) =>
          <div className={'tableCellItem'}>
            <p>
              <span className="font-bold">Cod: </span>
              <span className="nowrap">{record.Cod ? numberFormat(record.Cod, 0, '.') : '0'}</span>
            </p>
            <p>
              <span className="font-bold">Cước: </span>
              <span className="nowrap">{record.TotalCost ? numberFormat(record.TotalCost, 0, '.') : '0'}</span>
            </p>
            <p>
              <Tooltip placement="bottom" title={`${record.PaymentType.Name} thanh toán`}>
                <b>{record.PaymentType.Name}</b>
              </Tooltip>
            </p>
          </div>
      }, {
        title: 'Người nhận',
        dataIndex: 'Receiver',
        key: 'Receiver',
        width: 250,
        render: (text, record, index) =>
          <div>
            <p><Icon type="user"/> {ObjectPath.get(text, 'Name')} , {ObjectPath.get(text, 'Phone')}</p>
            <p>
              <Icon type="environment"/>
              <span className="font-bold">Phát: </span> {ObjectPath.get(text, 'Address')}
              {
                text.Address &&
                <a href={`https://www.google.com/maps/place/${text.Address}`} target="_blank"
                   style={{marginLeft: '5px'}}>
                  <Icon type="global"/>
                </a>
              }
            </p>
          </div>
      }, {
        title: 'Xử lý',
        width: 50,
        dataIndex: '',
        key: 'action',
        render: (text, record, index) => {
          const menu = (
            <Menu>
              <Menu.Item key="printer">
                <Link to={'#'} onClick={(e) => this.redirectToPrintOrder(e, record.Code)}>
                  <Icon type="printer"/> In phiếu
                </Link>
              </Menu.Item>

              {
                record.AllowUpdateByUser === true &&
                <Menu.Item key="edit">
                  <Link to={'#'} onClick={(e) => this.redirectToUpdateOrder(e, record.Code)}>
                    <Icon type="edit"/> Chỉnh sửa
                  </Link>
                </Menu.Item>
              }

              {
                record.AllowCancelByUser === true &&
                <Menu.Item key="cancel">
                  <Link to={'#'} onClick={(e) => this.showUpdateModel(e, record.Code)}>
                    <Icon type="close"/> Hủy
                  </Link>
                </Menu.Item>
              }
            </Menu>
          );

          return (
            <Dropdown overlay={menu} trigger={['click']}>
              <Button
                icon="ellipsis"
              >
              </Button>
            </Dropdown>
          )
        }
      }];

    return (
      <div>
        <Modal
          visible={this.myOrder.visible}
          title={`Hủy đơn hàng ${this.myOrder.titleOrder}`}
          onOk={this.myOrder.onOkModel}
          onCancel={this.myOrder.onCancelModal}
          footer={[
            <Button
              key="back"
              onClick={this.myOrder.onCancelModal}
            >
              Đóng
            </Button>,
            <Button
              icon={"close"}
              key="submit"
              style={redBg}
              // loading={(CancelOrderData && CancelOrderData.fetching) || false}
              onClick={this.myOrder.handleReject}
            >
              Hủy đơn
            </Button>,
          ]}
        >
          <TextArea
            placeholder={"Lý do hủy..."}
            value={this.myOrder.reasonCancel}
            onChange={(e) => this.myOrder.handleChangeReason(e.target.value)}
          />
        </Modal>

        <div style={{marginTop: 20}}>
          <div className={"standardTable"}>
            <TotalRecord total={pagination.total} name={"đơn hàng"}/>
            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.Code}
                pagination={pagination}
                onChange={this.myOrder.handleTableChange}
                footer={() => <TableFooter name={'đơn hàng'} pagination={pagination}/>}
                className={"order-table"}
              />
            </Spin>
          </div>
        </div>
      </div>
    )
  }

}

