import React, {PureComponent} from 'react';
import {Select, Spin} from 'antd';
import {remove_mark} from "../Helpers";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

const {Option} = Select;

@inject(Keys.hubProvider)
@observer
export default class HubsList extends PureComponent {

  constructor(props) {
    super(props);
    this.hubProvider = this.props.hubProvider;
  }

  componentDidMount() {
    if (this.props.show) {
      this.getDataSource();
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (this.props.CityID !== nextProps.CityID) {
      if (nextProps.CityID) {
        this.getDataSource(nextProps.CityID);
      } else {
        this.handleChange(null)
      }
    }
  }

  getDataSource = (cityID = null) => {
    this.hubProvider.getDataSource(cityID);
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
  };

  render() {
    let {CityID, disabled, show, placeholder, value, style} = this.props;
    let {dataSource, fetching} = this.hubProvider;

    return (
      <Spin spinning={fetching}>
        <Select
          showSearch
          placeholder={placeholder || "Điểm gửi hàng"}
          optionFilterProp="children"
          style={{width: '100%', ...style}}
          allowClear
          value={(value && `${value}`) || undefined}
          disabled={show ? false : (disabled || !CityID)}
          onChange={this.handleChange}
          filterOption={(input, option) => remove_mark(option.props.children).toLowerCase().indexOf(remove_mark(input).toLowerCase()) >= 0}
        >
          {dataSource && dataSource.map((item, index) => (
            <Option
              value={`${item.ID}`}
              key={index}
            >
              {`${item.DisplayName}`}
            </Option>
          ))}
        </Select>
      </Spin>
    )
  }

}