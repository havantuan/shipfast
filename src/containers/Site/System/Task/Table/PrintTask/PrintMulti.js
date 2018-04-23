import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import "./Style.less";
import {Button, Checkbox, Col, Row} from 'antd';
import ObjectPath from "object-path";
import {numberFormat} from "../../../../../../helpers/utility";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../../stores/index";
import {isObservableArray} from 'mobx';

const CheckboxGroup = Checkbox.Group;

@withRouter
@inject(Keys.printTasks)
@observer
export default class PrintMultiTask extends Component {

  constructor(props) {
    super(props);
    this.code = props.match.params.code;
    this.printTasks = props.printTasks;
  }

  componentDidMount() {
    this.printTasks.fetchByCodes(this.code.split(",")).then((result) => {
      setTimeout(() => {
        window.print()
      }, 2000);
    });
  }

  componentWillUnmount() {
    this.printTasks.clearPrint();
  }

  render() {
    const {printData, fetchingPrint: fetching} = this.printTasks;

    return (
      <div className={'print-task'}>
        <div className="page">
          <div className="btn-print">
            <Button
              icon="printer"
              className="orange-button"
              loading={fetching}
              onClick={() => window.print()}
            >
              In bảng
            </Button>
          </div>
          {
            isObservableArray(printData) &&
            printData.map((dataSource) =>
              <div key={dataSource.Code} className="page-content">
                <div>
                  <Row type={"flex"} justify={"end"} style={{marginBottom: '10px'}}>
                    <Col span={14}>
                      <div className="col-center">
                        <h1>BẢNG KÊ CÔNG VIỆC {ObjectPath.get(dataSource, "Code")}</h1>
                        <p>
                          Nhân viên - {ObjectPath.get(dataSource, "Staff.Name")}
                        </p>
                        <p>Thời gian: {ObjectPath.get(dataSource, "CreatedAt.Pretty")}</p>
                      </div>
                    </Col>
                  </Row>
                  <div className="bordered" style={{padding: '10px 20px', height: '100%', marginBottom: '5px'}}>
                    <CheckboxGroup className={'chk-group'}>
                      <Checkbox value={'1'}>
                        1 - Sai địa chỉ
                      </Checkbox>
                      <Checkbox value={'2'}>
                        2 - Không liên hệ được
                      </Checkbox>
                      <Checkbox value={'3'}>
                        3 - Hẹn phát lại
                      </Checkbox>
                      <Checkbox value={'4'}>
                        4 - Sai sản phẩm
                      </Checkbox>
                      <Checkbox value={'5'}>
                        5 - Người mua từ chối
                      </Checkbox>
                      <Checkbox value={'6'}>
                        6 - Không đủ tiền
                      </Checkbox>
                    </CheckboxGroup>
                  </div>

                  <div className="row-task bordered">
                    {/*<div>{index + 1}</div>*/}
                    <div className="info">
                      <div>
                        <div style={{float: 'left', width: '100px'}}>
                          <p className={'font-bold'}>{dataSource.Code}</p>
                          <p>{dataSource.Orders.length} đơn</p>
                        </div>
                        <div style={{float: 'left'}}>
                          <p className="font-bold">{dataSource.CustomerName}
                            - {dataSource.CustomerPhone}</p>
                          <p>{dataSource.Address}</p>
                        </div>
                        <div style={{clear: 'both'}}/>
                      </div>
                      <div>
                        {dataSource.Orders.map((val, index) => {
                          return (
                            <Row style={{borderTop: '1px solid #e9e9e9', paddingBottom: '10px', paddingTop: '10px'}}
                                 key={index}>
                              <Col span={12}>
                                <div style={{paddingLeft: '10px'}}>
                                  <p>Số ĐT người
                                    nhận: {ObjectPath.get(val, "Receiver.Phone")}</p>
                                  <p>Trọng lượng: {ObjectPath.get(val, "NetWeight")} kg</p>
                                  <p>Ngày giờ
                                    gửi: {ObjectPath.get(val, "CreatedAt.Pretty")}</p>
                                  <p>Dịch
                                    vụ: {ObjectPath.get(val, "ServiceType.Name")}</p>
                                  <p>Tên hàng: {ObjectPath.get(val, "Name")}</p>
                                </div>
                              </Col>
                              <Col className="font-bold" span={6}>
                                <div>
                                  {
                                    ObjectPath.get(val, "Receiver.AccountReceivable") && +ObjectPath.get(val, "Receiver.AccountReceivable") > 0 ?
                                      <span>
                                        {'Tiền thu hộ: '}
                                        <span className="font-bold">
                                          {`${ObjectPath.get(val, "Receiver.AccountReceivable") ? numberFormat(ObjectPath.get(val, "Receiver.AccountReceivable"), 0, '.') : ''} đ`}
                                        </span>
                                      </span>
                                      :
                                      <span>Không thu hộ</span>
                                  }
                                </div>
                                <div>
                                  <span>Tiền cước: </span>
                                  <span className={"font-bold"}>
                                      {numberFormat(ObjectPath.get(val, "TotalCost", ''))}đ
                                  </span>
                                  {
                                    ObjectPath.has(dataSource, 'PaymentType.Name') &&
                                    <span
                                      className={'font-12'}
                                      style={{marginLeft: '5px'}}
                                    >
                                      {`(${ObjectPath.get(dataSource, 'PaymentType.Name')} thanh toán)`}
                                    </span>
                                  }
                                </div>
                                <div>
                                  <span>Tổng thu: </span>
                                  <span className={"font-bold"}>
                                    {`${numberFormat(ObjectPath.get(val, "Receiver.AccountReceivable"))}đ`}
                                  </span>
                                </div>

                                <div className="check-list">
                                  <span>1</span>
                                  <span>2</span>
                                  <span>3</span>
                                  <span>4</span>
                                  <span>5</span>
                                  <span>6</span>
                                </div>
                              </Col>
                              <Col span={6}>
                                <p className="font-bold receiver">
                                  {'Chữ ký & tên người nhận'}
                                </p>
                              </Col>
                            </Row>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <Row gutter={2} className="signature font-bold col-center">
                    <Col span={12}>
                      <div className="bordered">
                        <p>Người giao việc</p>
                        <p className="full-name">{ObjectPath.get(dataSource, "AssignStaff.Name")}</p>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="bordered">
                        <p>Nhân viên bưu tá</p>
                        <p className="full-name">{ObjectPath.get(dataSource, "Staff.Name")}</p>
                      </div>
                    </Col>
                  </Row>
                  <div className="col-center font-bold font-italic">
                    {'Lưu ý: Bạn cần đọc kỹ thông tin tiền thu hộ trước khi thanh toán & ký nhận sản phẩm'}
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}