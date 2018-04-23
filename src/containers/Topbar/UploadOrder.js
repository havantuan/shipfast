import React, {Component} from 'react';
import {Modal, Button, Tag, Alert, Icon, Divider} from 'antd';
import './index.less';
import UploadExcel from "../Site/Customer/UploadOrder/UploadExcel";
import './Style.css';
import {Keys} from '../../stores/index';
import {inject, observer} from "mobx-react";
import {Link} from "react-router-dom";
import routerUserConfig from "../../config/routerUser";

@inject(Keys.uploadOrder)
@observer
export default class UploadOrder extends Component {

  constructor(props) {
    super(props);
    this.uploadOrder = props.uploadOrder;
  }

  render() {
    let {response, errors, importConfig} = this.uploadOrder;

    return (
      <Modal
        title="Tải đơn hàng"
        visible={this.uploadOrder.isShowModal}
        onOk={this.uploadOrder.cancelModal}
        onCancel={this.uploadOrder.cancelModal}
        width={700}
        footer={[
          <Button
            key={'cancel'}
            onClick={this.uploadOrder.cancelUpload}
          >
            Hủy
          </Button>
        ]}
      >
        {/*<div className="textDanger">*/}
        {/*Tải Tệp Excel Mẫu. Hãy đảm bảo rằng bạn đang thao tác trên Tệp Excel Mẫu mới nhất của*/}
        {/*ShipFast.*/}
        {/*</div>*/}
        {/*<div className="textDanger">*/}
        {/*Chọn Điểm Lấy Hàng, nếu chưa có nhấn nút màu đỏ kế bên để tạo nhanh.*/}
        {/*</div>*/}
        {/*<div className="textDanger">*/}
        {/*Hãy đảm bảo rằng bạn đã đọc hết các ghi chú trong từng cột trong Tệp Excel Mẫu.*/}
        {/*</div>*/}
        {
          importConfig &&
          <div style={{paddingBottom: 10}}>
            <Alert
              type="info"
              message={(
                <div style={{textAlign: 'center'}}>
                  <a href={importConfig.Link}>
                    <Icon
                      type="download"/>{` Tải tệp Excel mẫu [Phiên bản ${importConfig.Version ? importConfig.Version : ''}]`}
                  </a>
                </div>
              )}
            />
          </div>
        }

        <Divider>Tải đơn hàng</Divider>

        <UploadExcel/>

        {
          response && response.data && response.data.length > 0 &&
          <div style={{paddingTop: 10}}>
            <Alert
              type="success"
              showIcon
              message={`Tạo thành công ${response.data.length ? response.data.length : 0} đơn hàng: `}
              description={(
                <div>
                  {
                    response.data.map((val, idx) => <Tag color="purple" key={idx}>{val}</Tag>)
                  }
                  <div style={{paddingTop: 10}}>
                    <Link to={routerUserConfig.listOrder} onClick={this.uploadOrder.cancelModal}>
                      <Icon type="double-right"/> Đơn hàng của tôi
                    </Link>
                  </div>
                </div>
              )}
            />
          </div>
        }

        {
          errors && errors.length > 0 &&
          <div style={{paddingTop: 10}}>
            <Alert
              showIcon
              type="error"
              message={'Tải đơn hàng thất bại'}
              description={errors.map((val, idx) => <p key={idx}><Icon type={'tag'}/> {val.message}</p>)}
            />
          </div>
        }
      </Modal>
    );
  }
}