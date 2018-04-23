import React, {Component} from 'react';
import {Link,} from 'react-router-dom';
import ObjectPath from "object-path";
import {Button, Spin, Table, Tag, Icon} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import basicStyle from '../../../../config/basicStyle';
import routerConfig from "../../../../config/router";
import './Style.css';
import ListTableControl from "./ListTableControl";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import TableFooter from "../../../../components/TableFooter/index";
import StatusToolTip from '../../Common/StatusToolTip/StatusToolTip';

@inject(Keys.pickingList, Keys.router)
@observer
export default class ListTable extends Component {

  constructor(props) {
    super(props);
    this.pickingList = props.pickingList;
  }

  componentDidMount() {
    this.pickingList.reload();
  }
  redirectToPrint = (e, orderCode) => {
    e.preventDefault();
    window.open(routerConfig.printList.replace(":code", orderCode));
  };
  render() {
    const {greenBg} = basicStyle;
    let {dataSource, fetching, pagination} = this.pickingList;
    let counter = pagination.pageSize * (pagination.current - 1);

    let columns = [{
      title: '#',
      dataIndex: '',
      key: 'index',
      render: (text, record, index) => <span>{index + 1 + counter}</span>
    }, {
      title: 'Mã bảng kê',
      dataIndex: 'Code',
      key: 'listID',
      render: (text, record, index) =>
        <Link to={routerConfig.listDetail.replace(":code", text)}>
          <Tag color={"purple"}>{text}</Tag>
        </Link>
    }, {
      title: 'Loại bảng kê',
      dataIndex: 'Type',
      key: 'type',
      render: (text, record, index) => <span>{text && text.Name}</span>
    }, {
      title: 'Trạng thái',
      dataIndex: 'Status',
      key: 'status',
      render: (text, record, index) =>
        <Tag color={text && text.Color}>
          {text && text.Name}
        </Tag>
    }, {
      title: 'Điểm thu',
      dataIndex: 'SourceHub',
      key: 'hubCreated',
      render: (text, record, index) => <StatusToolTip value={ObjectPath.get(record, "SourceHub")}/>
    }, {
      title: 'Điểm phát',
      dataIndex: 'DestinationHub',
      key: 'hubReceiver',
      render: (text, record, index) => <StatusToolTip value={ObjectPath.get(record, "DestinationHub")}/>
    }, {
      title: 'Số lượng',
      dataIndex: 'Entries',
      key: 'quantity',
      render: (text, record, index) => <span>{text.length}</span>
    }, {
      title: '(Kg)',
      dataIndex: 'Weight',
      key: 'weight',
      render: (text, record, index) => <span>{text || '0'}</span>
    }, {
      title: 'Thời gian tạo',
      dataIndex: 'CreatedAt',
      key: 'dateCreated',
      render: (text, record, index) => <span>{text && text.Pretty}</span>
    }, {
      title: 'Hành động',
      dataIndex: '',
      key: 'action',
      render: (text, record, index) =>
        <div>
          {
            ObjectPath.has(record, "Status.Code") && ObjectPath.get(record, "Status.Code") === 100 &&
            <Button
              size={"small"}
              icon={"forward"}
              style={greenBg}
              onClick={() => this.props.router.push(routerConfig.receiveListWithCode.replace(":code", record && record.Code))}
            >
              Xác nhận
            </Button>
          }
        </div>
    }, {
      title: 'In',
      dataIndex: 'Print',
      key: 'Print',
      render: (text, record, index) => <Button size={'small'} style={basicStyle.orangeButton} onClick={(e) => this.redirectToPrint(e, record.Code)} icon={'printer'}>In phiếu</Button>
    }];

    return (
      <PageHeaderLayout
        title={'Bảng kê'}
      >
        <ContentHolder>
          <div style={{marginBottom: '16px'}}>
            <ListTableControl/>
          </div>

          <div className={"standardTable"}>
            <Spin spinning={fetching || null}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.Code}
                pagination={pagination}
                onChange={this.pickingList.handleTableChange}
                footer={() => <TableFooter name={'bản ghi'} pagination={pagination}/>}
              />
            </Spin>
          </div>

        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}