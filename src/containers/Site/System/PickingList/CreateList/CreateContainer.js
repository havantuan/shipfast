import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ObjectPath from 'object-path';
import {Button, Card, Col, Form, Icon, Input, Row, Spin, Tag} from 'antd';
import basicStyle from '../../../../../config/basicStyle';
import routerConfig from "../../../../../config/router";
import CreateContainerForm from "./CreateContainerForm";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../stores/index";

const FormItem = Form.Item;

@Form.create()
@inject(Keys.createContainer, Keys.me)
@observer
export default class CreateContainer extends Component {

  constructor(props) {
    super(props);
    this.createContainer = props.createContainer;
  }

  componentDidMount() {
    this.createContainer.fetch();
  }

  onKeyDown = (e) => {
    // 9 - Tab
    // 13 - Enter
    let scannerKey = this.props.me.scannerKey;
    if (e.which === scannerKey && scannerKey !== 13) {
      this.getPickingList();
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.getPickingList();
  };

  getPickingList = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          Code
        } = values;
        if (Code.trim().length <= 0) {
          return;
        }
        this.createContainer.addPickingListCodes(Code.trim());
        this.props.form.resetFields(["Code"]);
      }
    });
  };

  render() {
    const {colStyle, gutter} = basicStyle;
    const {getFieldDecorator} = this.props.form;
    const {dataSource, fetching, isFetchingCurrentRow} = this.createContainer;

    return (
      <Row gutter={gutter} justify="start">
        <Col md={6} sm={24} xs={24} style={colStyle}>
          <Card
            title="Bảng kê chưa đóng vào chuyến thư"
            bodyStyle={{padding: 0}}
          >
            <Spin spinning={fetching}>
              {
                dataSource.length > 0 ?
                  dataSource.map((val, index) =>
                    <div key={index} style={{borderBottom: '1px solid #e9e9e9', padding: '5px 10px'}}>
                      <div>
                        <Link to={routerConfig.listDetail.replace(":code", val.Code)}>
                          <Tag color={"purple"}>
                            {val.Code}
                          </Tag>
                        </Link>
                        {' - ('}
                        <b>{'Điểm thu: '}</b>
                        {`${ObjectPath.get(val, "SourceHub.Code", '')})`}
                        <p>
                          <b>{'Tạo: '}</b>{ObjectPath.get(val, "CreatedAt.Pretty")}
                        </p>
                      </div>

                      <div style={{textAlign: 'right'}}>
                        <Tag
                          color="#87d068"
                          onClick={() => this.createContainer.addPickingListCodes(val.Code)}
                        >
                          <Icon type="plus"/>&nbsp;Thêm
                        </Tag>
                        {/*<Tag*/}
                        {/*color="#108ee9"*/}
                        {/*>*/}
                        {/*<Icon type="edit"/>&nbsp;Sửa*/}
                        {/*</Tag>*/}
                      </div>
                    </div>
                  )
                  :
                  <i>Không có dữ liệu</i>
              }
            </Spin>
          </Card>
        </Col>

        <Col md={18} sm={24} xs={24} style={colStyle}>
          <Form onSubmit={this.handleSubmit} onKeyDown={this.onKeyDown}>
            <Row gutter={gutter} justify="start">
              <Col md={6} sm={12} xs={24}>
                <FormItem style={{marginBottom: '12px'}}>
                  {getFieldDecorator(`Code`, {
                    rules: [
                      {required: true, message: 'Vui lòng nhập mã bảng kê'}
                    ]
                  })(
                    <Input placeholder="Mã bảng kê" size="default"/>
                  )}
                </FormItem>
              </Col>

              <Col md={3} sm={12} xs={24}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon="plus"
                  loading={isFetchingCurrentRow}
                >
                  Thêm bảng kê
                </Button>
              </Col>
            </Row>
          </Form>

          <CreateContainerForm/>
        </Col>
      </Row>
    )
  }
}
