import React, {PureComponent} from 'react';
import {Radio, Spin} from 'antd';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

const RadioGroup = Radio.Group;

@inject(Keys.orderStatusProvider)
@observer
export default class NextCodesOrderStatus extends PureComponent {

  constructor(props) {
    super(props);
    this.orderStatusProvider = this.props.orderStatusProvider;
  }

  componentDidMount() {
    this.getDataSource(this.props.code);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.code && nextProps.code !== this.props.code) {
      this.getDataSource(nextProps.code);
    }
  }

  getDataSource = (code) => {
    this.orderStatusProvider.getDataSource(code);
  };

  handleChange = (e, index) => {
    let value = e.target.value;
    this.orderStatusProvider.onChange(value, index);
    this.props.onChange(value);
  };

  render() {
    const {value, index} = this.props;
    let {dataSource, fetching, reasonValue} = this.orderStatusProvider;

    return (
      <Spin spinning={fetching}>
        <RadioGroup
          onChange={(e) => this.handleChange(e, index)}
          value={value || reasonValue[index] || undefined}
          style={{width: '100%'}}
        >
          {dataSource && dataSource.NextCodes && dataSource.NextCodes.map((item, index) =>
            <Radio key={index} value={`${item.Code}`} style={{display: 'block', lineHeight: '30px'}}>
              {`${item.Name}`}
            </Radio>
          )}
        </RadioGroup>
      </Spin>
    )
  }
}