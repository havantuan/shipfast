import React, {PureComponent} from 'react';
import {Select, Spin} from 'antd';
import {remove_mark} from "../Helpers";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

const {Option} = Select;

@inject(Keys.districtProvider)
@observer
export default class District extends PureComponent {

  constructor(props) {
    super(props);
    this.districtProvider = props.districtProvider;
  }

  componentDidMount() {
    this.districtProvider.getDataSource();
  };

  handleChange = (changedValue) => {
    const onChange = this.props.onChange;
    const onValueChange = this.props.onValueChange;
    if (onChange) {
      onChange(changedValue);
    }
    if (onValueChange) {
      onValueChange(changedValue)
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
    let id = this.props.id || 'districtOnlySelect';
    const selector = document.getElementById(id);
    if (selector) {
      selector.click();
    }
  };

  render() {
    let {placeholder, value, disabled} = this.props;
    let {dataSource, fetching} = this.districtProvider;

    return (
      <Spin spinning={fetching}>
        <Select
          showSearch
          className="selectBox-width"
          placeholder={placeholder || "Quận huyện"}
          optionFilterProp="children"
          allowClear
          disabled={disabled || false}
          value={(value && `${value}`) || undefined}
          onChange={this.handleChange}
          filterOption={(input, option) => remove_mark(option.props.children).toLowerCase().indexOf(remove_mark(input).toLowerCase()) >= 0}
          id={this.props.id || 'districtOnlySelect'}
          onFocus={this.handleFocus}
        >
          {dataSource.map((item, index) => (
            <Option
              value={`${item.ID}`}
              key={index}
            >
              {`${item.FullName}`}
            </Option>
          ))}
        </Select>
      </Spin>
    )
  }

}