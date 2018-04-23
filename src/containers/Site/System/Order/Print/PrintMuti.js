import React, {Component} from 'react';
import ObjectPath from 'object-path';
import {numberFormat, today} from '../../../../../helpers/utility';
import './Styles.less';
import {Button, Checkbox} from 'antd';
import basicStyle from '../../../../../config/basicStyle';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../../stores/index';
import {withRouter} from "react-router-dom";

@withRouter
@inject(Keys.mutiOrder, Keys.router)
@observer
export default class Print_Muti extends Component {

  constructor(props) {
    super(props);
    this.state = {
      form1: true,
      form2: true
    };
    this.code = props.match.params.code;
  }

  componentDidMount() {
    this.props.mutiOrder.fetch(this.code.split(",")).then(result => {
      setTimeout(() => {
        this.printCustomSize();
      }, 2000);
    });
  }

  componentWillUnmount() {
    this.props.mutiOrder.clear();
  }

  printA4Size = () => {
    this.printCustomSize('A4 landscape');
  };

  printA5Size = () => {
    this.printCustomSize('A5');
  };

  printCustomSize = (size = 'A5') => {
    let css = `@page { size: ${size}; }`,
      head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');

    style.type = 'text/css';
    style.media = 'print';

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
    window.print();
  };

  onToggleForm1 = (e) => {
    this.setState({form1: e.target.checked})
  };

  onToggleForm2 = (e) => {
    this.setState({form2: e.target.checked})
  };

