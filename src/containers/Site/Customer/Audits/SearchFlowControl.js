import React, {Component} from 'react';
import {Button, Col, DatePicker, Form, Input, Row} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import CrossStatus from "../../Common/CrossStatusProvider/CrossStatus";

const {RangePicker} = DatePicker;
@Form.create()
@inject(Keys.meCross)
@observer
export default class SearchFlowControl extends Component {
  constructor(props) {
    super(props);
    this.meCross = this.props.meCross
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Form values: ', values);
      if (!err) {
        let {Codes, StatusCodes, CreatedDate} = values;
        let credentials = {
          Codes,
          StatusCodes: StatusCodes ? [StatusCodes] : null,
          CreatedFrom: CreatedDate && CreatedDate.length > 0 ? CreatedDate[0].format() : undefined,
          CreatedTo: CreatedDate && CreatedDate.length > 0 ? CreatedDate[1].format() : undefined,
        };
        this.meCross.onFilter(credentials);
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>

        <Row gutter={basicStyle.gutter}>


          <Col md={{span: 8}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('Codes')(
              <Input placeholder="Nhập mã đối soát"/>
            )}
          </Col>
          <Col md={{span: 4}} sm={{span: 4}} xs={{span: 24}}>
            {getFieldDecorator('StatusCodes')(
              <CrossStatus placeholder="Trạng thái"/>
            )}
          </Col>
          <Col md={{span: 8}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('CreatedDate')(
              <RangePicker
                format={"DD/MM/YYYY"}
                placeholder={["Từ ngày", "Đến ngày"]}
                style={{width: '100%'}}
              />
            )}
          </Col>
          <Col md={{span: 2}} sm={{span: 2}} xs={{span: 24}}>
            <Button
              type="primary"
              htmlType="submit"
            >Lọc</Button>
          </Col>
        </Row>

      </Form>
    )
  }
}
