import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Button, Col, Dropdown, Icon, Menu, Modal, Row, Table, Tabs, Tag} from 'antd';
import ObjectPath from "object-path";
import NumberFormat from "react-number-format";
import LayoutWrapper from '../../../../components/utility/layoutWrapper';
import basicStyle from '../../../../config/basicStyle';
import routerConfig from "../../../../config/router";
import StatusTag from "../../Common/StatusTag/StatusTag";
import {numberFormat} from "../../../../helpers/utility";
import HubList from "../../Common/HubProvider/hubList";
import './Style.css';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import PageTabsCardLayout from "../../../../layouts/PageTabsCardLayout";
import StatusToolTip from "../../Common/StatusToolTip/StatusToolTip";
import {WebSite} from "../../../../helpers/WebSite";

@inject(Keys.router, Keys.detailOrder)
@withRouter
@observer
export default class DetailOrder extends Component {

  print = () => {
    window.open(routerConfig.printMuti.replace(":code", this.props.detailOrder.dataOrder.Code))
  }

  handleToggleEditSurcharge = (value, cost) => {
    this.props.detailOrder.openSurcharge(value, cost);
  };

  handleUpdateSurcharge = () => {
    this.props.detailOrder.updateSurcharge(this.props.detailOrder.dataOrder.Code, {Value: +this.props.detailOrder.surchargeCost});
  };

  constructor(props) {
    super(props);
    this.state = {
      weight: false,
      disabled: false,
      isEditSurcharge: false,
      surchargeCost: 0
    };
  }

  componentWillUnmount() {
    this.props.detailOrder.clear();
  }
  redirectToDetailTask = (e, taskCode) => {
    this.props.detailOrder.closeRootModal();
    e.preventDefault();
    this.props.router.push(routerConfig.detailTask.replace(':code', taskCode));
  }
  handleOk = () => {
    this.props.detailOrder.handleSubmitModal(this.props.detailOrder.dataOrder.Code);
  };

