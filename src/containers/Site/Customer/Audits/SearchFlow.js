import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Card, Spin, Table, Tag} from 'antd';
import SearchFlowControl from "./SearchFlowControl";
import ObjectPath from "object-path";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import {numberFormat} from "../../../../helpers/utility";
import StatusTag from "../../Common/StatusTag/StatusTag";
import TotalRecord from "../../../../components/TotalRecord/index";
import routerUserConfig from "../../../../config/routerUser";

@inject(Keys.meCross, Keys.me)
@observer
export  default class SearchFlow extends Component {

    constructor(props) {
        super(props);
        this.meCross = props.meCross
    }

    componentDidMount() {
        this.meCross.reload();
    }
    render() {
        let {dataCross: dataSource, fetching, pagination} = this.props.meCross;
        console.log('%c dataSource ....', 'color: #00b33c', dataSource.slice())
        let counter = this.meCross.pagination.pageSize * (this.meCross.pagination.current - 1);
        let columns = [{
            title: 'TT',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => <span>{index + 1 + counter}</span>
        }, {
            title: 'Đối soát',
            dataIndex: 'Code',
            key: 'Code',
            render: (text, record, index) => <Tag color="green"><Link to={routerUserConfig.crossDetail.replace(":code", record.Code)}>{record.Code}</Link> </Tag>,
            sorter: true
        }, {
            title: 'Đơn hàng',
            dataIndex: 'TotalOrders',
            key: 'TotalOrders',
          render: (text, record, index) =><div>
            <p><b>Tổng đơn: </b>{ObjectPath.get(record, "TotalOrders")}</p>
            <p><b>Đơn thành công: </b>{ObjectPath.get(record, "SuccessfulCount")}</p>
            <p><b>Số đơn hủy: </b>{ObjectPath.get(record, "CancelCount")}</p>
          </div>,
        }, {
            title: 'Thu khách hàng',
            dataIndex: 'City',
            key: 'City',
            render: (text, record, index) => <div>{numberFormat(ObjectPath.get(record, "TotalCod"))} đ
            </div>
        },{
          title: 'Phí',
          dataIndex: 'TotalCosts',
          key: 'TotalCosts',
          render: (text, record, index) => <div>{numberFormat(ObjectPath.get(record, "TotalCosts"))} đ
          </div>
        },{
          title: 'Trạng thái',
          dataIndex: 'StatusCode',
          key: 'StatusCode',
          render: (text, record, index) => <StatusTag value={ObjectPath.get(record, "StatusCode")}/>
        },{
            title: 'Thực nhận',
            dataIndex: 'NetAmount',
            key: 'NetAmount',
            render: (text, record, index) => <div>{numberFormat(ObjectPath.get(record, "NetAmount"))} đ
                </div>
        }];

        return (
            <Card title="Chỉ mục tìm kiếm" style={{marginTop: 20}} bodyStyle={{padding : "5px 10px"}}>

                    <SearchFlowControl/>
                    <div style={{marginTop: 20}}>
                        <div className={"standardTable"}>
                            <TotalRecord total={pagination.total} name={"đối soát"}/>
                            <Spin spinning={fetching}>
                                <Table
                                    dataSource={dataSource.slice()}
                                    columns={columns}
                                    rowKey={record => record.Code}
                                    pagination={this.props.meCross.pagination}
                                    onChange={this.props.meCross.handleTableChange}
                                />
                            </Spin>
                        </div>
                    </div>
            </Card>
        )
    }

}

