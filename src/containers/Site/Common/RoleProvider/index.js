import React, {PureComponent} from 'react';
import {Select, Spin} from 'antd';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

const {Option} = Select;

@inject(Keys.roleProvider)
@observer
export default class RoleProvider extends PureComponent {

  constructor(props) {
    super(props);
    this.roleProvider = this.props.roleProvider;
  }

  componentDidMount() {
    this.roleProvider.getDataSource();
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
    let {defaultValue, value} = this.props;
    let {dataSource, fetching} = this.roleProvider;

    return (
      <Spin spinning={fetching}>
        <Select
          showSearch
          className="selectBox-width"
          placeholder="Nhóm quyền"
          optionFilterProp="children"
          defaultValue={defaultValue}
          value={value || undefined}
          allowClear
          onChange={this.handleChange}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {dataSource.map((item, index) => (
            <Option
              value={`${item.ID}`}
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