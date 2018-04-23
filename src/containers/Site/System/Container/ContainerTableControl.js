import React, {Component} from 'react';
import {Button, Col, Form, Input, Row} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import {defaultOptionsConfig} from "../../../../config";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import SelectDate from "../../Common/SelectDate/SelectDate";
const FormItem = Form.Item;
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
@inject(Keys.letterContainer)
@observer
export default class HubTableControl extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Form values: ', values);
      if (!err) {
        let {Code, VehicleNumberPlate, CreatedDate} = values;
        let credentials = {
          Code,
          VehicleNumberPlate,
          CreatedFrom: CreatedDate ? CreatedDate[0] : undefined,
          CreatedTo: CreatedDate ? CreatedDate[1] : undefined
        };
        this.props.letterContainer.onFilter(credentials);
      }
    });
  };

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
                  label={'Mã chuyến thư'}
                >
                  {getFieldDecorator('Code')(
                    <Input placeholder="Mã chuyến thư"/>
                  )}
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Biển số xe'}
                >
                  {getFieldDecorator('VehicleNumberPlate')(
                    <Input placeholder="Biển số xe"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={basicStyle.gutter}>
              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Thời gian'}
                >
                  {getFieldDecorator('CreatedDate', {
                    initialValue: this.props.letterContainer.timeSelected
                  })(
                  <SelectDate
                    defaultSelected={defaultOptionsConfig.date}
                  />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Col>

          <Col md={6} xs={24}>
            <FormItem>
              <Button
                icon={'search'}
                type={'primary'}
                style={{width: '100%'}}
                htmlType="submit"
              >
                Tìm kiếm
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }

}
