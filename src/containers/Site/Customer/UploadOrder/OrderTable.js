import React from 'react';
import {Alert, Icon, Table, Tag, Tooltip} from 'antd';
import {inject, observer} from 'mobx-react';
import {isObservableArray} from 'mobx';
import {Keys} from "../../../../stores/index";
import {numberFormat} from "../../../../helpers/utility";
import ObjectPath from 'object-path';
import './Style.css';

@inject(Keys.uploadOrder)
@observer
export default class OrderTable extends React.PureComponent {

  constructor(props) {
    super(props);
    this.uploadOrder = props.uploadOrder;
  }

  render() {
    let {response, selectedRowKeys} = this.uploadOrder;
    const columns = [{
      title: 'Đơn hàng',
      key: 'order',
      render: (text, record, index) =>
        <div className={'tagList'}>
          {
            record.Code &&
            <div>
              <Tag color={"blue"}>
                {record.Code}
              </Tag>
            </div>
          }
          <div>
            <Icon type="shopping-cart"/>&nbsp;
            <Tag color="purple">{ObjectPath.get(record, "ServiceTypeName", '')}</Tag>
          </div>
          {
            ObjectPath.get(record, "VasNames", []).length > 0 &&
            ObjectPath.get(record, "VasNames", []).map((vas, i) =>
              <div key={i}>
                <Icon type="tag-o"/> <Tag color="green">{vas}</Tag>
              </div>
            )
          }
          {
            record && record.DiscountCode &&
            <div>
              <Icon type="gift" />&nbsp;
              <span className={'font-bold'}>{'Mã KM: '}</span>
              <Tag color={'red'}>{record.DiscountCode}</Tag>
            </div>
          }
          {
            record && record.CanCheck === 1 &&
            <div>
              <Icon type="tag" />&nbsp;
              <Tag color={'geekblue'}>{'Cho xem hàng khi nhận'}</Tag>
            </div>
          }
        </div>
    }, {
      title: 'Sản phẩm',
      key: 'name',
      colSpan: 2,
      render: (text, record, index) =>
        <div>
          <p>
            <span className="font-bold">Tên SP: </span>
            <span>{ObjectPath.get(record, 'Name')}</span>
          </p>
          <p>
            <span className="font-bold">Khối lượng: </span>
            <span>{`${ObjectPath.get(record, 'NetWeight', 0)} gram`}</span>
          </p>
          <Tooltip placement={'top'} title={'dài x rộng x cao (cm)'}>
            <p>
              <span className="font-bold">Kích thước: </span>
              <span className="nowrap">{ObjectPath.get(record, 'Length')}</span>
              {' x '}
              <span className="nowrap">{ObjectPath.get(record, 'Width')}</span>
              {' x '}
              <span className="nowrap">{ObjectPath.get(record, 'Height')}</span>
            </p>
          </Tooltip>
        </div>
    }, {
      key: 'orderValue',
      colSpan: 0,
      render: (text, record, index) =>
        <div>
          <p>
            <span className="font-bold">Cod: </span>
            <span className="nowrap">{record.Cod ? numberFormat(record.Cod, 0, '.') : '0'} đ</span>
          </p>
          <p>
            <span className="font-bold">Giá trị gói hàng: </span>
            <span className="nowrap">{record.PackageValue ? numberFormat(record.PackageValue, 0, '.') : '0'} đ</span>
          </p>
          <p>
            <span className="font-bold">Thanh toán: </span>
            <span>{ObjectPath.get(record, 'PaymentTypeName')}</span>
          </p>
          {
            record && record.DeliveryNote &&
            <p style={{color: '#ff3333', fontStyle: 'italic'}}>
              <span>{'Ghi chú: '}</span>
              <span>{ObjectPath.get(record, 'DeliveryNote')}</span>
            </p>
          }
        </div>
    }, {
      title: 'Người nhận',
      key: 'receiver',
      render: (text, record, index) =>
        <div>
          <p><Icon type="user"/> {ObjectPath.get(record, 'ReceiverName')}</p>
          <p><Icon type="phone"/> {ObjectPath.get(record, 'ReceiverPhone')}</p>
          <p>
            <Icon type="environment"/>
            <span>{ObjectPath.get(record, 'FullAddress')}</span>
            {
              record.ReceiverFullAddress &&
              <a href={`https://www.google.com/maps/place/${record.FullAddress}`} target="_blank"
                 style={{marginLeft: '5px'}}>
                <Icon type="global"/>
              </a>
            }
          </p>
        </div>
    }];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.uploadOrder.onSelectChange,
    };
    const hasSelected = isObservableArray(selectedRowKeys) ? selectedRowKeys.slice().length > 0 : false;

    return (
      <div>
        <div>
          {
            hasSelected &&
            <Alert
              message={`Đã chọn ${selectedRowKeys.slice().length} / ${response.slice().length} đơn hàng`}
              type="info"
              showIcon
            />
          }
        </div>

        <Table
          bordered
          rowSelection={rowSelection}
          dataSource={isObservableArray(response) ? response.slice() : []}
          columns={columns}
          rowKey={(record, index) => index}
          pagination={false}
        />
      </div>
    )
  }

}