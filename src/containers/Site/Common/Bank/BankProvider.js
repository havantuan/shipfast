import React, {PureComponent} from 'react';
import {Select, Spin} from 'antd';
import {remove_mark} from "../Helpers";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

const {Option} = Select;

@inject(Keys.bankProvider)
@observer
export default class BankProvider extends PureComponent {

  constructor(props) {
    super(props);
    this.bankProvider = this.props.bankProvider;
  }

  componentDidMount() {
    this.bankProvider.getDataSource();
  }

  handleChange = (changedValue) => {
    const onChange = this.props.onChange;
    const onValueChange = this.props.onValueChange;
    if (onChange) {
      onChange(changedValue);
    }
    if (onValueChange) {
      onValueChange(changedValue);
    }
    let resetFields = this.props.resetFields;

    if (resetFields) {
      let setValues = {};
      resetFields.map((key) => {
        return setValues[key] = null
      });
      this.props.form.setFieldsValue(setValues);
    }
  };

  handleFocus = () => {
    let id = this.props.id || 'citySelect';
    const selector = document.getElementById(id);
    if (selector) {
      selector.click();
    }
  };

  render() {
    let {disabled, placeholder, value} = this.props;
    let {dataSource, fetching} = this.bankProvider;

    return (
      <Spin spinning={fetching}>
        <Select
          showSearch
          className="selectBox-width"
          placeholder={placeholder || "Ngân hàng"}
          optionFilterProp="children"
          value={(value && `${value}`) || undefined}
          allowClear
          disabled={disabled}
          onChange={this.handleChange}
          filterOption={(input, option) => remove_mark(option.props.children).toLowerCase().indexOf(remove_mark(input).toLowerCase()) >= 0}
          onFocus={this.handleFocus}
        >
          {dataSource.map((item, index) => (
            <Option
              value={`${item.ID}`}
              key={index}
            >
              {`${item.ShortenName}`}
            </Option>
          ))}
        </Select>
      </Spin>
    )
  }
}