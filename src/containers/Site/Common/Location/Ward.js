import React, {PureComponent} from 'react';
import {Select, Spin} from 'antd';
import {remove_mark} from "../Helpers";
import {observer} from 'mobx-react';
import {WardProviderStore} from "../../../../stores/common/wardProviderStore";

const {Option} = Select;

@observer
export default class Ward extends PureComponent {

  constructor(props) {
    super(props);
    this.wardProvider = new WardProviderStore();
  }

  componentDidMount() {
    if (this.props.DistrictID) {
      this.getDataSource(this.props.DistrictID);
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (this.props.DistrictID !== nextProps.DistrictID) {
      if (nextProps.DistrictID) {
        this.getDataSource(nextProps.DistrictID)
      }
    }
  }

  getDataSource = (districtID) => {
    this.wardProvider.getDataSource(districtID);
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
    let id = this.props.id || 'wardSelect';
    const selector = document.getElementById(id);
    if (selector) {
      selector.click();
    }
  };

  render() {
    let {DistrictID, disabled, placeholder, value} = this.props;
    let {dataSource, fetching} = this.wardProvider;

    return (
      <Spin spinning={fetching}>
        <Select
          showSearch
          className="selectBox-width"
          placeholder={placeholder || "Phường xã"}
          optionFilterProp="children"
          value={(value && `${value}`) || undefined}
          allowClear
          disabled={disabled || !DistrictID}
          onChange={this.handleChange}
          filterOption={(input, option) => remove_mark(option.props.children).toLowerCase().indexOf(remove_mark(input).toLowerCase()) >= 0}
          id={this.props.id || 'wardSelect'}
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