import React, {PureComponent} from 'react';
import {Select, Spin} from 'antd';
import {remove_mark} from "../Helpers";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

const {Option} = Select;

@inject(Keys.pickingListStatuses)
@observer
export default class PickingListStatuses extends PureComponent {

  constructor(props) {
    super(props);
    this.pickingListStatuses = props.pickingListStatuses;
  }

  componentDidMount() {
    this.pickingListStatuses.getDataSource();
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
  };

  render() {
    let {disabled, placeholder, value} = this.props;
    let {dataSource, fetching} = this.pickingListStatuses;

    return (
      <Spin spinning={fetching}>
        <Select
          showSearch
          className="selectBox-width"
          placeholder={placeholder || "Trạng thái"}
          optionFilterProp="children"
          value={value || undefined}
          allowClear
          disabled={disabled}
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