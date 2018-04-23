import React, {PureComponent} from 'react';
import {Button, Col, Form, Input, Row} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import HubList from '../../Common/HubProvider/hubList';
import EnumState from "../../Common/EnumProvider/state";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';

const width = {
  width: '100%'
};

@Form.create()
@inject(Keys.staff)
@observer
export default class StaffTableControl extends PureComponent {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {query, hubID, state} = values;
        let credentials = {
          query,
          hubID: hubID ? +hubID : undefined,
          state,
        };
        this.props.staff.onFilter(credentials);
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>

        <Row gutter={basicStyle.gutter}>
          <Col md={{span: 8}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('query')(
              <Input placeholder="Nhập mã, sđt, tên bưu tá để tìm kiếm"/>
            )}
          </Col>

          <Col md={{span: 6}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('hubID')(
              <HubList show={true}/>
            )}
          </Col>

          {/*<Col md={{span: 4}} sm={{span: 12}} xs={{span: 24}}>*/}
          {/*{getFieldDecorator('route')(*/}
          {/*<Select*/}
          {/*style={width}*/}
          {/*placeholder="Chọn tuyến"*/}
          {/*>*/}
          {/*<Option value="123">Not Found</Option>*/}
          {/*</Select>*/}
          {/*)}*/}
          {/*</Col>*/}

          <Col md={{span: 6}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('state')(
              <EnumState
                style={width}
                placeholder="Trạng thái"
                valueByCode={true}
              />
            )}
          </Col>

          <Col md={{span: 3}} sm={{span: 12}} xs={{span: 24}}>
            <Button
              icon={'search'}
              type="primary"
              htmlType="submit"
            >Lọc</Button>
          </Col>
        </Row>

      </Form>
    );
  }

}