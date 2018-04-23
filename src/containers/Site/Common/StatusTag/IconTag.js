import React, {PureComponent} from 'react';
import basicStyle from '../../../../config/basicStyle';
import './Style.css';
import {Icon} from 'antd';

class IconTag extends PureComponent {
  render() {

    const {types} = basicStyle;
    let {value} = this.props;
    console.log('value Icon', value)
    return (
      <Icon type={types[value]} style={{color: '#23b7e5'}}/>
    )
  }
}

export default IconTag;