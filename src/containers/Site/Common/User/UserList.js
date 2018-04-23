import React, {PureComponent} from 'react';
import {Select, Spin} from 'antd';
import {inject, observer} from 'mobx-react'
import _ from 'lodash';
import {Keys} from "../../../../stores/index";

const {Option} = Select;

@inject(Keys.customerProvider)
@observer
export default class UserList extends PureComponent {

  constructor(props) {
    super(props);
    this.customerProvider = props.customerProvider;
    this.state = {
      name: null
    };
  }

  componentDidMount() {
    this.customerProvider.fetch(null);
  }

  onSearch = _.debounce((value) => {
    this.setState({name: value});
    let query = {
      Query: value,
      UserType: 'Customer'
    };
    this.customerProvider.fetch(query);
  }, 350);

  onSelect = (value, option) => {
    let val = this.customerProvider.dataSource.find(val => {
      return val.ID === +value
    });
    const {onValueChange, onChange} = this.props;
    if (onValueChange) {
      onValueChange(val);
    }
    else if (onChange) {
      onChange(value);
    }
  };
  handleChange = (changedValue) => {
    if (changedValue === undefined) {
      const {onChange} = this.props;
      if (onChange) {
        onChange(changedValue);
      }
    }
  };

  render() {
    let {placeholder} = this.props;
    const {dataSource, fetching} = this.customerProvider;

    return (
      <Spin spinning={fetching}>
        <Select
          // value={this.state.name || undefined}
          showSearch
          className="selectBox-width"
          placeholder={placeholder || "Chọn nhân viên"}
          optionFilterProp="children"
          showArrow={false}
          filterOption={false}
          allowClear
          onSearch={this.onSearch}
          onSelect={this.onSelect}
          onChange={this.handleChange}
          // filterOption={(input, option) => remove_mark(option.props.children).toLowerCase().indexOf(remove_mark(input).toLowerCase()) >= 0}
        >
          {dataSource.map((item, index) => (
            <Option
              value={`${item.ID}`}
              key={index}
            >
              {`${item.Name} - ${item.Phone}`}
            </Option>
          ))}
        </Select>
      </Spin>
    )
  }

}