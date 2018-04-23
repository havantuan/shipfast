import React, {Component} from 'react';
import {Form, Icon, Tag, Table, Spin, Tooltip} from 'antd';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import ObjectPath from "object-path";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import ContentHolder from "../../../../components/utility/ContentHolder";
import TotalRecord from "../../../../components/TotalRecord/index";
import TableFooter from "../../../../components/TableFooter/index";
import {numberFormat} from "../../../../helpers/utility";
import StatusTag from "../../Common/StatusTag/StatusTag";
import OrderListControl from "./OrderListControl";
import routerConfig from "../../../../config/router";

@Form.create()
@inject(Keys.cross, Keys.staffByUser, Keys.customerDebt, Keys.detailOrder, Keys.order, Keys.router)
@observer
export default class CrossForm extends Component {
  constructor(props) {
    super(props);
    this.order = props.order;
    this.router = props.router;
  }

  componentDidMount() {
    this.props.cross.reload();
  }

  redirectToPrintOrder = (e, orderCode) => {
    e.preventDefault();
    window.open(routerConfig.printMuti.replace(":code", orderCode));
  };

  render() {
    let {isUpdateMode} = this.props.cross;
    let {fetching, pagination} = this.props.cross;
    let counter = pagination.pageSize * (pagination.current - 1);
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
    }, {
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
      title: 'Khách hàng',
      dataIndex: 'Customer',
      key: 'Customer',
      width: 250,
      render: (text, record, index) =>
        <div>
          <p><Icon type="user"/> <b>{ObjectPath.get(record, 'Customer.CustomerCode')}</b>
            , {ObjectPath.get(record, 'Customer.Name')}</p>
          <p>
            <Icon type="phone"/> {ObjectPath.get(record, 'Customer.Phone')}
          </p>
        </div>
    }, {
      title: 'Ngày đối soát',
      dataIndex: 'CrossDate',
      key: 'CrossDate',
      width: 60,
      render: (text, record, index) => <div>
        {record.ReturningTime.Pretty !== null ? record.ReturningTime.Pretty : (record.SuccessDeliveryTime.Pretty !== null ? record.SuccessDeliveryTime.Pretty : '')}
      </div>
    }];
    return (
      <PageHeaderLayout title={`${isUpdateMode ? 'Cập nhật đối soát' : 'Tạo đối soát'}`}>
        <ContentHolder>
          {/*<Row style={rowStyle} gutter={gutter} justify="start">*/}
          {/*<Col md={24} sm={24} xs={24}>*/}
          {/*<CashFlowInformation dataSource={this.props.customerDebt.dataSource}/>*/}
          {/*</Col>*/}
          {/*</Row>*/}
          <div className={"standardTable"}>
            <OrderListControl handleSubmit={this.props.cross.onFilter}/>

            <div style={{marginTop: 10}}>
              <TotalRecord total={this.props.cross.pagination.total} name={"đơn hàng"}/>
            </div>

            <Spin spinning={fetching}>
              <Table
                dataSource={this.props.cross.dataOrder && this.props.cross.dataOrder.slice()}
                columns={columns}
                rowKey={record => record.Code}
                pagination={this.props.cross.pagination}
                onChange={this.props.cross.handleTableChange}
                footer={() => <TableFooter name={'đơn hàng'} pagination={pagination}/>}
                className={"order-table"}
              />
            </Spin>
          </div>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }
}

