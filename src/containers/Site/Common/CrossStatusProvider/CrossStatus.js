import React, {PureComponent} from 'react';
import {Select, Spin} from 'antd';
import {remove_mark} from "../Helpers";
import {observer, inject} from 'mobx-react';
import {Keys} from "../../../../stores/index";

const {Option} = Select;

@inject(Keys.crossStatusProvider)
@observer
export default class CrossStatus extends PureComponent {

  componentDidMount() {
    this.props.crossStatusProvider.getDataSource();
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

  render() {
    let {placeholder, value} = this.props;
    let {dataSource, fetching} = this.props.crossStatusProvider;

    return (
      <Spin spinning={fetching}>
        <Select
          showSearch
          className="selectBox-width"
          placeholder={placeholder || "Trạng thái"}
          optionFilterProp="children"
          value={(value && `${value}`) || undefined}
          allowClear
          onChange={this.handleChange}
          filterOption={(input, option) => remove_mark(option.props.children).toLowerCase().indexOf(remove_mark(input).toLowerCase()) >= 0}
        >
          {dataSource.map((item, index) => (
            <Option
              value={`${item.Code}`}
              key={index}
            >
              {`${item.Name}`}
            </Option>
          ))}
        </Select>
      </Spin>
    )
  }
}