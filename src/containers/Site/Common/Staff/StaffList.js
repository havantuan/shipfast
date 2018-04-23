import React, {PureComponent} from 'react';
import {Select} from 'antd';
import {inject, observer} from 'mobx-react';
import _ from 'lodash';

import {Keys} from "../../../../stores/index";
import {StaffSearchStore} from "../../../../stores/common/staffSearch";

const {Option} = Select;

@inject(Keys.me)
@observer
export default class StaffList extends PureComponent {

  constructor(props) {
    super(props);
    this.staffSearch = new StaffSearchStore();
  }

  componentDidMount() {
    this.staffSearch.fetch(null);
  }

  onSearch = _.debounce((value) => {
    let query = {
      Query: value,
      HubID: this.props.all ? null : this.props.me.getCurrentHub()
    };
    this.staffSearch.fetch(query);
  }, 350);

  onSelect = (value, option) => {
    const {onValueChange, onChange} = this.props;
    if (onValueChange) {
      onValueChange(value);
    }
    if (onChange) {
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
    const {dataSource} = this.staffSearch;

    return (
      <Select
        showSearch
        className="selectBox-width"
        placeholder={placeholder || "Chọn nhân viên"}
        optionFilterProp="children"
        showArrow={false}
        filterOption={false}
        allowClear
        onChange={this.handleChange}
        onSearch={this.onSearch}
        onSelect={this.onSelect}
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
    )
  }

}