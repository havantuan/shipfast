import React, {Component} from 'react';
import {Button, Icon, Table, Tag, Spin} from 'antd';
import ObjectPath from 'object-path';
import './Style.css';
import LabelStatus from '../../Common/StatusTag/LabelStatus';
import StatusTag from '../../Common/StatusTag/StatusTag';
import {numberFormat} from "../../../../helpers/utility";
import routerConfig from "../../../../config/router";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";


@inject(Keys.assignHandOver, Keys.detailOrder)
@observer
export default class OrderHandOverTable extends Component {

  constructor(props) {
    super(props);
    this.assignHandOver = props.assignHandOver;
  }

  componentWillUnmount() {
    this.assignHandOver.clear();
  }

  rejectHandOver = (e, code, type) => {
    e.preventDefault();
    this.assignHandOver.rejectHandOver(code, type);
  };

  printHandOver = () => {
    window.open(routerConfig.printHandOver.replace(":code", `${this.assignHandOver.codeConfirmSuccess}`));
  };

  handleCheck(array, val) {
    return array.some(item => val === item);
  }

  render() {
    const {tableData = [], label, isFetchingTable} = this.assignHandOver;

    const labelContent = (record) => {
      return {
        children: <LabelStatus status={record.Status} total={record.Total}/>,
        props: {
          colSpan: 5,
        },
      };
    };

    const columns = [{
      title: '',
      key: 'delete',
      width: '40px',
      className: 'col-center',
      render: (text, record, index) => {
        return (
          this.handleCheck(label, index) ?
            labelContent(record)
            :
            <a href="#" onClick={(e) => this.rejectHandOver(e, record.Code, record.TaskType.Code)}>
              <Icon type="delete"/>
            </a>
        )
      }
    }, {
      title: 'Đơn hàng',
      dataIndex: '',
      key: 'order',
      render: (text, record, index) => {
        return (
          this.handleCheck(label, index) ?
            {props: {colSpan: 0}}
            :
            <div>
              <div style={{paddingBottom: 5}}>
                <Tag color={"blue"} onClick={(e) => this.props.detailOrder.showRootModal(record.Code)}>
                  <span>{record.Code}</span>
                </Tag>
              </div>
              {record.StatusCode && <StatusTag value={record.StatusCode}/>}
            </div>
        )
      }
    }, {
      title: 'Khối lượng (Kg)',
      dataIndex: '',
      key: 'weight',
      className: 'col-right',
      width: '15%',
      render: (text, record, index) => {
        return (
          this.handleCheck(label, index) ?
            {props: {colSpan: 0}}
            :
            <span>{numberFormat(record.NetWeight)}</span>
        )
      }
    }, {
      title: 'Trạng thái bàn giao',
      dataIndex: '',
      key: 'status',
      render: (text, record, index) => {
        return (
          this.handleCheck(label, index) ?
            {props: {colSpan: 0}}
            :
            record.HandOverStatusCodes &&
            <StatusTag value={record.HandOverStatusCodes[0]}/>
        )
      }
    }, {
      title: 'Xử lý',
      key: 'process',
      render: (text, record, index) => {
        return (
          this.handleCheck(label, index) ?
            {props: {colSpan: 0}}
            :
            <div>
              {
                ObjectPath.get(record, 'TaskType.Code', '').toUpperCase() === "PICKUP" &&
                <Button
                  type={'danger'}
                  size={'small'}
                  icon={'exclamation'}
                  loading={this.assignHandOver.isConfirmingOverWeight}
                  onClick={() => this.assignHandOver.handleConfirmOverWeight(record.Code)}
                >
                  Vượt cân
                </Button>
              }
            </div>
        )
      }
    }];

    return (
      <div>
        <Spin spinning={isFetchingTable}>
          <Table
            bordered
            size="middle"
            dataSource={tableData.slice()}
            columns={columns}
            rowKey={(record, index) => index}
            pagination={false}
          />
        </Spin>

        <div style={{textAlign: 'right', marginTop: '10px'}}>
          {
            this.assignHandOver.handOverConfirmed ?
              this.assignHandOver.codeConfirmSuccess &&
              <Button
                icon={'printer'}
                className={"orange-button"}
                onClick={this.printHandOver}
              >
                In phiếu
              </Button>
              :
              tableData && tableData.length > 0 &&
              <Button
                icon="check-circle-o"
                className="green-button"
                type="primary"
                loading={this.assignHandOver.isConfirmingHandOver}
                onClick={this.assignHandOver.handleConfirmHandOver}
              >
                {'Xác nhận bàn giao'}
              </Button>
          }
        </div>
      </div>
    )
  }

}
