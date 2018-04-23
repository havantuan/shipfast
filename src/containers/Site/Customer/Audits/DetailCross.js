import React, {Component} from 'react';
import ObjectPath from "object-path";
import {Card, Col, Row, Spin, Table, Tag, Icon, Tooltip} from 'antd';
import basicStyle from '../../../../config/basicStyle';
import routerConfig from "../../../../config/router";
import "./Style.css";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import {numberFormat} from "../../../../helpers/utility";
import TotalRecord from "../../../../components/TotalRecord/index";
import DetailCrossTableControl from "./DetailCrossTableControl";
import StatusTag from "../../Common/StatusTag/StatusTag";
import TableFooter from "../../../../components/TableFooter/index";

@inject(Keys.detailcross, Keys.detailOrder)
@observer
export default class DetailCross extends Component {

  constructor(props) {
    super(props);
    this.code = props.match.params.code
  }

  componentDidMount() {
    this.props.detailcross.reload(this.code);
  }

  componentWillUnmount() {
    this.props.detailcross.clear();
  }

  render() {
    const {rowStyle, colStyle, gutter} = basicStyle;
    let {dataSource, fetching, pagination} = this.props.detailcross;
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
    }];

    return (
      <PageHeaderLayout title="Quản lý đối soát">
        <Card title={`Đối soát ${ObjectPath.get(dataSource, "Code")}`}>
          <Spin spinning={fetching || null}>
            <Row justify={"start"} type={"flex"} align={"top"}>
              <Col sm={12} xs={24}>
                <div className={"pickingList-detail"}>
                  <div className={"row-detail"}>
                    <div>Mã</div>
                    <div>
                      <Tag color={"purple"}>{ObjectPath.get(dataSource, "Code")}</Tag>
                    </div>
                  </div>
                  <div className={"row-detail"}>
                    <div>Tổng đơn hoàn</div>
                    <div>
                      {ObjectPath.get(dataSource, "ReturnCount")}
                    </div>
                  </div>
                  <div className={"row-detail"}>
                    <div>Tổng đơn phát</div>
                    <div>
                      {ObjectPath.get(dataSource, "SuccessfulCount", "0")}
                    </div>
                  </div>
                  <div className={"row-detail"}>
                    <div>Số đơn hủy</div>
                    <div>
                      {ObjectPath.get(dataSource, "CancelCount", "0")}
                    </div>
                  </div>
                </div>
              </Col>
              <Col sm={12} xs={24}>
                <div className={"pickingList-detail"}>
                  <div className={"row-detail"}>
                    <div>Tổng phí vận chuyển</div>
                    <div>
                      {numberFormat(ObjectPath.get(dataSource, "TotalCosts", "0"))} đ
                    </div>
                  </div>
                  <div className={"row-detail"}>
                    <div>Tổng Cod</div>
                    <div>
                      {numberFormat(ObjectPath.get(dataSource, "TotalCod", "0"))} đ
                    </div>
                  </div>
                  <div className={"row-detail"}>
                    <div>Tổng khuyến mãi</div>
                    <div>
                      {numberFormat(ObjectPath.get(dataSource, "TotalDiscount", "0"))} đ
                    </div>
                  </div>
                  <div className={"row-detail"}>
                    <div>Giảm giá riêng</div>
                    <div>
                      {numberFormat(ObjectPath.get(dataSource, "DiscountByPolicy", "0"))} đ
                    </div>
                  </div>
                  {
                    dataSource && dataSource.ExtraFee && +dataSource.ExtraFee > 0 &&
                    <div className={"row-detail"}>
                      <div>Phí bổ sung:</div>
                      <div>
                        {numberFormat(dataSource.ExtraFee)} đ
                      </div>
                    </div>
                  }
                  <div className={"row-detail"}>
                    <div>Thực nhận</div>
                    <div>
                      {numberFormat(ObjectPath.get(dataSource, "NetAmount", "0"))} đ
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Spin>
        </Card>

        <Card title={"Danh sách đơn hàng"}>
          <DetailCrossTableControl
            handleSubmit={(query) => this.props.detailcross.onFilter(this.code, query)}
          />
          <div style={{marginTop: 20}}>
            <div className={"standardTable"}>
              <TotalRecord total={this.props.detailcross.pagination.total} name={"đơn hàng"}/>
              <Spin spinning={fetching}>
                <Table
                  dataSource={this.props.detailcross.dataOrder.slice()}
                  columns={columns}
                  rowKey={record => record.ID}
                  pagination={this.props.detailcross.pagination}
                  onChange={(pagination, filters, sort) => this.props.detailcross.handleTableChange(this.code, pagination, filters, sort)}
                  footer={() => <TableFooter name={'đơn hàng'} pagination={pagination}/>}
                  className={"order-table"}
                />
              </Spin>
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }

}

