import React, {Component} from 'react';
import {Button, Col, Form, Input, Row} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import HubList from "../../Common/HubProvider/hubList";
import PickingListTypes from "../../Common/EnumProvider/pickingListTypes";
import PickingListStatuses from "../../Common/PickingListProvider/PickingListStatuses";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

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
@inject(Keys.pickingList, Keys.me)
@observer
export default class ListTableControl extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          OrderCodeOrPickingListCode,
          Status,
          Type,
          SrcHubID
        } = values;
        let credentials = {
          OrderCodeOrPickingListCode,
          Status: Status ? +Status : undefined,
          Type,
          SrcHubID: SrcHubID ? +SrcHubID : undefined
        };
        this.props.pickingList.onFilter(credentials);
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit} className={'custom-form'}>
        <Row gutter={basicStyle.gutter}>
          <Col sm={18} xs={24}>
            <Row gutter={basicStyle.gutter}>
              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Mã BK/ĐH'}
                >
                  {getFieldDecorator('OrderCodeOrPickingListCode')(
                    <Input
                      placeholder="Mã bảng kê/ Mã đơn hàng"
                      size="default"
                    />
                  )}
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Trạng thái'}
                >
                  {getFieldDecorator('Status')(
                    <PickingListStatuses/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={basicStyle.gutter}>
              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Loại bảng kê'}
                >
                  {getFieldDecorator('Type')(
                    <PickingListTypes
                      placeholder="Loại bảng kê"
                      valueByCode={true}
                    />
                  )}
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Điểm thu'}
                >
                  {getFieldDecorator('SrcHubID')(
                    <HubList
                      show={true}
                      placeholder="Chọn điểm thu"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Col>

          <Col sm={6} xs={24}>
            <FormItem>
              <Button
                loading={this.props.pickingList.fetching}
                icon="search"
                type="primary"
                htmlType="submit"
                style={{width: '100%'}}
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