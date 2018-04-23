import React, {Component} from 'react';
import {Select, Spin} from 'antd';
import {remove_mark} from "../../containers/Site/Common/Helpers";
import {Keys} from '../../stores/index';
import {inject, observer} from "mobx-react";
import {isObservableArray} from 'mobx';

const {Option} = Select;

@inject(Keys.me)
@observer
export default class TopbarHubs extends Component {

  handleChange = (value) => {
    if (+value === 0) {
      window.localStorage.setItem('hubPrimaryID', '0');
      window.location.reload();
      return;
    }
    window.localStorage.setItem('hubPrimaryID', value);
    this.me.setPrimaryHub(+value).then(() => {
      window.location.reload();
    })
  };

  constructor(props) {
    super(props);
    this.me = this.props.me;
  }

  render() {
    let dataSource = this.me.hubs();
    let fetching = this.me.isChangingPrimaryHub;
    const currentHub = this.me.getCurrentHub();

    return (
      <Spin spinning={fetching}>
        <Select
          style={{width: '250px'}}
          showSearch
          placeholder="Điểm gửi hàng"
          optionFilterProp="children"
          value={`${currentHub ? currentHub : 0}`}
          filterOption={(input, option) => remove_mark(option.props.children.toLowerCase()).indexOf(remove_mark(input.toLowerCase())) >= 0}
          onChange={this.handleChange}
        >
          <Option
            value={'0'}
          >
            Tất cả
          </Option>

          {
            (isObservableArray(dataSource) || Array.isArray(dataSource)) &&
            dataSource.map((item, index) =>
              <Option
                value={`${item.ID}`}
                key={index}
              >
                {`${item.DisplayName}`}
              </Option>
            )
          }
        </Select>
      </Spin>
    );
  }
}

// const mapStateToProps = state => {
//   return {
//     myHubs: myHubs.mapState(state),
//     updateSuccess: updateStaffPrimaryHub.mapState(state),
//   }
// };
//
// const mapDispatchToProps = dispatch => {
//   return {
//     getDataSource: () => dispatch(myHubs.request()),
//     updateStaffPrimaryHub: (id, credentials) => dispatch(updateStaffPrimaryHub.request(id, credentials))
//   }
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(TopbarHubs);
