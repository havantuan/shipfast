import React, {Component} from 'react';
import {Alert, Icon, Divider, Tag} from 'antd';
import UploadExcel from "./UploadExcel";
import {Keys} from '../../../../stores/index';
import {inject, observer} from "mobx-react";
import PageLayout from "../../../../layouts/PageLayout";
import ContentHolder from "../../../../components/utility/ContentHolder";
import {isObservableArray} from 'mobx';
import OrderTable from './OrderTable';
import {Link} from "react-router-dom";
import routerUserConfig from "../../../../config/routerUser";

@inject(Keys.uploadOrder)
@observer
export default class UploadOrder extends Component {

  constructor(props) {
    super(props);
    this.uploadOrder = props.uploadOrder;
  }

  componentDidMount() {
    this.uploadOrder.fetch();
  }

  render() {
    let {response, errors, importConfig, importResponse} = this.uploadOrder;

    return (
      <PageLayout>
        <ContentHolder>
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
            importResponse && importResponse.length > 0 &&
            <div style={{paddingTop: 10}}>
              <Alert
                type="success"
                showIcon
                message={`Tạo thành công ${importResponse.length ? importResponse.length : 0} đơn hàng: `}
                description={(
                  <div>
                    {
                      importResponse.map((val, idx) => <Tag color="purple" key={idx}>{val}</Tag>)
                    }
                    <div style={{paddingTop: 10}}>
                      <Link to={routerUserConfig.listOrder}>
                        <Icon type="double-right"/> Đơn hàng của tôi
                      </Link>
                    </div>
                  </div>
                )}
              />
            </div>
          }

          {
            isObservableArray(response) && response.slice().length > 0 &&
            <div style={{paddingTop: 16}}>
              <OrderTable/>
            </div>
          }

          {
            errors && errors.length > 0 &&
            <div style={{paddingTop: 16}}>
              <Alert
                showIcon
                type="error"
                message={'Tải đơn hàng thất bại'}
                description={errors.map((val, idx) => <p key={idx}><Icon type={'tag'}/> {val.message}</p>)}
              />
            </div>
          }
        </ContentHolder>
      </PageLayout>
    );
  }
}