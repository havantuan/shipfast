import React, {Component} from 'react';
import {Button, Col, Form, Row} from 'antd';
import City from '../../Common/Location/City';
import District from '../../Common/Location/District';
import basicStyle from "../../../../config/basicStyle";
import EnumState from "../../Common/EnumProvider/state";

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
export default class HubTableControl extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Form values: ', values);
      if (!err) {
        let {CityID, DistrictID, State} = values;
        let credentials = {
          CityID,
          DistrictID,
          State,
        };
        this.props.handleSubmit(credentials);
      }
    });
  };

  onCityIDChange = (CityID) => {
    this.setState({
      CityID: CityID,
    });
  };

  onDistrictIDChange = (DistrictID) => {
    this.setState({
      DistrictID: DistrictID,
    });
  };

  constructor(props) {
    super();
    this.state = {
      CityID: props.CityID,
    }
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
                  label={'Tỉnh/Thành'}
                >
                  {getFieldDecorator('CityID')(
                    <City
                      onValueChange={this.onCityIDChange}
                      form={this.props.form}
                      resetFields={['DistrictID']}
                    />
                  )}
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Quận/Huyện'}
                >
                  {getFieldDecorator('DistrictID')(
                    <District
                      onValueChange={this.onDistrictIDChange}
                      form={this.props.form}
                      CityID={this.state.CityID}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={basicStyle.gutter}>
              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Trạng thái'}
                >
                  {getFieldDecorator('State', {
                    initialValue: 'Active'
                  })(
                    <EnumState
                      valueByCode={true}
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
