import React, {PureComponent} from 'react';
import {Button, Col, Form, Row, Input, Select} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import EnumState from "../../Common/EnumProvider/state";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import SelectDate from "../../Common/SelectDate/SelectDate";
import {defaultOptionsConfig} from "../../../../config";

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 16},
  },
};
@Form.create()
@inject(Keys.discount)
@observer
export default class DiscountTableControl extends PureComponent {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {State, Code, RequireCode, CreatedDate} = values;
        console.log('%c RequireCode', 'color: #00b33c', RequireCode);
        let credentials = {
          State: State || undefined,
          Code: Code,
          RequireCode: +RequireCode === 1 ? true : (+RequireCode === 2 ? false : null),
          CreatedFrom: CreatedDate ? CreatedDate[0] : undefined,
          CreatedTo: CreatedDate ? CreatedDate[1] : undefined
        };
        this.discount.onFilter(credentials);
      }
    });
  };

  constructor(props) {
    super(props);
    this.discount = this.props.discount;
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className={'custom-form'}>
        <Row gutter={basicStyle.gutter}>
          <Col md={18} sm={24}>
            <Row gutter={basicStyle.gutter}>
              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Mã khuyến mãi'}
                >
                  {getFieldDecorator('Code')(
                    <Input placeholder="Tìm kiếm theo mã"/>
                  )}
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Khoảng thời gian'}
                >
                  {getFieldDecorator('CreatedDate', {
                    initialValue: this.props.discount.timeSelected
                  })(
                    <SelectDate
                      title={'Thời gian tạo'}
                      placeholder={'Khoảng thời gian tạo'}
                      defaultSelected={defaultOptionsConfig.date}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={basicStyle.gutter}>
              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Yêu cầu nhập mã'}
                >
                  {getFieldDecorator('RequireCode')(
                    <Select allowClear>
                      <Option value={`1`}>Yêu cầu nhập mã</Option>
                      <Option value={`2`}>Không yêu cầu nhập mã</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Trạng thái'}
                >
                  {getFieldDecorator('State')(
                    <EnumState valueByCode={true}/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Col>

          <Col md={6} xs={24}>
            <FormItem>
              <Button
                style={{width: '100%'}}
                icon={'search'}
                htmlType="submit"
                type={'primary'}
                className={'btnSearch'}
              >
                Tìm kiếm
              </Button>
            </FormItem>
          </Col>
        </Row>

      </Form>
    );
  }

}