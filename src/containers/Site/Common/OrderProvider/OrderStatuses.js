import React, {PureComponent} from 'react';
import {remove_mark} from "../Helpers";
import {Select, Spin} from 'antd';
import {observer} from 'mobx-react';
import {isObservableArray} from 'mobx';
import {OrderStatusesProviderStore} from "../../../../stores/common/orderStatusesProviderStore";
import {isDifferentValues} from "../../../../helpers/utility";

const {Option} = Select;

@observer
export default class OrderStatuses extends PureComponent {

  constructor(props) {
    super(props);
    this.orderStatusesProvider = new OrderStatusesProviderStore();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.groupStatusCodes && isDifferentValues(nextProps.groupStatusCodes, this.props.groupStatusCodes)) {
      this.orderStatusesProvider.getDataSource({
        GroupOrderStatus: nextProps.groupStatusCodes
      })
    }
  }

  componentWillUnmount() {
    this.orderStatusesProvider.clear();
  }

  handleChange = (changedValue) => {
    this.orderStatusesProvider.onChange(changedValue);
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
    let {disabled, placeholder, maxTagCount} = this.props;
    let {dataSource, fetching, valuesSelected} = this.orderStatusesProvider;
    let value = isObservableArray(valuesSelected) ? valuesSelected.slice() : [];

    return (
      <Spin spinning={fetching}>
        <Select
          showSearch
          mode={'multiple'}
          className="selectBox-width"
          placeholder={placeholder || "Trạng thái"}
          optionFilterProp="children"
          value={value || undefined}
          allowClear
          disabled={disabled}
          onChange={this.handleChange}
          filterOption={(input, option) => remove_mark(option.props.children).toLowerCase().indexOf(remove_mark(input).toLowerCase()) >= 0}
          maxTagCount={maxTagCount || 1}
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