  render() {
    const {rowStyle, gutter, orangeButton, colStyle} = basicStyle;
    let {dataOrder: dataSource} = this.props.detailOrder;

    const history = [{
      title: 'Thời gian',
      dataIndex: '',
      key: '',
      width: 140,
      render: (text, record, index) => <div>
        {record.CreatedAt.Pretty ? record.CreatedAt.Pretty : ''}
      </div>
    }, {
      title: 'Nhân viên giao hàng',
      dataIndex: 'Staff',
      key: 'Staff',
      className: "text-top",
      render: (text, record, index) =>
        <div>
          {record.Staff && (<div>
          <span>{record.Staff && record.Staff.Name ? record.Staff.Name : ''}: </span>
            {record.Staff && record.Staff.Phone ? record.Staff.Phone : ''}</div>)}
        </div>
    }, {
      title: 'Trạng thái',
      dataIndex: 'Status',
      key: '',
      render: (text, record, index) => <div>
        <div>{record.StatusCode && record.StatusCode.Name ?
          <StatusTag value={record.StatusCode ? record.StatusCode : 0}/> : ''}</div>
      </div>
    }, {
      title: 'Địa điểm',
      dataIndex: 'Hub',
      key: 'Hub',
      width: 80,
      render: (text, record, index) => <StatusToolTip value={ObjectPath.get(record, "Hub")}/>
    }, {
      title: 'Ghi chú',
      dataIndex: 'Note',
      key: 'Note',
      width: 150,
      render: (text, record, index) => <div>
        <Tag color="#3d9ecc">{ObjectPath.get(record, "Type")}</Tag>
        <span>{record.Note}</span>
      </div>
    }, {
      title: 'Người Cập nhật',
      dataIndex: 'UpdateBy',
      key: '',
      render: (text, record, index) => <div>
        {record.CreatedBy &&
        record.CreatedBy && record.CreatedBy.Name ? record.CreatedBy.Name : null
        }
      </div>
    }];
    const tasks = [
      {
        title: 'STT',
        dataIndex: '',
        key: '',
        render: (text, record, index) => <span>{index + 1}</span>
      }, {
        title: 'Mã công việc',
        dataIndex: '',
        key: 'taskID',
        render: (text, record, index) =>
          <div><Tag color={"blue"}>
            <Link to={'#'} onClick={(e) => this.redirectToDetailTask(e, record.Code)}>
              {record.Code}
            </Link>
          </Tag>
          </div>
      }, {
        title: 'Điểm gửi hàng',
        dataIndex: 'Hub',
        key: 'Hub',
        render: (text, record, index) => <StatusToolTip color="#8fc5f7" value={ObjectPath.get(record, "Hub")}/>
      }, {
        title: 'Tên bưu tá',
        dataIndex: 'Staff',
        key: 'Staff',
        className: "text-top",
        render: (text, record, index) =>
          <div>
            <span>{record.Staff && record.Staff.Name ? record.Staff.Name : ''}: </span>
            {record.Staff && record.Staff.Phone ? record.Staff.Phone : ''}
          </div>
      }, {
        title: 'Tạo',
        dataIndex: 'Created',
        key: 'Cretated',
        render: (text, record, index) => <div>
          {record.CreatedAt.Pretty ? record.CreatedAt.Pretty : ''}
        </div>
      }, {
        title: 'Còn',
        dataIndex: 'Dealine',
        key: 'Dealine',
        render: (text, record, index) => <div>
          {record.CreatedAt.Deadline ? record.CreatedAt.Deadline : ''}
        </div>
      }, {
        title: 'Cập nhật',
        dataIndex: 'updated',
        key: 'updated',
        render: (text, record, index) => <div>
          {record.ExpiredAt.Pretty ? record.ExpiredAt.Pretty : ''}
        </div>
      }, {
        title: 'Trạng thái',
        dataIndex: 'StatusCode',
        key: 'StatusCode',
        className: "text-top",
        render: (text, record, index) =>
          <div>
            <StatusTag value={record.StatusCode ? record.StatusCode : 0}/>
          </div>
      }
    ];
    const menu = (
      <Menu onClick={this.props.detailOrder.handleMenuClick}>
        <Menu.Item key={`2`}>
          <Icon type="swap"/> Cập nhật điểm thu
        </Menu.Item>
        <Menu.Item key={`3`}>
          <Icon type="swap"/> Cập nhật điểm phát
        </Menu.Item>

      </Menu>
    );
    return (
      <Modal
        visible={this.props.detailOrder.isShowRootModal}
        width='1000px'
        onOk={this.props.detailOrder.closeRootModal}
        onCancel={this.props.detailOrder.closeRootModal}
        footer={null}
      >
        <LayoutWrapper className={"detail-order"}>
          <Row>
            <Modal
              visible={this.props.detailOrder.isShowModal}
              title="Chuyển điểm gửi hàng"
              onOk={this.handleOk}
              onCancel={this.props.detailOrder.onCancelModal}
              footer={[
                <Button key="back" size="large" onClick={this.props.detailOrder.onCancelModal}>Quay lại</Button>,
                <Button htmlType="submit" key="submit" type="primary" size="large" onClick={this.handleOk}>
                  Cập nhật
                </Button>,
              ]}
            >
              <HubList show={true} onChange={this.props.detailOrder.OnchangeHub}
                       value={this.props.detailOrder.hubID ? `${this.props.detailOrder.hubID}` : null}/>
            </Modal>

          </Row>
          {/*<AssginHub />*/}
          <Row justify="start" style={rowStyle} gutter={gutter}>
            <Col md={16} sm={16} style={colStyle}>
              <div>
                <h2 className={"title"}><Icon type="right-square-o"
                                              style={{color: '#27c24c'}}/> {dataSource && dataSource.Name ? dataSource.Name : ''}
                </h2>
              </div>
            </Col>

            <Col sm={8} md={8} style={{textAlign: 'right'}}>
              {WebSite.IsHub() &&
              <Dropdown overlay={menu} trigger={['click']} style={{marginRight: `5px`}}>
                <Button style={{color: "white", backgroundColor: "#52A9D5"}}>
                  Hành động <Icon type="down"/>
                </Button>
              </Dropdown>
              }
              <Button style={orangeButton} onClick={this.print}><Icon type="printer"/>In đơn hàng</Button>
            </Col>

          </Row>
          <PageTabsCardLayout>
            <Tabs type="card">
              <Tabs.TabPane tab={<span><Icon type="book"/>Thông tin</span>} key={'1'}>
                <Row style={rowStyle} gutter={gutter} justify="start">
                  <Col span={8}>
                    <div className='row'>
                      <div>Mã đơn hàng: <Tag
                        color="purple">{dataSource && dataSource.Code ? dataSource.Code : ''}</Tag>
                        <Tag color="#53d168">{dataSource.IsProvincialShipping === true ? 'Nội tỉnh' : 'Liên tỉnh'}</Tag>
                      </div>
                    </div>
                    <div className='row'>
                      Khối lượng: {dataSource.NetWeight} Kg. { ((ObjectPath.get(dataSource, 'Length') && ObjectPath.get(dataSource, 'Length') !== 0) ||
                      (ObjectPath.get(dataSource, 'Width') && ObjectPath.get(dataSource, 'Width') !== 0) ||
                      (ObjectPath.get(dataSource, 'Height') && ObjectPath.get(dataSource, 'Height') !== 0)) ? `Kích thước: ${ObjectPath.get(dataSource, 'Length')}x${ObjectPath.get(dataSource, 'Width')}x${ObjectPath.get(dataSource, 'Height')}` : '' }
                      </div>
                    <div className='row'>
                      Thu hộ: {dataSource.Cod ? numberFormat(dataSource.Cod, 0, '.') : ''} đ. Giá trị hàng: {ObjectPath.has(dataSource, 'Vases') && dataSource.Vases.some(val => val.ID === 4) ?`${numberFormat(ObjectPath.get(dataSource, "PackageValue"))} `: '0'}
                    </div>
                    <div className='row'>
                      {'Phụ phí: '}
                      {
                        this.props.detailOrder.isEditSurcharge === true && WebSite.IsHub() ?
                          <span>
                                                    <NumberFormat
                                                      thousandSeparator={true}
                                                      className="ant-input"
                                                      style={{maxWidth: '100px'}}
                                                      value={this.props.detailOrder.surchargeCost}
                                                      onChange={this.props.detailOrder.handleChangeSurchargeCost}
                                                    />
                            &nbsp;đ
                                                    <Icon
                                                      type="check-square"
                                                      className={'edit-surcharge'}
                                                      style={{color: '#23AD44', marginLeft: '20px'}}
                                                      onClick={this.handleUpdateSurcharge}
                                                    />
                                                    <Icon
                                                      type="close-square-o"
                                                      className={'edit-surcharge'}
                                                      style={{color: '#EE3939'}}
                                                      onClick={() => this.handleToggleEditSurcharge(false, 0)}
                                                    />
                                                </span>
                          :
                          <span>
                                                    {dataSource.SurchargeCost ? numberFormat(dataSource.SurchargeCost, 0, '.') : '0'}
                            {WebSite.IsHub() &&
                            <Icon
                              type="edit"
                              className={'cursor-pointer'}
                              style={{color: '#3993cf', marginLeft: '20px'}}
                              onClick={() => this.handleToggleEditSurcharge(true, dataSource.SurchargeCost)}
                            />
                            }
                                                </span>
                      }
                    </div>
                    {ObjectPath.get(dataSource, 'DiscountCode') &&
                    <div className='row'>
                      {'Mã khuyến mãi: '}

                      {ObjectPath.get(dataSource, 'DiscountCode')}

                    </div>
                    }
                    {
                      dataSource.ReturningCost && +dataSource.ReturningCost > 0 &&
                      <div className='row'>
                        {'Phí chuyển hoàn: '}
                        {dataSource.ReturningCost ? numberFormat(dataSource.ReturningCost, 0, '.') : '0'}
                      </div>
                    }
                    <div className='row'>
                      {'Tổng phí: '}
                      {dataSource.TotalCost ? numberFormat(dataSource.TotalCost, 0, '.') : '0'}
                    </div>
                    <div className='row'>
                      {'Người thanh toán phí: '}
                      <b>{dataSource.PaymentType && dataSource.PaymentType.Name ? dataSource.PaymentType.Name : ''}</b>
                    </div>
                    {ObjectPath.get(dataSource, 'DeliveryNote') &&
                    <div className='row'>
                      <span color="red">Ghi chú:</span>
                      {dataSource && dataSource.DeliveryNote ? dataSource.DeliveryNote : ''}
                    </div>
                    }
                    <div className='row'>
                      {dataSource.IsPickupInHub ? 'Nhận hàng tại bưu cục': ''}
                    </div>
                  </Col>
                  <Col span={9}>
                    <div className='row'>
                      Dịch vụ: <Tag
                      color="pink">{dataSource.ServiceType && dataSource.ServiceType ? dataSource.ServiceType.Name : ''}</Tag>
                      {dataSource.Vases && dataSource.Vases.map((val, index) => {
                        return (
                          <Tag color="#87d068" key={index}>{val.Name}</Tag>
                        )
                      })}
                    </div>
                    <div className='row'>
                      {'Người gửi: '}

                      {dataSource && dataSource.Sender && dataSource.Sender.Name ? dataSource.Sender.Name : ''},
                      {dataSource && dataSource.Sender && dataSource.Sender.Phone ? dataSource.Sender.Phone : ''}
                    </div>
                    <div className={'row'}>
                      {'Địa chỉ thu: '}
                      <b>{dataSource && dataSource.Sender && dataSource.Sender.Address ? dataSource.Sender.Address : ''}</b>
                    </div>

                    <div className='row'>
                      {'Người nhận: '}
                      {dataSource && dataSource.Receiver && dataSource.Receiver.Name ? dataSource.Receiver.Name : ''},
                      {dataSource && dataSource.Receiver && dataSource.Receiver.Phone ? dataSource.Receiver.Phone : ''}
                    </div>
                    <div className={'row'}>
                      {'Địa chỉ phát: '}
                      <b>{dataSource && dataSource.Receiver && dataSource.Receiver.Address ? dataSource.Receiver.Address : ''}</b>
                    </div>
                    <div className='row'>
                      Khách hàng: <b>{ObjectPath.get(dataSource.Customer, "CustomerCode")}</b>
                      - {ObjectPath.get(dataSource.Customer, "Name")} - {ObjectPath.get(dataSource, "Customer.Phone")}
                    </div>
                  </Col>
                  <Col span={7}>
                    <div className="row">
                      Trạng thái: <StatusTag value={ObjectPath.get(dataSource, "StatusCode")}/>
                    </div>
                    <div className='row'>
                      Ngày tạo: {dataSource && dataSource.CreatedAt ? dataSource.CreatedAt.Pretty : ''}
                    </div>
                    <div className='row'>
                      Điểm thu: <StatusToolTip
                      value={ObjectPath.get(dataSource, "Sender.Hub")}/>
                    </div>
                    <div className='row'>
                      Điểm phát: <StatusToolTip
                      value={ObjectPath.get(dataSource, "Receiver.Hub")}/>
                    </div>
                    {ObjectPath.get(dataSource, "CurrentHub") &&
                    <div className='row'>
                      Điểm hiện tại: <StatusToolTip
                      color="#7698e0" value={ObjectPath.get(dataSource, "CurrentHub")}/>
                    </div>
                    }
                    <div className='row'>
                      Thời gian
                      thu: {dataSource && dataSource.SuccessPickupTime ? dataSource.SuccessPickupTime.Pretty : ''}
                    </div>
                    <div className='row'>
                      Thời gian
                      phát: {dataSource && dataSource.SuccessDeliveryTime ? dataSource.SuccessDeliveryTime.Pretty : ''}
                    </div>
                    <div className='row'>
                      Thời gian
                      hoàn: {dataSource && dataSource.ReturningTime ? dataSource.ReturningTime.Pretty : ''}
                    </div>

                  </Col>

                </Row>
              </Tabs.TabPane>
              <Tabs.TabPane tab={<span><Icon type="calendar"/>Hành trình</span>} key={'2'}>
                <Table
                  style={{marginTop: '10px'}}
                  dataSource={dataSource.OrderHistory ? dataSource.OrderHistory.slice() : []}
                  columns={history}
                  rowKey={(record, index) => index}
                  pagination={false}
                  className={"order-history"}
                />
              </Tabs.TabPane>
              {WebSite.IsHub() &&
              <Tabs.TabPane tab={<span><Icon type="appstore"/>Công việc</span>} key={'3'}>
                <Table
                  dataSource={dataSource.Tasks ? dataSource.Tasks.slice() : []}
                  columns={tasks}
                  rowKey={(record, index) => index}
                  pagination={false}
                />
              </Tabs.TabPane>
              }
            </Tabs>

          </PageTabsCardLayout>
        </LayoutWrapper>
      </Modal>
    )
  }

}

