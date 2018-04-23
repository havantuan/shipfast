import React, {Component} from 'react';
import {Button, Col, Form, Input, Row} from "antd";
import ObjectPath from "object-path";
import NumberFormat from "react-number-format";
import basicStyle from "../../../../../config/basicStyle";
import "../Style.css";
import ServiceType from "../../../Common/ServiceTypeProvider/ServiceType";
import HubList from "../../../Common/HubProvider/hubList";
import PickingListTypes from "../../../Common/EnumProvider/pickingListTypes";
import {formatNumber} from "../../../../../helpers/utility";
import notification from "../../../../../components/notification";
import {messageConfig} from "../../../../../config";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../stores/index";

const FormItem = Form.Item;
const {TextArea} = Input;
const formItem = {marginBottom: '12px'};
const width = {width: '100%'};

const customizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    if (Object.keys(changedFields).length > 0) {
      props.onFormChange(props.id, changedFields)
    }
  },
  mapPropsToFields(props) {
    return {
      OrderCode: Form.createFormField({
        ...props.OrderCode,
        value: ObjectPath.get(props, "OrderCode.value"),
      }),
      Type: Form.createFormField({
        ...props.Type,
        value: ObjectPath.get(props, "Type.value"),
      }),
      Center: Form.createFormField({
        ...props.Center,
        value: ObjectPath.get(props, "Center.value"),
      }),
      Line: Form.createFormField({
        ...props.Line,
        value: ObjectPath.get(props, "Line.value"),
      }),
      ServiceTypeID: Form.createFormField({
        ...props.ServiceTypeID,
        value: ObjectPath.get(props, "ServiceTypeID.value"),
      }),
      Hub: Form.createFormField({
        ...props.Hub,
        value: ObjectPath.get(props, "Hub.value"),
      }),
      NetWeight: Form.createFormField({
        ...props.NetWeight,
        value: ObjectPath.get(props, "NetWeight.value"),
      }),
      HubID: Form.createFormField({
        ...props.HubID,
        value: ObjectPath.get(props, "HubID.value"),
      }),
      Note: Form.createFormField({
        ...props.Note,
        value: ObjectPath.get(props, "Note.value"),
      }),
    };
  },
  onValuesChange(_, values) {
    // console.log("onValuesChange", values);
  },
});

@customizedForm
@inject(Keys.createPickingList, Keys.me)
@observer
export default class CreateList extends Component {

  constructor(props) {
    super(props);
    this.createPickingList = props.createPickingList;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {ordersCode} = this.props;
        if (ordersCode && ordersCode.length <= 0) {
          notification('error', messageConfig.errorTitle, 'Chưa có đơn hàng nào được quét!');
          return;
        }
        let {
          Type,
          NetWeight,
          Note,
          ServiceTypeID,
          HubID
        } = values;
        let credentials = {
          NetWeight: formatNumber(`${NetWeight}`),
          Note,
          OrderCodes: ordersCode,
          ServiceTypeID: ServiceTypeID ? +ServiceTypeID : undefined,
          Type,
          HubID: HubID ? +HubID : undefined,
          CurrentHubID: this.props.me.getCurrentHub()
        };
        console.log("%ccredentials", 'color: #00b33c', credentials);
        this.createPickingList.create(credentials).then(result => {
          this.createPickingList.removeListItem(this.props.id);
        });
      }
    });
  };

  render() {
    const {rowStyle, gutter, redBg, greenBg} = basicStyle;
    const {getFieldDecorator} = this.props.form;
    const {Type} = this.props;
    const pickingListType = Type ? Type.value : null;

    return (
      <div>
        <Form style={{marginTop: '20px'}} onSubmit={this.handleSubmit}>
          <Row gutter={gutter} justify="start">
            <Col md={6} sm={12} xs={24}>
              <FormItem style={formItem}>
                {getFieldDecorator('Type', {
                  rules: [
                    {required: true, message: "Vui lòng chọn loại bảng kê"}
                  ]
                })(
                  <PickingListTypes
                    placeholder="Loại bảng kê"
                    valueByCode={true}
                  />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={gutter} justify="start">
            {
              pickingListType === "ExternalService" &&
              <Col md={6} sm={12} xs={24}>
                <FormItem style={formItem}>
                  {getFieldDecorator('ServiceTypeID', {
                    rules: [
                      {required: true, message: "Vui lòng chọn dịch vụ"}
                    ]
                  })(
                    <ServiceType/>
                  )}
                </FormItem>
              </Col>
            }

            {
              pickingListType &&
              <Col md={6} sm={12} xs={24}>
                <FormItem style={formItem}>
                  {getFieldDecorator("NetWeight", {
                    rules: [
                      {required: true, message: "Vui lòng nhập tổng khối lượng"}
                    ]
                  })(
                    <NumberFormat
                      placeholder="Tổng khối lượng thật (Gram)" thousandSeparator={true}
                      suffix={' gram'} className="ant-input"
                    />
                  )}
                </FormItem>
              </Col>
            }
          </Row>

          <Row gutter={gutter} justify="start">
            <Col md={6} sm={12} xs={24}>
              <FormItem style={formItem}>
                {getFieldDecorator("HubID", {
                  rules: [
                    {required: true, message: "Vui lòng chọn điểm phát"}
                  ]
                })(
                  <HubList
                    style={width}
                    placeholder={"Chọn điểm phát"}
                    show={true}
                  />
                )}
              </FormItem>
            </Col>

            <Col md={6} sm={12} xs={24}>
              <FormItem style={formItem}>
                {getFieldDecorator("Note")(
                  <TextArea
                    style={{height: '35px'}}
                    placeholder="Ghi chú"
                  />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={24} sm={24} xs={24}>
              <Button
                htmlType="submit"
                icon="check"
                style={{...greenBg, marginRight: '5px'}}
                size="small"
              >
                Xác nhận
              </Button>

              {
                this.props.counter > 1 &&
                <Button
                  icon="close"
                  style={redBg}
                  size="small"
                  onClick={() => this.createPickingList.removeListItem(this.props.id)}
                >
                  Hủy bảng kê
                </Button>
              }
            </Col>
          </Row>
        </Form>
      </div>
    )
  }

}