  render() {
    const {orangeButton} = basicStyle;
    let {dataSource, fetching} = this.props.mutiOrder;

    return (
      <div className={'print-orders'}>
        <div className="position">
          <div style={{marginBottom: '10px', float: 'right'}}>
            <div style={{width: '100px', textAlign: 'left'}}>
              <div>
                <Checkbox
                  checked={this.state.form2}
                  onChange={this.onToggleForm2}
                >
                  Phiếu thu
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  checked={this.state.form1}
                  onChange={this.onToggleForm1}
                >
                  Phiếu phát
                </Checkbox>
              </div>
            </div>
          </div>
          <div style={{marginBottom: '10px'}}>
            <Button
              style={orangeButton}
              onClick={this.printA4Size}
              loading={fetching}
              icon="printer"
            >
              In đơn hàng (A4)
            </Button>
          </div>
          <div>
            <Button
              style={orangeButton}
              loading={fetching}
              icon="printer"
              onClick={this.printA5Size}
            >
              Theo A5
            </Button>
          </div>
        </div>
        {dataSource.map((item, index) =>
          <div className="body" style={{color: '#000000'}} key={index}>
            {
              this.state.form1 &&
              <div className={'form1'}>
                <table className="tbl-title" width="100%" cellPadding="0" cellSpacing="0">
                  <tbody>
                  <tr className="text-center">
                    <td>Trọng lượng&nbsp;(kg)
                      <div><span className="font-bold font-15">{item.NetWeight}</span></div>
                    </td>
                    <td>Dịch vụ
                      <div><span
                        className="font-bold font-15">{item.ServiceType && item.ServiceType.Name ? item.ServiceType.Name : ''}</span>
                      </div>
                    </td>

                    <td>Tỉnh phát
                      <div><span className="font-bold font-15">{item.Sender.City.Code}</span></div>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <table width="100%" style={{border: '1px solid #000', borderTop: 'none'}}
                       className="table"

                       cellPadding="10" cellSpacing="0">
                  <tbody>
                  <tr>
                    <td className="padding-t-5">
                      <table className="table_top">
                        <tbody>
                        <tr>
                          <td className="font-15">
                            NGƯỜI NHẬN: <span
                            className="font-bold ">{item.Receiver && item.Receiver.Name ? item.Receiver.Name : 0}</span>
                            <div>
                              ĐIỆN THOẠI: <span
                              className="font-bold ">{item.Receiver && item.Receiver.Phone ? item.Receiver.Phone : 0}</span>
                            </div>
                            <div>
                              ĐỊA CHỈ: <span
                              className="font-bold ">{item.Receiver && item.Receiver.Address ? item.Receiver.Address : ''}</span>
                            </div>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td width="50%">
                      <table className="table_top">
                        <tbody>
                        <tr>
                          <td className="text-center" rowSpan="2" style={{width: "30%"}}>
                            <img
                              style={{width: "90%", maxWidth: '120px'}}
                              src={item.QRCode ? item.QRCode : ''}
                              alt={item.QRCode ? item.QRCode : ''}
                            />
                            <div className="text-center">
                              <span className="font-bold ">{item.Code ? item.Code : item.Code}</span>
                            </div>
                          </td>
                          <td className="font-12">
                            NGƯỜI GỬI: <span
                            className="font-bold ">{item.Sender && item.Sender.Name ? item.Sender.Name : ''}</span>
                            &nbsp;&nbsp;&nbsp;ĐT: <span
                            className="font-bold ">{item.Sender && item.Sender.Phone ? item.Sender.Phone : ''}</span>
                            <div>
                              ĐỊA CHỈ: <span
                              className="font-bold ">{item.Sender && item.Sender.Address ? item.Sender.Address : ''}</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="font-13 border">
                            <div className="td-padding">
                              SP: {item && item.Name ? item.Name : ''}
                              <span
                                className="font-italic"
                                style={{float: "right"}}
                              >
                            Giá trị: {item && item.PackageValue ? numberFormat(item.PackageValue, 0, '.') : '0'}đ
                          </span>
                              <div>
                                {
                                  item.Cod > 0 ?
                                    <span className="">Tiền thu hộ:&nbsp;
                                      <span className="font-bold">
                                    {numberFormat(ObjectPath.get(item, 'Cod', 0), 0, '.')}đ
                                  </span>
                                </span>
                                    : <span className="">Không thu hộ</span>
                                }
                                <div>
                                  <span>Tiền cước: </span>
                                  <span className={"font-bold"}>
                                  {item.TotalCost ? numberFormat(item.TotalCost, 0, '.') : '0'}đ
                              </span>
                                  {
                                    ObjectPath.has(item, 'PaymentType.Name') &&
                                    <span className={'font-12'} style={{marginLeft: '5px'}}>
                                    {`(${ObjectPath.get(item, 'PaymentType.Name')} thanh toán)`}
                                </span>
                                  }
                                </div>
                                <div>
                                  <span>Tổng thu: </span>
                                  <span className={"font-bold"}>
                                  {item && item.Receiver.AccountReceivable ? numberFormat(item.Receiver.AccountReceivable, 0, '.') : ''}đ
                              </span>
                                </div>
                                <div className="font-bold"
                                     style={{textAlign: "right"}}>
                                  {item && (item.Cod && +item.Cod > 0) && item.CanCheck ? item.CanCheck.Name : ''}
                                </div>
                                <span>Ghi chú: </span>{item && item.DeliveryNote ? item.DeliveryNote : ''}
                              </div>
                            </div>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr className="font-12">
                    <td className="padding-t-10">
                      <div className={"text-right"}>
                        <span className={"font-12"}>{today()}</span>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            }

            {
              this.state.form2 &&
              <div className="form2">
                <div style={{borderBottom: "1px solid #000", paddingBottom: '5px'}}>
                  <div className="text-center"
                       style={{width: '30%', display: 'inline-block', marginBottom: '5px'}}>
                    <img
                      style={{width: "90%", maxWidth: '120px'}}
                      src={item.QRCode ? item.QRCode : ''}
                      alt={item.QRCode ? item.QRCode : ''}
                    />
                    <p className="font-bold">{item.Code}</p>
                  </div>
                  <div className="info">
                    <div>NGƯỜI NHẬN: <span className="font-bold">{item.Receiver.Name}</span></div>
                    <div>ĐIỆN THOẠI: <span className="font-bold">{item.Receiver.Phone}</span></div>
                    <div>ĐỊA CHỈ: <span className="font-bold">{item.Receiver.Address}</span></div>
                    <div>
                      {
                        item.Cod > 0 ?
                          <span className="">
                          Tiền thu hộ:&nbsp;
                            <span className="font-bold">
                              {numberFormat(ObjectPath.get(item, 'Cod', 0), 0, '.')}đ
                          </span>
                        </span>
                          : <span className="">Không thu hộ</span>
                      }
                    </div>
                    <p>
                      {'Tiền cước: '}
                      <span className="font-bold">
                      {item.TotalCost ? numberFormat(item.TotalCost, 0, '.') : '0'}đ
                    </span>
                      {
                        ObjectPath.has(item, 'PaymentType.Name') &&
                        <span className={'font-12'} style={{marginLeft: '5px'}}>
                        {`(${ObjectPath.get(item, 'PaymentType.Name')} thanh toán)`}
                      </span>
                      }
                    </p>
                    <div>
                      <span>Tổng thu: </span>
                      <span className={"font-bold"}>
                        {item && item.Receiver.AccountReceivable ? numberFormat(item.Receiver.AccountReceivable, 0, '.') : ''}đ
                    </span>
                    </div>
                  </div>
                </div>
                <div className="signature">
                  <div className="text-center font-bold" style={{borderRight: '1px solid #000'}}>
                    Nội dung gửi
                  </div>
                  <div className="text-center font-bold">
                    Chữ ký người nhận
                  </div>
                </div>
                <p className="text-center">{today()}</p>
              </div>
            }
          </div>
        )}
      </div>
    );
  }
}
