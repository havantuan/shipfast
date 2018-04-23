import React, {Component} from 'react';

import {Button, Col, Form, Row} from 'antd';
import City from '../../Common/Location/City';
import District from '../../Common/Location/District';
import basicStyle from "../../../../config/basicStyle";
import EnumState from "../../Common/EnumProvider/state";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';


@Form.create()
@inject(Keys.hubTable)
@observer
export default class HubTableControl extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Form values: ', values);
      if (!err) {
        let {FilterCityID, FilterDistrictID, FilterState} = values;
        let credentials = {
          CityID: FilterCityID,
          DistrictID: FilterDistrictID,
          State: FilterState,
        };
        this.props.hubTable.onFilter(credentials);
      }
    });
  };

  constructor(props) {
    super();
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>

        <Row gutter={basicStyle.gutter}>
          <Col md={{span: 8}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('FilterCityID')(
              <City onValueChange={this.props.hubTable.setCityID}
                    form={this.props.form}
                    resetFields={['FilterDistrictID']}
              />
            )}
          </Col>

          <Col md={{span: 8}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('FilterDistrictID')(
              <District
                onValueChange={this.props.hubTable.setDistrictID}
                form={this.props.form}
                CityID={this.props.hubTable.CityID}
              />
            )}
          </Col>

          <Col md={{span: 4}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('FilterState')(
              <EnumState valueByCode={true}/>
            )}
          </Col>

          <Col md={{span: 2}} sm={{span: 2}} xs={{span: 24}}>
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
    )
  }

}
