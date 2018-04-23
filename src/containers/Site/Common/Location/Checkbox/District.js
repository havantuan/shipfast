import React, {PureComponent} from 'react';
import {Checkbox, Spin} from 'antd';
import './Style.css';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../stores/index";
import {isDifferentValues} from "../../../../../helpers/utility";

const CheckboxGroup = Checkbox.Group;

@inject(Keys.districtProvider)
@observer
export default class District extends PureComponent {

  constructor(props) {
    super(props);
    this.districtProvider = props.districtProvider;
  }

  componentWillReceiveProps(nextProps) {
    if (isDifferentValues(this.props.CityID, nextProps.CityID)) {
      if (nextProps.CityID) {
        this.districtProvider.getDataSource(nextProps.CityID);
        if (this.props.CityID) {
          this.districtProvider.clearValues();
        }
      } else {
        this.districtProvider.clearDataSource();
      }
    }

    if (nextProps.value && this.districtProvider.load) {
      let {value} = nextProps;
      if (isDifferentValues(value, this.props.value)) {
        this.districtProvider.loadDisable(false);
      }
      this.districtProvider.onChangeValues(value);
    }
  }

  componentWillUnmount() {
    this.districtProvider.clear();
  }

  handleChange = (checkedValues) => {
    this.districtProvider.onChange(checkedValues);
    this.onChange(checkedValues);
  };

  onCheckAllChange = (e) => {
    this.districtProvider.onCheckAllChange(e.target.checked);
    this.onChange(this.districtProvider.values);
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
    let resetFields = this.props.resetFields;

    if (resetFields) {
      let setValues = {};
      resetFields.map((key) => {
        return setValues[key] = null
      });
      this.props.form.setFieldsValue(setValues);
    }
  };

  render() {
    let {dataSource, fetching, indeterminate, checkAll, values} = this.districtProvider;
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
          {
            dataSource && dataSource.map((item, index) => (
              <Checkbox
                className="checkboxForm"
                value={`${item.ID}`}
                key={index}
              >
                {`${item.Name}`}
              </Checkbox>
            ))
          }
        </CheckboxGroup>
      </Spin>
    )
  }

}