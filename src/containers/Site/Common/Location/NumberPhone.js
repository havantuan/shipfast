import React, {PureComponent} from 'react';
import Phone, {isValidPhoneNumber} from 'react-phone-number-input'
// import rrui from 'react-phone-number-input/rrui.css'
// import rpni from 'react-phone-number-input/style.css'

class NumberPhone extends PureComponent {
  render() {
    const {phone, placeholder} = this.props
    return (
      <Phone
        country="VN"
        className="ant-input"
        placeholder={placeholder || "Nhập vào số điện thoại"}
        onChange={value => this.props.onChange(value, isValidPhoneNumber(value))}
        error={!isValidPhoneNumber(phone && phone.value) && ' '}
        value={(phone && phone.value) || null}
        indicateInvalid
      />
    )
  }
}

export default NumberPhone;
