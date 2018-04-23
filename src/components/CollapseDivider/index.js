import React, {Component} from 'react';
import {Divider, Icon} from 'antd';

export default class CollapseDivider extends Component {

  handleClick = (e) => {
    e.preventDefault();
    this.props.onClick && this.props.onClick();
  };

  render() {
    const {expandable, children, style} = this.props;
    return (
      <div style={style}>
        <Divider>
          <a href={'#'} onClick={this.handleClick} style={{color: '#000', textDecoration: 'none'}}>
            <Icon type={expandable ? 'up' : 'down'}/>&nbsp;
            {expandable ? 'Thu nhỏ' : 'Mở rộng'}
          </a>
        </Divider>
        {
          expandable && children
        }
      </div>
    )
  }

}