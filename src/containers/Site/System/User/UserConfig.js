import React, {Component} from 'react';
import {Form, Icon, Radio, Tabs} from 'antd';
import AccountInfomation from './Infomation';
import InfomationCustomer from './InfomationCustomer';
import ChangePassword from './ChangePassword';
import ApiKey from './ApiKey';
import './Style.css';
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import BankAccount from "./BankAccount";
import ContentHolder from "../../../../components/utility/ContentHolder";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';

const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
@Form.create()
@inject(Keys.me)
@observer
export default class UserConfig extends Component {


  changeScannerKey = (e) => {
    this.me.setScannerKey(+e.target.value);
  };
  callback = (key) => {
    console.log(key);
  }

  constructor(props) {
    super(props)
    this.me = this.props.me;

  }

  render() {

    return (
      <PageHeaderLayout title="Cấu hình tài khoản cá nhân">
        <ContentHolder>

          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab={<span><Icon type="setting"/>Thông tin tài khoản</span>} key="1">     {
              process.env.SITE === 'KH' ?
                <InfomationCustomer/>
                :
                <div>
                  {
                    process.env.SITE === 'HUB' && <div style={{marginBottom: '20px'}}>
                      <h3 className={"title"}>Cấu hình máy quét mã vạch</h3>
                      <div style={{marginLeft: '5%'}}>
                        <RadioGroup onChange={this.changeScannerKey}
                                    value={+this.me.current.ScannerKey}>
                          <Radio value={9} className="radioStyle">Sử dụng Tab</Radio>
                          <Radio value={13} className="radioStyle">Sử dụng
                            Enter</Radio>
                        </RadioGroup>
                      </div>
                    </div>
                  }
                  <AccountInfomation/>
                </div>
            }</TabPane>
            <TabPane tab={<span><Icon type="lock"/>Thay đổi mật khẩu</span>} key="2">
              <ChangePassword/></TabPane>
            {process.env.SITE === 'KH' &&
            <TabPane tab={<span><Icon type="api"/>API</span>} key="4"> <ApiKey/></TabPane>}
            {process.env.SITE === 'KH' &&
            <TabPane tab={<span><Icon type="shopping-cart"/>Tài khoản ngân hàng</span>} key="5">
              <BankAccount/></TabPane>}
          </Tabs>

        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}
