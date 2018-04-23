import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import NumberFormat from "react-number-format";
import {Button, Col, Dropdown, Form, Icon, Input, Menu, Row, Spin, Table, Tag, message} from 'antd';
import HubList from '../../../Common/HubProvider/hubList';
import basicStyle from "../../../../../config/basicStyle";
import routerConfig from "../../../../../config/router";
import {formatNumber} from "../../../../../helpers/utility";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../stores/index";

const FormItem = Form.Item;
const {TextArea} = Input;
const formItem = {marginBottom: '12px'};

@Form.create()
@inject(Keys.createContainer, Keys.me)
@observer
export default class CreateContainer extends Component {

  constructor(props) {
    super(props);
    this.createContainer = props.createContainer;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {codesTable} = this.createContainer;
        if (codesTable.length <= 0) {
          message.error('Chưa có bảng kê nào được quét!');
          return;
        }
        let {
          HubID,
          NetWeight,
          Note,
          VehicleNumberPlates
        } = values;
        let credentials = {
          HubID: HubID ? +HubID : undefined,
          NetWeight: NetWeight ? formatNumber(`${NetWeight}`) : undefined,
          Note,
          VehicleNumberPlates,
          PickingListCodes: codesTable.slice(),
          CurrentHubID: this.props.me.getCurrentHub()
        };
        console.log("%ccredentials", 'color: #00b33c', credentials);
        this.createContainer.create(credentials).then(result => {
          this.props.form.resetFields();
          this.props.form.setFieldsValue({'NetWeight': ''});
        });
      }
    })
  };

  handleClickMenu = ({item, key, keyPath}, data) => {
    switch (key) {
      case 'cancel':
        this.createContainer.removePickingListCodes(data);
        break;
      default:
        return null;
    }
  };

  render() {
    const {greenBg, gutter, colStyle} = basicStyle;
    const {getFieldDecorator} = this.props.form;
    const {codesTable, tableData = [], isFetchingCurrentRow: fetching} = this.createContainer;

    const columns = [{
      title: '#',
      key: 'index',
      render: (text, record, index) => <span>{index + 1}</span>
    }, {
      title: 'Mã bảng kê',
      dataIndex: 'Code',
      key: 'code',
      render: (text, record, index) =>
        <Link to={routerConfig.listDetail.replace(":code", text)}>
          <Tag color={"purple"}>
            {text}
          </Tag>
        </Link>
    }, {
      title: 'Loại bảng kê',
      dataIndex: 'Type',
      key: 'type',
      render: (text, record, index) => <Tag color={"blue"}>{text && text.Name}</Tag>
    }, {
      title: 'Số đơn hàng',
      dataIndex: 'Entries',
      key: 'quantity',
      render: (text, record, index) => <span>{text && text.length}</span>
    }, {
      title: 'Khối lượng (kg)',
      dataIndex: 'Weight',
      key: 'weight',
      render: (text, record, index) => <span>{text}</span>
    }, {
      title: 'Hành động',
      key: 'action',
      render: (text, record, index) => {
        const menu = (
          <Menu onClick={(e) => this.handleClickMenu(e, record)}>
            <Menu.Item key="cancel">
              <Icon type={'close'}/>&nbsp;Bỏ chọn
            </Menu.Item>

            <Menu.Item key="edit">
              <Link to={routerConfig.printList.replace(":code", record.Code)} target={"_blank"}>
                <Icon type={'printer'}/>&nbsp;In bảng kê
              </Link>
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
        )
      }
    }];

    let orderTotal = 0;
    tableData.forEach(val => {
      orderTotal += val.Entries ? val.Entries.length : 0;
    });

    return (
      <div>
        <div style={{marginBottom: '15px'}}>
          <p style={{marginBottom: '5px'}}>
            {'Tổng '}
            <b>{codesTable.length}</b>{' bảng kê, '}
            <b>{orderTotal}</b>{' đơn hàng'}
          </p>

          <Spin spinning={fetching}>
            <Table
              bordered
              columns={columns}
              dataSource={tableData.slice()}
              rowKey={record => record.Code}
              pagination={false}
            />
          </Spin>
        </div>

        <Form onSubmit={this.handleSubmit}>
          <Row gutter={gutter} justify={"start"}>
            <Col md={6} sm={12} xs={24} style={colStyle}>
              <FormItem style={formItem}>
                {getFieldDecorator('HubID')(
                  <HubList
                    show={true}
                    placeholder={'Điểm phát'}
                  />
                )}
              </FormItem>
            </Col>

            <Col md={6} sm={12} xs={24} style={colStyle}>
              <FormItem style={formItem}>
                {getFieldDecorator('VehicleNumberPlates', {
                  rules: [
                    {required: true, message: 'Vui lòng nhập biển số xe'}
                  ]
                })(
                  <Input
                    placeholder={"Biển số xe"}
                    size={"default"}
                  />
                )}
              </FormItem>
            </Col>

            <Col md={6} sm={12} xs={24} style={colStyle}>
              <FormItem style={formItem}>
                {getFieldDecorator('NetWeight', {
                  rules: [
                    {required: true, message: 'Vui lòng nhập khối lượng'}
                  ]
                })(
                  <NumberFormat
                    placeholder="Tổng khối lượng thật (Gram)"
                    thousandSeparator={true}
                    suffix={' gram'} className="ant-input"
                  />
                )}
              </FormItem>
            </Col>

            <Col md={6} sm={12} xs={24} style={colStyle}>
              <FormItem style={formItem}>
                {getFieldDecorator("Note")(
                  <TextArea
                    style={{height: '35px'}}
                    placeholder="Ghi chú"
                  />
                )}
              </FormItem>
            </Col>
          </Row>

          <div>
            <Button
              htmlType={"submit"}
              style={greenBg}
              icon={'plus'}
              size={'small'}
            >
              Đóng chuyến thư đi
            </Button>
          </div>
        </Form>
      </div>
    )
  }
}