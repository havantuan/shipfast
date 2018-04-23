import React, {Component} from 'react';
import ObjectPath from 'object-path';
import {Card, Col, Row, Spin} from 'antd';
import basicStyle from '../../../../config/basicStyle';
import './Style.css';
import routerConfig from "../../../../config/router";
import moment from "moment";
import 'moment/locale/vi';
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import {AlertDate} from "../../../../components/AlertDate/index";
import {setDefaultDate} from "../../../../helpers/utility";

moment.locale('vi');

@inject(Keys.taskStatistic, Keys.eventStatusStatistic, Keys.router)
@observer
export default class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.router = props.router;
    this.taskStatistic = props.taskStatistic;
    this.eventStatusStatistic = props.eventStatusStatistic;
  }

  redirectToComplaint = () => {
    this.router.push(routerConfig.orderComplaint);
  };

  redirectToConfirmation = () => {
    this.router.push(routerConfig.orderConfirmation);
  };

  componentDidMount() {
    this.taskStatistic.fetch();
    this.eventStatusStatistic.fetch();
  }

  // handleChangeTaskDate = (value, dateString) => {
  //     let CreatedFrom = value[0].format();
  //     let CreatedTo = value[1].format();
  //     this.props.getTaskStatusStatistics({CreatedFrom, CreatedTo})
  // };

  render() {
    const {rowStyle, colStyle, gutter} = basicStyle;
    const taskData = this.taskStatistic.dataSource;
    const eventStatusData = this.eventStatusStatistic.dataSource;
    let {CreatedFrom, CreatedTo} = setDefaultDate('CreatedFrom', 'CreatedTo');

    return (
      <PageHeaderLayout
        title={'Thống kê'}
        action={(
          <div style={{float: 'right', width: '300px'}}>
            <AlertDate
              name={'Thời gian tạo'}
              value={`${CreatedFrom && moment(CreatedFrom).format('DD-MM-YYYY')} - ${CreatedTo && moment(CreatedTo).format('DD-MM-YYYY')}`}
            />
          </div>
        )}
      >
        <Row style={rowStyle} gutter={gutter} justify="start">
          {/* tasks */}
          <Col md={12} sm={24} xs={24} style={colStyle}>
            <Spin spinning={ObjectPath.get(this.taskStatistic, "fetching", false)}>
              <Row style={rowStyle} gutter={gutter} justify={'start'}>
                <Col md={8} sm={8} xs={24} style={colStyle}>
                  <Card className={'box-item pickup'}>
                    <p>{ObjectPath.get(taskData, 'TotalPickup', 0)}</p>
                    <p>Công việc cần thu</p>
                  </Card>
                </Col>
                <Col md={8} sm={8} xs={24} style={colStyle}>
                  <Card className={'box-item'}>
                    <p>{ObjectPath.get(taskData, 'TotalPickupWaittingPickup', 0)}</p>
                    <p>Công việc thu chưa hoàn thành</p>
                  </Card>
                </Col>
                <Col md={8} sm={8} xs={24} style={colStyle}>
                  <Card className={'box-item'}>
                    <p>{ObjectPath.get(taskData, 'TotalPickupWaittingProcess', 0)}</p>
                    <p>Công việc thu chưa bàn giao</p>
                  </Card>
                </Col>
              </Row>

              <Row style={rowStyle} gutter={gutter} justify={'start'}>
                <Col md={8} sm={8} xs={24} style={colStyle}>
                  <Card className={'box-item delivery'}>
                    <p>{ObjectPath.get(taskData, 'TotalDelivery', 0)}</p>
                    <p>Công việc cần phát</p>
                  </Card>
                </Col>
                <Col md={8} sm={8} xs={24} style={colStyle}>
                  <Card className={'box-item'}>
                    <p>{ObjectPath.get(taskData, 'TotalDeliveryWaittingDelivery', 0)}</p>
                    <p>Công việc phát chưa hoàn thành</p>
                  </Card>
                </Col>
                <Col md={8} sm={8} xs={24} style={colStyle}>
                  <Card className={'box-item'}>
                    <p>{ObjectPath.get(taskData, 'TotalDeliveryWaittingProcess', 0)}</p>
                    <p>Công việc phát chưa bàn giao</p>
                  </Card>
                </Col>
              </Row>

              <Row style={rowStyle} gutter={gutter} justify={'start'}>
                <Col md={8} sm={8} xs={24} style={colStyle}>
                  <Card className={'box-item return'}>
                    <p>{ObjectPath.get(taskData, 'TotalReturn', 0)}</p>
                    <p>Công việc cần hoàn</p>
                  </Card>
                </Col>
                <Col md={8} sm={8} xs={24} style={colStyle}>
                  <Card className={'box-item'}>
                    <p>{ObjectPath.get(taskData, 'TotalReturnWaittingProcess', 0)}</p>
                    <p>Công việc hoàn chưa hoàn thành</p>
                  </Card>
                </Col>
                <Col md={8} sm={8} xs={24} style={colStyle}>
                  <Card className={'box-item'}>
                    <p>{ObjectPath.get(taskData, 'TotalReturnWaittingReturn', 0)}</p>
                    <p>Công việc hoàn chưa bàn giao</p>
                  </Card>
                </Col>
              </Row>
            </Spin>
          </Col>

          {/* orders */}
          <Col md={12} sm={24} xs={24} style={colStyle}>
            <Spin spinning={ObjectPath.get(this.eventStatusStatistic, "fetching", false)}>
              <Row style={rowStyle} gutter={gutter} justify={'start'}>
                <Col md={12} sm={12} xs={24} style={colStyle}>
                  <Card className={'box-item redirect pickup'}
                        onClick={this.redirectToConfirmation}>
                    <p>{ObjectPath.get(eventStatusData, "RePickup", "0")}</p>
                    <p>Xử lý thu</p>
                  </Card>
                </Col>
                <Col md={6} sm={6} xs={24} style={colStyle}>
                  <Card className={'box-item redirect'}
                        onClick={this.redirectToComplaint}>
                    <p>{ObjectPath.get(eventStatusData, "LostProduct", "0")}</p>
                    <p>Thất lạc</p>
                  </Card>
                </Col>
                <Col md={6} sm={6} xs={24} style={colStyle}>
                  <Card className={'box-item redirect'}
                        onClick={this.redirectToComplaint}>
                    <p>{ObjectPath.get(eventStatusData, "MistakeProduct", "0")}</p>
                    <p>Nhầm đơn hàng</p>
                  </Card>
                </Col>
              </Row>

              <Row style={rowStyle} gutter={gutter} justify={'start'}>
                <Col md={12} sm={12} xs={24} style={colStyle}>
                  <Card className={'box-item redirect delivery'}
                        onClick={this.redirectToConfirmation}>
                    <p>{ObjectPath.get(eventStatusData, "ReDelivery", "0")}</p>
                    <p>Xử lý phát</p>
                  </Card>
                </Col>
                <Col md={6} sm={6} xs={24} style={colStyle}>
                  <Card className={'box-item redirect'}
                        onClick={this.redirectToComplaint}>
                    <p>{ObjectPath.get(eventStatusData, "DamagesProduct", "0")}</p>
                    <p>Hư hỏng</p>
                  </Card>
                </Col>
                <Col md={6} sm={6} xs={24} style={colStyle}>
                  <Card className={'box-item redirect'}
                        onClick={this.redirectToComplaint}>
                    <p>{ObjectPath.get(eventStatusData, "ExcessWeight", "0")}</p>
                    <p>Vượt cân</p>
                  </Card>
                </Col>
              </Row>

              <Row style={rowStyle} gutter={gutter} justify={'start'}>
                <Col md={12} sm={12} xs={24} style={colStyle}>
                  <Card className={'box-item redirect return'}
                        onClick={this.redirectToConfirmation}>
                    <p>{ObjectPath.get(eventStatusData, "ReReturn", "0")}</p>
                    <p>Xử lý hoàn</p>
                  </Card>
                </Col>
                <Col md={12} sm={12} xs={24} style={colStyle}>
                  <Card className={'box-item redirect'}
                        onClick={this.redirectToComplaint}>
                    <p>{ObjectPath.get(eventStatusData, "WrongProduct", "0")}</p>
                    <p>Sai trạng thái</p>
                  </Card>
                </Col>
              </Row>
            </Spin>
          </Col>
        </Row>
      </PageHeaderLayout>
    )
  }
}