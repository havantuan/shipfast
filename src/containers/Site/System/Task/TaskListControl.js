import React, {Component} from 'react';

import {Button, Form, Icon, Input} from 'antd';
import EnumTaskTypes from "../../Common/EnumProvider/taskType";
import City from "../../Common/Location/City";
import District from "../../Common/Location/District";
import Ward from "../../Common/Location/Ward";
import "./Style.css";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

const FormItem = Form.Item;

@Form.create()
@inject(Keys.grantTask)
@observer
export default class TaskListControl extends Component {

  constructor(props) {
    super(props);
    this.state = {
      advancedSearch: false,
      CityID: null,
      DistrictID: null,
    };
    this.grantTask = props.grantTask;
  };

  toggleSearch = () => {
    this.setState(prevState => {
      return {
        advancedSearch: !prevState.advancedSearch
      }
    });
  };

  onCityIDChange = (CityID) => {
    this.setState({
      CityID: CityID,
      DistrictID: null
    });
  };

  onDistrictIDChange = (DistrictID) => {
    this.setState({
      DistrictID: DistrictID,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          OrderCodeOrTaskCode,
          Type,
          CityID,
          DistrictID,
          WardID
        } = values;
        let credentials = {
          OrderCodeOrTaskCode,
          Type,
          CityID: CityID ? +CityID : null,
          DistrictID: DistrictID ? +DistrictID : null,
          WardID: WardID ? +WardID : null
        };
        this.grantTask.onFilter(credentials);
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('OrderCodeOrTaskCode')(
            <Input
              addonAfter={(
                <a onClick={this.toggleSearch}>
                  {this.state.advancedSearch ?
                    <span>
                      <Icon type="minus-circle"/>
                      <span> Tìm rút gọn</span>
                    </span>
                    :
                    <span>
                      <Icon type="plus-circle"/>
                      <span> Tìm nâng cao</span>
                    </span>
                  }
                </a>
              )}
              placeholder="Mã công việc/ Mã đơn hàng"/>
          )}
        </FormItem>
        {
          this.state.advancedSearch &&
          <div>
            <FormItem>
              {getFieldDecorator('Type')(
                <EnumTaskTypes valueByCode={true} placeholder='Tất cả các loại công việc'/>
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('CityID')(
                <City
                  placeholder="Tỉnh thành gửi"
                  onValueChange={this.onCityIDChange}
                  form={this.props.form}
                  resetFields={['DistrictID', 'WardID']}
                />
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('DistrictID')(
                <District
                  placeholder="Quận huyện gửi"
                  onValueChange={this.onDistrictIDChange}
                  CityID={this.state.CityID}
                  form={this.props.form}
                  resetFields={['WardID']}
                />
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('WardID')(
                <Ward
                  placeholder="Phường xã gửi"
                  DistrictID={this.state.DistrictID}
                  form={this.props.form}
                />
              )}
            </FormItem>
          </div>
        }
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            icon="search"
            style={{width: '100%'}}
          >
            Tìm kiếm
          </Button>
        </FormItem>
      </Form>
    );
  }
}