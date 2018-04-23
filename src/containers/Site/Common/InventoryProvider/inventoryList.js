import React, {PureComponent} from 'react';
import {Select, Spin} from 'antd';
import {InventoryProviderStore} from "../../../../stores/common/inventoryProviderStore";
import {observer} from 'mobx-react';

const {Option} = Select;

@observer
export default class InventoryList extends PureComponent {

  constructor(props) {
    super(props);
    if (this.props.inventoryProvider) {
      this.inventoryProvider = this.props.inventoryProvider;
    } else {
      this.inventoryProvider = new InventoryProviderStore();
    }

  }

  componentDidMount() {
    let filter = {
      UserID: this.props.userID ? this.props.userID : null,
      State: 'Active'
    };
    this.onFilter(filter);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userID && this.props.userID !== nextProps.userID) {
      let filter = {
        UserID: nextProps.userID,
        State: 'Active'
      };
      this.onFilter(filter);
    }
  }

  onFilter = (filter) => {
    this.inventoryProvider.getDataSource(filter).then((result) => {
      if (this.props.defaultInventory) {
        let data = result.data.Inventories.Items;
        if (data) {
          let val = {};
          if (data.find(val => val.IsDefault === true)) {
            val = data.find(val => val.IsDefault === true)
          }
          else {
            val = data[0]
          }
          if (val) {
            let {onChange, onValueChange} = this.props;
            if (onValueChange) {
              onValueChange(val);
            }
            if (onChange) {
              onChange(val ? val.ID : undefined);
            }
          }
        }
      }
    });
  };

  componentWillUnmount() {
    this.inventoryProvider.clear();
  }

  handleChange = (changedValue) => {
    let val = this.inventoryProvider.dataSource.find(val => {
      return val.ID === +changedValue
    });
    let {onChange, onValueChange} = this.props;
    if (onValueChange) {
      onValueChange(val);
    }
    if (onChange) {
      onChange(val ? val.ID : undefined);
    }

    if (changedValue === undefined) {
      let resetFields = this.props.resetFields;

      if (resetFields) {
        let setValues = {};
        resetFields.map((key) => {
          return setValues[key] = null
        });
        this.props.form.setFieldsValue(setValues);
      }
    }
  };

  fetchInventory = (value) => {
    this.inventoryProvider.onSearchInventory(value);
  };

  render() {
    let {placeholder, value} = this.props;
    let {dataSource, fetching} = this.inventoryProvider;
    let params = this.props.params ? ['Name', 'Phone'].concat(this.props.params) : ['Name', 'Phone'];

    return (
      <div style={{overflow: 'hidden'}}>
        <Spin spinning={fetching}>
          <Select
            style={{height: '32px'}}
            showSearch
            className="selectBox-width"
            placeholder={placeholder || "Kho hàng"}
            optionFilterProp="children"
            allowClear
            value={value ? `${value}` : undefined}
            onChange={this.handleChange}
            onSearch={this.fetchInventory}
            filterOption={false}
          >
            {dataSource.map((item, index) => (
              <Option
                value={`${item.ID}`}
                key={index}
              >
                {params.map((val, idx) => item[val] ? `${item[val]}${(idx === params.length - 1) ? '' : ' - '}` : '')}
              </Option>
            ))}
          </Select>
        </Spin>
      </div>
    )
  }

}