import React, {Component} from 'react';
import {Icon, Steps} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import RegisterStaff from './RegisterStaff';
import AuthenticationStaff from './AuthenticationStaff';
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

const Step = Steps.Step;

const steps = [{
  title: '1. Đăng ký thông tin',
  icon: <Icon type="solution"/>
}, {
  title: '2. Xác thực nhân viên',
  icon: <Icon type="user"/>
}];

@inject(Keys.staff)
@observer
export default class CreateStaff extends Component {

  constructor(props) {
    super(props);
    this.staff = props.staff;
  };

  componentWillUnmount() {
    this.staff.clearData();
  }

  render() {
    const {stepIndex, isUpdateMode} = this.staff;

    return (
      <PageHeaderLayout
        title={`${isUpdateMode ? 'Cập nhật thông tin' : 'Thêm'} nhân viên`}
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