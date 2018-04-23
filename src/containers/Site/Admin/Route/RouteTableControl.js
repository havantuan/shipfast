import React, {PureComponent} from 'react';
import {Button, Col, Form, Input, Row} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import HubList from '../../Common/HubProvider/hubList';
import City from "../../Common/Location/City";
import District from "../../Common/Location/District";
import routerConfig from "../../../../config/router";
import Permission from "../../../../permissions/index";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

@Form.create()
@inject(Keys.route, Keys.router)
@observer
export default class RouteTableControl extends PureComponent {

  constructor(props) {
    super(props);
    this.route = props.route;
    this.router = props.router;
  }

  handleChangeCityID = (CityID) => {
    this.route.onCityIDChange(CityID);
  };

  redirectToCreateRoute = () => {
    this.router.history.push(routerConfig.createRoute);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {Query, HubID, CityID, DistrictID} = values;
        let credentials = {
          Query,
          HubID: +HubID || undefined,
          CityID: +CityID || undefined,
          DistrictID: +DistrictID || undefined,
        };
        this.route.onFilter(credentials);
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit}>

        <Row gutter={basicStyle.gutter}>
          <Col md={{span: 4}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('Query')(
              <Input placeholder="Nhập mã, tên để tìm kiếm"/>
            )}
          </Col>

          <Col md={{span: 4}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('HubID')(
              <HubList show={true}/>
            )}
          </Col>

          <Col md={{span: 4}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('CityID')(
              <City
                placeholder="Tỉnh thành "
                onValueChange={this.handleChangeCityID}
                form={this.props.form}
                resetFields={['DistrictID']}
              />
            )}
          </Col>

          <Col md={{span: 4}} sm={{span: 12}} xs={{span: 24}}>
            {getFieldDecorator('DistrictID')(
              <District
                placeholder="Quận huyện "
                form={this.props.form}
                CityID={this.route.cityID}
              />
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
          <Col md={{span: 6}} sm={{span: 12}} xs={{span: 24}} style={{textAlign: 'right'}}>
            {Permission.allowCreateRoute() ?
              <Button
                icon="plus"
                type="primary"
                onClick={this.redirectToCreateRoute}
              >
                Thêm tuyến mới
              </Button>
              : null}

          </Col>
        </Row>

      </Form>
    );
  }

}