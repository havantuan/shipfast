import React from 'react';
import {Alert, Icon, Tag} from "antd";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../stores/index";

@inject(Keys.uploadOrderByStaff, Keys.detailOrder)
@observer
export default class UploadAlerts extends React.PureComponent {

  render() {
    let {errors, importResponse} = this.props.uploadOrderByStaff;
    return (
      <div>
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
                    importResponse.map((val, idx) => (
                      <Tag key={idx} color={"purple"} onClick={(e) => this.props.detailOrder.showRootModal(val)}>
                        <span>{val}</span>
                      </Tag>
                    ))
                  }
                </div>
              )}
            />
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
      </div>
    )
  }

}