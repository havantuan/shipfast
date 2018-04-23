import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import "./Style.css";
import {Button, Checkbox, Col, Row} from 'antd';
import ObjectPath from "object-path";
import {numberFormat} from "../../../../helpers/utility";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

const CheckboxGroup = Checkbox.Group;

@withRouter
@inject(Keys.singleAssignConfirm)
@observer
export default class PrintTask extends Component {

  constructor(props) {
    super(props);
    this.code = props.match.params.code;
    this.singleAssignConfirm = props.singleAssignConfirm;
  }

  componentDidMount() {
    this.singleAssignConfirm.fetch(this.code);
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.props.dataSource !== null) {
  //       setTimeout(() => {
  //           window.print()
  //       }, 2000);
  //   }
  // }

  render() {
    const {dataSource, fetching} = this.singleAssignConfirm;

    return (
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
        <div className="page-content">
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
            <div>
              {
                dataSource && dataSource.Tasks && dataSource.Tasks.map((item, index) =>
                  <div className="row-task bordered" key={index}>
                    <div>{index + 1}</div>
                    <div className="info">
                      <div>
                        <div style={{float: 'left', width: '100px'}}>
                          <p className={'font-bold'}>{item.Code}</p>
                          <p>{item.Orders.length} đơn</p>
                        </div>
                        <div style={{float: 'left'}}>
                          <p className="font-bold">{item.CustomerName}
                            - {item.CustomerPhone}</p>
                          <p>{item.Address}</p>
                        </div>
                        <div style={{clear: 'both'}}/>
                      </div>
                      <div>
                        {item.Orders.map((val, index) => {
                          return (
                            <Row style={{borderTop: '1px solid #e9e9e9', paddingBottom: '10px', paddingTop: '10px'}}
                                 key={index}>
                              <Col span={12}>
                                <div style={{paddingLeft: '10px'}}>
                                  {item.Type.Code === 'Delivery' ?
                                  <p>Số ĐT người
                                    nhận: {ObjectPath.get(val, "Receiver.Phone")}</p> : <p>Số ĐT người
                                      gửi: {ObjectPath.get(val, "Sender.Phone")}</p> }
                                  <p>Trọng lượng: {ObjectPath.get(val, "NetWeight")} kg</p>
                                  <p>Ngày giờ
                                    gửi: {ObjectPath.get(val, "CreatedAt.Pretty")}</p>
                                  <p>Dịch
                                    vụ: {ObjectPath.get(val, "ServiceType.Name")}</p>
                                  <p>Tên đơn hàng: <b>{ObjectPath.get(val, "Code")}</b> - {ObjectPath.get(val, "Name")}</p>
                                </div>
                              </Col>
                              <Col className="font-bold" span={6}>
                                {item.Type.Code === 'Delivery' ?
                                <div>
                                  {
                                    ObjectPath.get(val, "Cod") &&  +ObjectPath.get(val, "Cod") > 0 ?
                                      <span>
                                        {'Tiền thu hộ: '}
                                        <span className="font-bold">
                                          {`${ObjectPath.get(val, "Cod") ? numberFormat(ObjectPath.get(val, "Cod"), 0, '.') : ''} đ`}
                                        </span>
                                      </span>
                                      :
                                      <span>Không thu hộ</span>
                                  }
                                </div> : '' }
                                <div>
                                  <span>Tiền cước: </span>
                                  <span className={"font-bold"}>
                                      {numberFormat(ObjectPath.get(val, "TotalCost", ''))}đ
                                  </span>
                                  {
                                    ObjectPath.has(item, 'PaymentType.Name') &&
                                    <span
                                      className={'font-12'}
                                      style={{marginLeft: '5px'}}
                                    >
                                      {`(${ObjectPath.get(item, 'PaymentType.Name')} thanh toán)`}
                                    </span>
                                  }
                                </div>
                                <div>
                                  <span>Tổng thu: </span>
                                  {item.Type.Code === 'Delivery' ?
                                  <span className={"font-bold"}>
                                    {`${numberFormat(ObjectPath.get(val, "Receiver.AccountReceivable"))}đ`}
                                  </span> : <span className={"font-bold"}>
                                    {`${numberFormat(ObjectPath.get(val, "Sender.AccountReceivable"))}đ`}
                                  </span> }
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
                                  {item.Type.Code === 'Delivery' ? 'Chữ ký & tên người nhận': 'Chữ ký & tên người gửi'}
                                </p>
                              </Col>
                            </Row>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )
              }
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
      </div>
    )
  }
}