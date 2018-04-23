import React, {PureComponent} from 'react';
import Enum from "./index";

export default class EnumState extends PureComponent {


  render() {
    return (
      <Enum
        enumKey="States"
        defaultValue={this.props.defaultValue}
        valueByCode={this.props.valueByCode}
        value={this.props.value}
        placeholder={this.props.placeholder || "Trạng thái"}
        style={this.props.style}
        onChange={this.props.onChange}
        disabled={this.props.disabled}/>
    )
  }

}
