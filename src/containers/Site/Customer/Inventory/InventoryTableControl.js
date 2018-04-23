import React, {Component} from 'react';

import {Button, Col, Form, Input, Row} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import EnumState from "../../Common/EnumProvider/state";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

@Form.create()
@inject(Keys.myInventory)
@observer
export default class InventoryTableControl extends Component {
  constructor(props) {
    super(props);
    this.myInventory = props.myInventory;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {query, State} = values;
        let credentials = {
          query,
          // hubID: +hubID || undefined,
          State,
        };
        this.myInventory.onFilter(credentials);
      }
    });
  };


  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>

        <Row gutter={basicStyle.gutter}>

          <Col md={{span: 6}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('query')(
              <Input
                placeholder='Mã kho, Người liên hệ, SĐT'
              />
            )}
          </Col>

          {/*<Col md={{span: 6}} sm={{span: 12}} xs={{span: 24}}>*/}
          {/*{getFieldDecorator('hubID')(*/}
          {/*<HubList*/}
          {/*show={true}*/}
          {/*/>*/}
          {/*)}*/}
          {/*</Col>*/}

          <Col md={{span: 6}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('State')(
              <EnumState
                style={{width: '100%'}}
                placeholder="Trạng thái"
                valueByCode={true}
              />
            )}
          </Col>

          <Col md={{span: 2}} sm={{span: 2}} xs={{span: 24}}>

            <Button
              type="primary"
              htmlType="submit"
            >Lọc</Button>

          </Col>
          <Col md={{span: 4}} sm={{span: 4}} xs={{span: 24}}>

            <Button
              width={"100%"}
              icon="plus"
              type="primary"
              onClick={this.myInventory.showCreateModal}
            >Thêm kho hàng mới</Button>

          </Col>
        </Row>

      </Form>
    )
  }

}
