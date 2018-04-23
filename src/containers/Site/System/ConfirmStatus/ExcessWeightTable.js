import React, {Component} from 'react';
import ObjectPath from "object-path";
import {Button, Form, Icon, Input, Spin, Table, Tag, Tooltip} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import ConfirmTableControl from "../../Common/ConfirmStatus/ConfirmTableControl";
import TotalRecord from "../../../../components/TotalRecord/index";
import PageLayout from "../../../../layouts/PageLayout";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

import {ReProcessOrderStore} from "../../../../stores/orders/reProcessOrderStore";

const eventCode = 700;

@Form.create()
@inject(Keys.me, Keys.detailOrder)
@observer
export default class ExcessWeightTable extends Component {

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
            prefixFormID={'ExcessWeight'}
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
    let ordersWeight = this.reProcessOrder.ordersWeight ? this.reProcessOrder.ordersWeight.slice() : [];
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
            <b>Trọng lượng: </b>
            <span>{ObjectPath.get(record, 'NetWeight')} kg</span>
          </p>
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
      title: 'Xử lý',
      key: 'process',
      render: (text, record, index) => {
        let check = !!(ordersWeight && ordersWeight.find(val => val.code === orderCode) !== undefined);
        return (
          <div>
            <b>Trọng lượng:</b> (gram)
            <div style={{textAlign: 'center'}}>
              <Input
                placeholder={`${record.NetWeight * 1000} gram`}
                value={check ? ordersWeight.find(val => val.code === orderCode).value : null}
                onChange={(e) => this.reProcessOrder.onChangeWeight(e.target.value, record.Code)}
              />

              <Button
                type={'primary'}
                size={'small'}
                style={{marginTop: '5px'}}
                disabled={!(check && ordersWeight.find(val => val.code === orderCode).value > 0)}
                onClick={() => this.reProcessOrder.handlePerformOverWeight(record.Code)}
              >
                Cập nhật
              </Button>
            </div>
          </div>
        )
      }
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