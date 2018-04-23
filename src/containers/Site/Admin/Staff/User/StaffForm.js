import React, {Component} from 'react';
import {Icon, Steps} from 'antd';
import ContentHolder from '../../../../../components/utility/ContentHolder';
import RegisterStaff from './RegisterStaff';
import AuthenticationStaff from './AuthenticationStaff';
import PageHeaderLayout from "../../../../../layouts/PageHeaderLayout";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../stores/index";

const Step = Steps.Step;

const steps = [{
  title: '1. Đăng ký thông tin',
  icon: <Icon type="solution"/>
}, {
  title: '2. Xác thực nhân viên',
  icon: <Icon type="user"/>
}];

@inject(Keys.staffByUser)
@observer
export default class CreateStaffByUser extends Component {

  constructor(props) {
    super(props);
    this.staffByUser = props.staffByUser;
  };

  componentWillUnmount() {
    this.staffByUser.clearData();
  }

  render() {
    const {stepIndex, isUpdateMode} = this.staffByUser;

    return (
      <PageHeaderLayout
        title={`${isUpdateMode ? 'Cập nhật thông tin' : 'Thêm'} nhân viên từ người dùng`}
      >
        <ContentHolder>
          <Steps current={stepIndex}>
            {steps.map(item => <Step key={item.title} title={item.title} icon={item.icon}/>)}
          </Steps>

          <div style={{marginTop: 16}}>
            {
              stepIndex === 0 &&
              <RegisterStaff/>
            }
            {
              stepIndex === 1 &&
              <AuthenticationStaff/>
            }
          </div>
        </ContentHolder>
      </PageHeaderLayout>
    );
  }
}