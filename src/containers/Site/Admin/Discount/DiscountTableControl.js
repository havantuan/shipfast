import React, {PureComponent} from 'react';
import {Button, Col, Form, Row, Input, Select} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import EnumState from "../../Common/EnumProvider/state";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import {defaultOptionsConfig} from "../../../../config";
import SelectDate from "../../Common/SelectDate/SelectDate";
const Option = Select.Option;
@Form.create()
@inject(Keys.discount)
@observer
export default class DiscountTableControl extends PureComponent {


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {State, Code, RequireCode, CreatedDate} = values;
        let credentials = {
          State: State || undefined,
          Code: Code,
          RequireCode: +RequireCode === 1 ? true : (+RequireCode === 2 ? false : null),
          CreatedFrom: CreatedDate ? CreatedDate[0] : undefined,
          CreatedTo: CreatedDate ? CreatedDate[1] : undefined,
        };
        this.discount.onFilter(credentials);
      }
    });
  };

  constructor(props) {
    super(props);
    this.discount = this.props.discount;
    this.state = {
      CityIDSend: null,
      DistrictIDSend: null,
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>

        <Row gutter={basicStyle.gutter}>
          <Col md={{span: 4}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('State')(
              <EnumState valueByCode={true}/>
            )}
          </Col>
          <Col md={{span: 4}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('Code')(
              <Input placeholder="Tìm kiếm theo mã"/>
            )}
          </Col>
          <Col md={{span: 6}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('CreatedDate', {
              initialValue: this.props.discount.timeSelected
            })(
              <SelectDate
                title={'Thời gian tạo'}
                placeholder={'Khoảng thời gian tạo'}
                defaultSelected={defaultOptionsConfig.date}
              />
              )}
          </Col>
          <Col md={{span: 4}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('RequireCode')(
              <Select
                allowClear
                placeholder={'Nhập mã/Không nhập mã'}
              >
                <Option value={`1`}>Yêu cầu nhập mã</Option>
                <Option value={`2`}>Không yêu cầu nhập mã</Option>
              </Select>
            )}
          </Col>
          <Col md={{span: 2}} sm={{span: 12}} xs={{span: 24}}>
            <Button
              icon={'search'}
              type="primary"
              htmlType="submit"
            >
              Lọc
            </Button>
          </Col>
        </Row>

      </Form>
    );
  }

}