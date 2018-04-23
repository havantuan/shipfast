import React, {PureComponent} from 'react';
import {Input, Radio, Spin} from 'antd';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../stores/index";

const RadioGroup = Radio.Group;
const {TextArea} = Input;

@inject(Keys.eventOrderStatus)
@observer
export default class EventStatuses extends PureComponent {

  constructor(props) {
    super(props);
    this.eventOrderStatus = this.props.eventOrderStatus;
  }

  componentDidMount() {
    this.getDataSource(this.props.code);
  }

  getDataSource = (code) => {
    if (code) {
      this.eventOrderStatus.getDataSource(code);
    }
  };

  handleTextArea = (e) => {
    let {value} = e.target;
    this.eventOrderStatus.onChangeText(value);
    this.props.onChange(value);
  };

  handleChange = (e, index) => {
    this.eventOrderStatus.onChange(e.target.value, index);
    this.props.onChange(e.target.value);
  };

  render() {
    let {value, index} = this.props;
    let {dataSource, fetching, reasonValue, isOther} = this.eventOrderStatus;

    return (
      <Spin spinning={fetching}>
        <RadioGroup
          onChange={(e) => this.handleChange(e, index)}
          value={value || reasonValue[index] || undefined}
          style={{width: '100%'}}
        >
          {dataSource.Statuses && dataSource.Statuses.map((item, index) =>
            <Radio key={index} value={`${item.Name}`} style={{display: 'block', lineHeight: '30px'}}>
              {`${item.Name}`}
            </Radio>
          )}
          <Radio value={'other'} className="radio-style">
            Chọn lý do khác
            <TextArea
              rows={4}
              style={{width: '100%', resize: 'none', display: (isOther ? 'block' : 'none')}}
              onChange={this.handleTextArea}
            />
          </Radio>
        </RadioGroup>
      </Spin>
    )
  }

}