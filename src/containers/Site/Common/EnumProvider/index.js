import React, {PureComponent} from 'react';
import {Select, Spin} from 'antd';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

const {Option} = Select;

@inject(Keys.enumProvider)
@observer
export default class Enum extends PureComponent {

  constructor(props) {
    super(props);
    this.enumProvider = props.enumProvider;
  }

  componentDidMount() {
    this.enumProvider.getDataSource();
  }

  handleChange = (changedValue) => {
    const onChange = this.props.onChange;
    const onValueChange = this.props.onValueChange;
    if (onChange) {
      onChange(changedValue);
    }
    if (onValueChange) {
      onValueChange(changedValue)
    }
  };

  render() {
    let {enumKey, valueByCode, placeholder, defaultValue, style, value} = this.props;
    let {dataSource, fetching} = this.enumProvider;
    let valueKey = valueByCode ? "Code" : "Value";

    return (
      <Spin spinning={fetching}>
        <Select
          showSearch
          className="selectBox-width"
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={(value && `${value}`) || undefined}
          style={style}
          optionFilterProp="children"
          allowClear
          onChange={this.handleChange}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {dataSource[enumKey] && dataSource[enumKey].map((enumVal, index) => (
            <Option
              value={`${enumVal[valueKey]}`}
              key={index}
            >
              {`${enumVal.Name}`}
            </Option>
          ))}
        </Select>
      </Spin>
    )
  }

}
