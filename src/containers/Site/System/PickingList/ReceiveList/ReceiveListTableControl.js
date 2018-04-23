import React, {Component} from 'react';
import {Button, Form, Input, message} from 'antd';
import "../Style.css"
import basicStyle from "../../../../../config/basicStyle";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../stores/index";

@Form.create()
@inject(Keys.receivePickingList)
@observer
export default class ReceiveListTableControl extends Component {

  constructor(props) {
    super(props);
    this.receivePickingList = props.receivePickingList;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("%cvalues", 'color: #00b33c', values);
        let {Code} = values;
        Code = Code && Code.trim();
        if (!Code) {
          message.error('Lấy thông tin bảng kê thất bại');
          return;
        }
        this.receivePickingList.onFilter(Code);
      }
    });
  };

  render() {
    const {gutter} = basicStyle;
    const {getFieldDecorator} = this.props.form;

    return (
      <div className="reveice-list-control">
        <Form onSubmit={this.handleSubmit}>
          <div className="input-search">
            {getFieldDecorator('Code', {
              initialValue: this.receivePickingList.pickingListCode
            })(
              <Input
                placeholder="Mã bảng kê"
              />
            )}
          </div>

          <div style={{display: 'inline-block', marginLeft: gutter}}>
            <Button
              type="primary"
              htmlType="submit"
              icon="search"
              loading={this.receivePickingList.fetching || false}
            >
              Tìm
            </Button>
          </div>
        </Form>
      </div>
    )
  }

}