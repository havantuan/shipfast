import React, {Component} from 'react';
import {Alert, Icon, Divider} from 'antd';
import UploadExcelByStaff from "./UploadExcelByStaff";
import {Keys} from '../../../../../stores/index';
import {inject, observer} from "mobx-react";
import PageLayout from "../../../../../layouts/PageLayout";
import ContentHolder from "../../../../../components/utility/ContentHolder";
import {isObservableArray} from 'mobx';
import OrderTable from './OrderTable';
import UploadAlerts from "./UploadAlerts";

@inject(Keys.uploadOrderByStaff, Keys.detailOrder)
@observer
export default class UploadOrder extends Component {

  constructor(props) {
    super(props);
    this.uploadOrderByStaff = props.uploadOrderByStaff;
  }

  componentDidMount() {
    this.uploadOrderByStaff.fetch();
  }

  render() {
    let {response, importConfig} = this.uploadOrderByStaff;

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

          <UploadExcelByStaff/>

          <UploadAlerts/>

          {
            isObservableArray(response) && response.slice().length > 0 &&
            <div style={{paddingTop: 16}}>
              <OrderTable/>
            </div>
          }

        </ContentHolder>
      </PageLayout>
    );
  }
}