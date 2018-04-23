import React, {PureComponent} from 'react';
import {Select, Spin} from 'antd';
import {remove_mark} from "../Helpers";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

const {Option} = Select;

@inject(Keys.serviceTypeProvider)
@observer
export default class ServiceType extends PureComponent {

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

  constructor(props) {
    super(props);
    this.serviceTypeProvider = props.serviceTypeProvider;
  }

  componentDidMount() {
    this.serviceTypeProvider.onFilter({
      SenderDistrictID: this.props.SenderDistrictID,
      ReceiverDistrictID: this.props.ReceiverDistrictID,
      IsCod: this.props.IsCod,
      Scope: this.props.Scope,
    });
  }

  isChange(nextProps, key) {
    return nextProps[key] && nextProps[key] !== this.props[key];
  }

  componentWillReceiveProps(nextProps) {
    if (this.isChange(nextProps, "SenderDistrictID")
      || this.isChange(nextProps, "SenderDistrictID")
      || this.isChange(nextProps, "ReceiverDistrictID")
      || this.isChange(nextProps, "IsCod")
      || this.isChange(nextProps, "SenderInventoryID")
    ) {
      this.serviceTypeProvider.onFilter({
        SenderDistrictID: nextProps.SenderDistrictID,
        ReceiverDistrictID: nextProps.ReceiverDistrictID,
        IsCod: nextProps.IsCod,
        SenderInventoryID: nextProps.SenderInventoryID
      });
    }
  }

  render() {
    let {disabled, placeholder, value} = this.props;
    const {dataSource, fetching} = this.serviceTypeProvider;

    return (
      <Spin spinning={fetching}>
        <Select
          showSearch
          className="selectBox-width"
          placeholder={placeholder || "Chọn dịch vụ"}
          optionFilterProp="children"
          value={value ? `${value}` : undefined}
          allowClear
          disabled={disabled}
          onChange={this.handleChange}
          filterOption={(input, option) => remove_mark(option.props.children).toLowerCase().indexOf(remove_mark(input).toLowerCase()) >= 0}
        >
          {dataSource.map((item, index) => (
            <Option
              value={`${item.ID}`}
              key={index}
              data={`${item.ValueType}`}
            >
              {`${item.Name}`}
            </Option>
          ))}
        </Select>
      </Spin>
    )
  }

}