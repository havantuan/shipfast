import React, {PureComponent} from 'react';
import {Select, Spin} from 'antd';
import {remove_mark} from "../Helpers";
import {observer} from 'mobx-react';
import {DistrictProviderStore} from "../../../../stores/common/districtProviderStore";

const {Option} = Select;

@observer
export default class District extends PureComponent {

  constructor(props) {
    super(props);
    this.districtProvider = new DistrictProviderStore()
  }

  componentDidMount() {
    if (this.props.CityID) {
      this.getDataSource(this.props.CityID);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.CityID !== nextProps.CityID) {
      if (nextProps.CityID) {
        this.getDataSource(nextProps.CityID);
      } else {
        this.handleChange(null);
      }
    }
  }

  getDataSource = (cityID) => {
    this.districtProvider.getDataSource(cityID);
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
    let id = this.props.id || 'districtSelect';
    const selector = document.getElementById(id);
    if (selector) {
      selector.click();
    }
  };

  render() {
    let {CityID, disabled, placeholder, value} = this.props;
    let {dataSource, fetching} = this.districtProvider;

    return (
      <Spin spinning={fetching}>
        <Select
          showSearch
          className="selectBox-width"
          placeholder={placeholder || "Quận huyện"}
          optionFilterProp="children"
          allowClear
          value={(value && `${value}`) || undefined}
          disabled={disabled || !CityID}
          onChange={this.handleChange}
          filterOption={(input, option) => remove_mark(option.props.children).toLowerCase().indexOf(remove_mark(input).toLowerCase()) >= 0}
          id={this.props.id || 'districtSelect'}
          onFocus={this.handleFocus}
        >
          {dataSource && dataSource.map((item, index) => (
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