import React from 'react';
import {Tabs, Icon, Row, Col, Form, Input, Button, Alert} from 'antd';
import PageTabsCardLayout from "../../../../layouts/PageTabsCardLayout";
import UploadOrder from "./UploadOrder/index";
import {inject, observer} from "mobx-react";
import {Keys} from "../../../../stores/index";
import ObjectPath from 'object-path';
import {isEmpty} from '../../../../helpers/utility';
import OrderCreate from "./OrderCreate";

const FormItem = Form.Item;

@Form.create()
@inject(Keys.customerTable, Keys.uploadOrderByStaff)
@observer
export default class Order extends React.PureComponent {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          Query
        } = values;
        let credentials = {
          Query
        };
        this.props.customerTable.queryCustomer(credentials).then(result => {
          let userID = ObjectPath.get(result, 'data.Customer.ID');
          this.props.uploadOrderByStaff.onChangeUserID(userID);
        });
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    let {currentRow: dataSource, isFetchingCurrentRow} = this.props.customerTable;

    return (
      <Row>
        <Col span={24}>
          <Row type={'flex'} justify={'center'}>
            <Col md={12} sm={18} xs={24}>
              <h2 style={{textAlign: 'center'}}>Nhập mã khách, sđt hoặc Email khách hàng cần tạo</h2>
              <Form onSubmit={this.handleSubmit}>
                <FormItem>
                  {getFieldDecorator('Query', {
                    rules: [{
                      required: true, message: 'Vui lòng nhập Email hoặc mã khách hàng'
                    }]
                  })(
                    <Input
                      className="inputsearch"
                      placeholder="Nhập Email hoặc mã khách hàng"
                    />
                  )}
                  <Button
                    className="submit"
                    htmlType="submit"
                    loading={isFetchingCurrentRow}
                  >
                    Nhập
                  </Button>
                </FormItem>
              </Form>

              {isEmpty(dataSource) ?
                <Alert
                  type={'success'}
                  description={(
                    <div>
                      <p><b>Họ tên : </b> {ObjectPath.get(dataSource, "Name")}</p>
                      <p><b>Email : </b> {ObjectPath.get(dataSource, "Email")}</p>
                      <p><b>SĐT : </b> {ObjectPath.get(dataSource, "Phone")}</p>
                    </div>
                  )}
                />
                : null}
            </Col>
          </Row>

          {
            isEmpty(dataSource) ?
              <div style={{marginTop: 20}}>
                <PageTabsCardLayout>
                  <Tabs type="card">
                    <Tabs.TabPane tab={<span><Icon type="table"/>Nhập doanh thu</span>} key={'1'}>
                      <OrderCreate CustomerID={this.props.uploadOrderByStaff.userID}/>
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><Icon type="printer"/>Tải đơn hàng</span>} key={'2'}>
                      <UploadOrder/>
                    </Tabs.TabPane>
                  </Tabs>
                </PageTabsCardLayout>
              </div>
              : null
          }
        </Col>
      </Row>
    )
  }

}