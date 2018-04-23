import React, {Component} from 'react';
import ObjectPath from 'object-path';

import {Button, Col, Dropdown, Icon, Menu, Row, Spin, Switch, Table, Tag} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import DiscountTableControl from "./DiscountTableControl";
import Permission from "../../../../permissions/index";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import DiscountModal from "./DiscountModal";

import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import TotalRecord from '../../../../components/TotalRecord/index';
import {numberFormat} from "../../../../helpers/utility";

@inject(Keys.discount)
@observer
export default class DiscountTable extends Component {

  constructor(props) {
    super(props);
    this.discount = this.props.discount;
  }

  componentDidMount() {
    this.discount.reload();
  };

  componentWillUnmount() {
    this.discount.clear();
  }


  handleClickMenu = (id, {item, key, keyPath}) => {
    switch (key) {
      case 'edit':
        this.discount.showUpdateModal(id);
        break;
      default:
        return;
    }
  };

  render() {
    let {dataSource, fetching} = this.discount;
    let counter = this.discount.pagination.pageSize * (this.discount.pagination.current - 1);
    let columns = [{
      title: '#',
      dataIndex: '',
      key: 'index',
      render: (text, record, index) => <span>{index + 1 + counter}</span>
    }, {
      title: 'Tên',
      dataIndex: 'Name',
      key: 'name',
      render: (text, record, index) => <div>
        <p>{text}</p>
        {ObjectPath.get(record, "RequireCode") && <Tag color={'pink'}>Nhập mã khuyến mãi</Tag>}
      </div>,
    }, {
      title: 'Mã khuyến mại',
      dataIndex: 'Code',
      key: 'code',
      render: (text, record, index) => <Tag color={'purple'}>{text}</Tag>
    }, {
      title: 'Bắt đầu',
      dataIndex: 'Start',
      key: 'start',
      render: (text, record, index) => <span>{ObjectPath.get(text, 'Pretty', '')}</span>
    }, {
      title: 'Kết thúc',
      dataIndex: 'End',
      key: 'end',
      render: (text, record, index) => <span>{ObjectPath.get(text, 'Pretty', '')}</span>
    }, {
      title: 'Giảm giá',
      dataIndex: '',
      key: 'discount',
      render: (text, record, index) => <div>
        {
          record &&
          <div>
            {
              record.Discount ? <p>{numberFormat(record.Discount)} VNĐ/đơn</p> : ''
            }
            {
              record.DiscountPercent ? <p>{record.DiscountPercent} %/đơn</p> : ''
            }
          </div>
        }
      </div>
    }, {
      title: 'Giới hạn',
      dataIndex: '',
      key: 'limit',
      render: (text, record, index) => <div>
        {
          record &&
          <div>
            {
              record.LimitPerUser ? <p>{record.LimitPerUser} đơn đầu tiên</p> : ''
            }
            {
              record.Limit ? <p>{record.Limit} đơn/người</p> : ''
            }
          </div>
        }
      </div>
    }, {
      title: 'Trạng thái',
      dataIndex: 'State',
      key: 'state',
      render: (text, record, index) => <span>{ObjectPath.get(text, 'Name')}</span>
    }];
    if (Permission.allowUpdateDiscount()) {
      columns.push({
        title: 'Xử lý',
        dataIndex: '',
        key: 'action',
        render: (text, record, index) => {
          const menu = (
            <Menu onClick={(e) => this.handleClickMenu(record.ID, e)}>
              <Menu.Item key="edit">
                <Icon type="edit"/> Chỉnh sửa
              </Menu.Item>
            </Menu>
          );

          return (
            <Dropdown overlay={menu} trigger={['click']}>
              <Button
                icon="ellipsis"
                size="small"
              >
                Hành động
              </Button>
            </Dropdown>
          );
        }
      })
    }
    return (
      <PageHeaderLayout
        title={'Khuyến mại'}
      >
        <ContentHolder>
          <Row justify={'start'}>
            <Col sm={20} xs={24}>
              <DiscountTableControl/>
            </Col>
            <Col sm={4} xs={24} style={{textAlign: 'right'}}>
              {Permission.allowCreateDiscount() ?
                <Button
                  icon="plus"
                  type="primary"
                  onClick={this.discount.showCreateModal}
                >
                  {'Thêm khuyến mại mới'}
                </Button>
                : null}
            </Col>
          </Row>

          <DiscountModal/>

          <div style={{marginTop: 16}}>
            <TotalRecord total={this.discount.pagination.total} name={'khuyến mại'}/>
            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.ID}
                pagination={this.discount.pagination}
                onChange={this.discount.handleTableChange}
              />
            </Spin>
          </div>

        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}
