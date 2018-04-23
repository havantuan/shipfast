import React, {PureComponent} from 'react';
import {remove_mark} from "../Helpers";
import {Select, Spin} from 'antd';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

const {Option} = Select;

@inject(Keys.groupOrderStatusesProvider)
@observer
export default class OrderGroupStatuses extends PureComponent {

  constructor(props) {
    super(props);
    this.groupOrderStatusesProvider = this.props.groupOrderStatusesProvider;
  }

  componentDidMount() {
    this.groupOrderStatusesProvider.getDataSource(!this.props.allStatus);
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
    let {disabled, placeholder, value, mode, maxTagCount} = this.props;
    let {dataSource, fetching} = this.groupOrderStatusesProvider;

    return (
      <Spin spinning={fetching}>
        <Select
          showSearch
          mode={mode || 'default'}
          className="selectBox-width"
          placeholder={placeholder || "Nhóm trạng thái"}
          optionFilterProp="children"
          value={value || undefined}
          allowClear
          disabled={disabled}
          onChange={this.handleChange}
          filterOption={(input, option) => remove_mark(option.props.children).toLowerCase().indexOf(remove_mark(input).toLowerCase()) >= 0}
          maxTagCount={maxTagCount || 0}
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