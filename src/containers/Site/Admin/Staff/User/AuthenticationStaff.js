import React, {Component} from 'react';
import ObjectPath from 'object-path';
import {Button, Col, DatePicker, Form, Input, Row} from 'antd';
import basicStyle from '../../../../../config/basicStyle';
import './Style.css';
import moment from 'moment';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../stores/index";
import {withRouter} from "react-router-dom";

const FormItem = Form.Item;

const width = {
  width: '100%'
};

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
@withRouter
@inject(Keys.staffByUser)
@observer
export default class AuthenticationStaff extends Component {

  constructor(props) {
    super(props);
    this.id = props.match.params.id;
    this.staffByUser = props.staffByUser;
  }

  prevSteps = () => {
    // add data authentication form to state when click prev button
    this.props.form.validateFields((err, values) => {
      let {
        IDNumber,
        IDDateOfIssue,
        IDPlaceOfIssue,
        StudentIDNumber,
        StudentDateOfIssue,
        StudentPlaceOfIssue,
      } = values;
      let IDCard = {
        DateOfIssue: IDDateOfIssue,
        IDNumber,
        PlaceOfIssue: IDPlaceOfIssue
      };
      let StudentCard = {
        DateOfIssue: StudentDateOfIssue,
        IDNumber: StudentIDNumber,
        PlaceOfIssue: StudentPlaceOfIssue
      };
      this.staffByUser.onTemporaryDataChange({IDCard, StudentCard});
      this.staffByUser.onPrevStep();
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let temporaryData = this.staffByUser.temporaryData;
        let {
          IDNumber,
          IDDateOfIssue,
          IDPlaceOfIssue,
          StudentIDNumber,
          StudentDateOfIssue,
          StudentPlaceOfIssue,
        } = values;
        let IDCard = {
          DateOfIssue: IDDateOfIssue,
          IDNumber,
          PlaceOfIssue: IDPlaceOfIssue
        };
        let StudentCard = {
          DateOfIssue: StudentDateOfIssue,
          IDNumber: StudentIDNumber,
          PlaceOfIssue: StudentPlaceOfIssue
        };
        let credentials = {
          ...temporaryData,
          IDCard,
          StudentCard
        };
        this.staffByUser.create(temporaryData.ID, credentials);
      }
    });
  };

  render() {
    const {rowStyle, colStyle, gutter} = basicStyle;
    const {getFieldDecorator} = this.props.form;
    const {singleData: dataSource, temporaryData, isUpdateMode: fillEditData} = this.staffByUser;
    const {IDCard, StudentCard} = dataSource;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row style={rowStyle} gutter={gutter} justify="start">
          <Col md={12} sm={12} xs={12} style={colStyle}>

            <FormItem
              {...formItemLayout}
              label="Số chứng minh thư"
            >
              {getFieldDecorator('IDNumber', {
                rules: [
                  {required: true, message: 'Vui lòng nhập số chứng minh thư'}
                ],
                initialValue: fillEditData ? ObjectPath.get(IDCard, 'IDNumber') : ObjectPath.get(temporaryData, 'IDCard.IDNumber', null)
              })(
                <Input
                  size="default"
                />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Ngày cấp"
            >
              {getFieldDecorator('IDDateOfIssue', {
                rules: [
                  {required: true, message: 'Vui lòng nhập ngày cấp'}
                ],
                initialValue: fillEditData ? (IDCard && IDCard.DateOfIssue ? moment(`${IDCard.DateOfIssue}`, 'YYYY-MM-DD') : null) : (temporaryData.IDCard ? temporaryData.IDCard.DateOfIssue : null)
              })(
                <DatePicker
                  placeholder="Ngày cấp"
                  style={width}
                />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Nơi cấp"
            >
              {getFieldDecorator('IDPlaceOfIssue', {
                rules: [
                  {required: true, message: 'Vui lòng nhập Tỉnh TP cấp CMT'}
                ],
                initialValue: fillEditData ? ObjectPath.get(IDCard, 'PlaceOfIssue') : ObjectPath.get(temporaryData, 'IDCard.PlaceOfIssue', null)
              })(
                <Input placeholder="Tỉnh TP cấp"/>
              )}
            </FormItem>

          </Col>

          <Col md={12} sm={12} xs={24}>

            <FormItem
              {...formItemLayout}
              label="Mã số sinh viên"
            >
              {getFieldDecorator('StudentIDNumber', {
                rules: [
                  {required: false, message: 'Vui lòng nhập mã số sinh viên'}
                ],
                initialValue: fillEditData ? ObjectPath.get(StudentCard, 'IDNumber') : ObjectPath.get(temporaryData, 'StudentCard.IDNumber', null)
              })(
                <Input
                  size="default"
                  placeholder="Mã số sinh viên *"
                />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Ngày cấp"
            >
              {getFieldDecorator('StudentDateOfIssue', {
                rules: [
                  {required: false, message: 'Vui lòng nhập ngày cấp'}
                ],
                initialValue: fillEditData ? (StudentCard && StudentCard.DateOfIssue ? moment(`${StudentCard.DateOfIssue}`, 'YYYY-MM-DD') : null ) : (temporaryData.StudentCard ? temporaryData.StudentCard.DateOfIssue : null)
              })(
                <DatePicker
                  placeholder="Ngày cấp"
                  style={width}
                />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Nơi cấp"
            >
              {getFieldDecorator('StudentPlaceOfIssue', {
                rules: [
                  {required: false, message: 'Vui lòng nhập trường ĐH - CĐ'}
                ],
                initialValue: fillEditData ? ObjectPath.get(StudentCard, 'PlaceOfIssue') : ObjectPath.get(temporaryData, 'StudentCard.PlaceOfIssue', null)
              })(
                <Input placeholder="Trường ĐH - CĐ"/>
              )}
            </FormItem>

          </Col>
        </Row>

        <Row style={rowStyle} gutter={gutter} type="flex" justify="end">
          <Col md={8} sm={8} xs={24} className="textRight">
            <FormItem>
              <Button
                type="primary"
                className="btnNext"
                htmlType="submit"
                loading={this.staffByUser.isCreating || this.staffByUser.isUpdating}
              >
                {fillEditData ? 'Cập nhật' : 'Đăng ký'}
              </Button>
              <Button
                type="default"
                onClick={this.prevSteps}
              >
                Quay lại
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}