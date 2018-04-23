import React, {PureComponent} from 'react';
import basicStyle from "../../../../config/basicStyle";

class LabelStatus extends PureComponent {
  render() {
    let {labelStatus} = basicStyle;
    let format = {
      DELIVERY: {label: 'Phát hàng', style: {backgroundColor: '#e6f2ff', color: '#0059b3'}},
      PICKUP: {label: 'Thu hàng', style: {backgroundColor: '#e6ffe6', color: '#009900'}},
      RETURN: {label: 'Hoàn hàng', style: {backgroundColor: '#ffe6e6', color: '#990000'}},
    };
    let {status, total} = this.props;
    let values = format[status.toUpperCase()];

    return (
      <p style={Object.assign(values.style, labelStatus)}>{values.label} ({total})</p>
    )
  }
}

export default LabelStatus;