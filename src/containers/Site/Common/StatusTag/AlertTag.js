import React, {PureComponent} from 'react';
import './Style.css';

class AlertTag extends PureComponent {
  render() {
    let {value} = this.props;
    return (
      <div style={{backgroundColor: value.Color}} className="alert">{this.props.text} <b>{value.Name}</b></div>
    )
  }
}

export default AlertTag;