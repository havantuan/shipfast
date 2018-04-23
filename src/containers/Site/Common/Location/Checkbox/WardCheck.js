import React, {PureComponent} from 'react';
import {Checkbox, Spin} from 'antd';
import './Style.css';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../stores/index";
import {isDifferentValues} from "../../../../../helpers/utility";

const CheckboxGroup = Checkbox.Group;

@inject(Keys.wardProvider)
@observer
export default class WardCheck extends PureComponent {

  constructor(props) {
    super(props);
    this.wardProvider = props.wardProvider;
  }

  componentWillReceiveProps(nextProps) {
    if (isDifferentValues(this.props.DistrictID, nextProps.DistrictID)) {
      if (nextProps.DistrictID) {
        this.wardProvider.getDataSource(null, nextProps.DistrictID);
        this.setFieldsValues();
      }
      else {
        this.wardProvider.dataSource = [];
      }

      if (nextProps.value && this.wardProvider.load) {
        let {value} = nextProps;
        if (isDifferentValues(value, this.props.value)) {
          this.wardProvider.loadDisable();
        }
        this.wardProvider.onChangeValues(value);
      }
    }
  }

  componentWillUnmount() {
    this.wardProvider.clear();
  }

  setFieldsValues = () => {
    let resetFields = this.props.setFieldsValues;

    if (resetFields) {
      let setValues = {};
      resetFields.map((key) => {
        return setValues[key] = this.wardProvider.values
      });
      this.props.form.setFieldsValue(setValues);
    }
  };

  handleChange = (checkedValues) => {
    this.wardProvider.onChange(checkedValues);
    this.onChange(checkedValues);
  };

  onChange = (e) => {
    const onChange = this.props.onChange;
    const onValueChange = this.props.onValueChange;
    if (onChange) {
      onChange(e);
    }
    if (onValueChange) {
      onValueChange(e);
    }
  };

  onCheckAllChange = (e) => {
    this.wardProvider.onCheckAllChange(e.target.checked);
    this.onChange(this.wardProvider.values);
  };

  render() {
    let {dataSource, fetching, indeterminate, checkAll, values} = this.wardProvider;
    console.log("WardCheck.values",values ? values.slice() : null);

    return (
      <Spin spinning={fetching}>
        {
          dataSource.length > 0 &&
          <Checkbox
            indeterminate={indeterminate}
            onChange={this.onCheckAllChange}
            checked={checkAll}
          >
            Chọn tất cả
          </Checkbox>
        }
        <CheckboxGroup
          onChange={this.handleChange}
          value={values ? values.slice() : []}
        >
          {Array.isArray(dataSource.slice()) && dataSource.map((item, index) => (
            <Checkbox
              className="checkboxForm"
              value={`${item.ID}`}
              key={index}
            >
              {`${item.Name}`}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </Spin>
    )
  }

}