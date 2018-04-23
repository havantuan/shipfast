import React, {Component} from 'react';
import {Icon, Menu, Popover} from 'antd';
import {Keys} from '../../stores/index';
import {inject, observer} from "mobx-react";

const scannerStyle = {marginLeft: '5px', verticalAlign: 'middle', display: 'inline-block', lineHeight: 'normal'};


@inject(Keys.me)
@observer
export default class TopbarBarCode extends Component {

  changeScannerKey = (key) => {
    this.setState({
      visible: false,
      success: false,
    });
    this.me.setScannerKey(key);
  };

  constructor(props) {
    super(props);
    this.me = this.props.me;
    this.state = {
      visible: false,
    };
  }

  hide = () => {
    this.setState({visible: false});
  }

  handleVisibleChange = () => {
    this.setState({visible: !this.state.visible});
  }

  onMenuClick = ({item, key, keyPath}) => {
    switch (key) {
      case 'tab':
        this.changeScannerKey(9);
        break;
      case 'enter':
        this.changeScannerKey(13);
        break;
      default:
        return;
    }
  }

  render() {
    const content = (
      <Menu className={'popover-menu'} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key={'tab'}>
          Sử dụng Tab
        </Menu.Item>
        <Menu.Item key={'enter'}>
          Sử dụng Enter
        </Menu.Item>
      </Menu>
    );

    return (
      <Popover
        content={content}
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        overlayClassName="isoUserDropdown"
        arrowPointAtCenter
      >
        <div className="isoImgWrapper">
          <Icon type="barcode" style={scannerStyle}/>
          <span style={scannerStyle}>{(+this.me.scannerKey() === 9) ? 'Tab' : 'Enter'}</span>
        </div>
      </Popover>
    );
  }
}

// const mapStateToProps = state => {
//   return {
//     scannerKey: state.updateStaffScannerKey.get('data')
//   }
// };
//
// const mapDispatchToProps = dispatch => {
//   return {
//     updateStaffScannerKey: (id, credentials) => dispatch(updateStaffScannerKey.request(id, credentials))
//   }
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(TopbarBarCode);
