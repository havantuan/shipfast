import React from 'react';
import {Popover, Button, Menu, Tooltip} from 'antd';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import './rangeCalendar.less';
import moment from 'moment';
import {onChangeDateTime} from "../../../../helpers/utility";
import {dateOptionsConfig} from "../../../../config";

const options = dateOptionsConfig;

export default class SelectDate extends React.PureComponent {

  state = {
    visible: false,
    rangePickerVisible: false,
    isOptional: false
  };

  hide = () => {
    this.setState({
      rangePickerVisible: false
    }, () => {
      this.setState({visible: false})
    });
  };

  handleVisibleChange = (visible) => {
    if (visible) {
      this.setState({
        visible
      }, () => {
        this.setState({
          rangePickerVisible: this.state.isOptional
        })
      });
    }
    else if (this.state.rangePickerVisible === false) {
      this.setState({
        rangePickerVisible: false
      }, () => {
        this.setState({visible})
      })
    }
  };

  handleRangePickerVisibleChange = (rangePickerVisible) => {
    console.log('%crangePickerVisible...', 'color: #ff0000', rangePickerVisible, this.state.visible)
    // if (rangePickerVisible === false) {
    //   this.setState({
    //     rangePickerVisible: rangePickerVisible
    //   }, () => {
    //     this.setState({visible: false})
    //   });
    // }
  };

  handleChange = (startTime, endTime) => {
    if (this.props.onChange) {
      this.props.onChange([startTime, endTime]);
    }
    this.hide();
  };

  onChangeDate = (dateSelected) => {
    let time = onChangeDateTime(dateSelected);
    this.handleChange(time[0], time[1]);
  };

  handleClickMenu = ({item, key, keyPath}) => {
    let {value} = item.props;
    if (key === 'option') {
      this.setState({
        rangePickerVisible: true,
        isOptional: true
      })
    }
    else {
      this.setState({
        rangePickerVisible: false,
        isOptional: false
      });
      if (key === 'all') {
        this.handleChange(null, null);
      }
      else {
        this.onChangeDate(value);
      }
    }
  };

  handleSelectCalendar = (value) => {
    if (value && value.length >= 2) {
      let startTime = value[0].startOf('day').format();
      let endTime = value[1].endOf('day').format();
      this.handleChange(startTime, endTime);
    }
  };

  disabledDate = (current) => {
    // Can not select days after today and today
    return current && current >= moment().endOf('day');
  };

  render() {
    let {value, placeholder, title, format = 'DD-MM-YYYY', defaultSelected} = this.props;
    if (Array.isArray(value)) {
      if (value[0] && value[1]) {
        value = moment(value[0]).format(format) + ' - ' + moment(value[1]).format(format)
      }
      else value = null;
    }

    const rangePicker = (
      <RangeCalendar
        disabledDate={this.disabledDate}
        onSelect={this.handleSelectCalendar}
      />
    );

    const content = (
      <div style={{width: '160px'}}>
        <Menu
          mode="inline"
          className={'date-menu'}
          defaultSelectedKeys={[defaultSelected]}
          onClick={this.handleClickMenu}
        >
          {
            options.map((val) => <Menu.Item key={val.Key} value={val}>{val.Name}</Menu.Item>)
          }
          <Menu.Item key={'all'} value={{Type: 'all', Value: null}}>
            Tất cả
          </Menu.Item>

          <Menu.Item key={'option'} value={{Type: 'option', Value: null}}>
            <Popover
              placement="leftBottom"
              content={rangePicker}
              trigger="click"
              visible={this.state.rangePickerVisible}
              onVisibleChange={this.handleRangePickerVisibleChange}
            >
              Tùy chỉnh
            </Popover>
          </Menu.Item>
        </Menu>
      </div>
    );

    return (
      <Popover
        placement="bottomRight"
        content={content}
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <Tooltip placement="right" title={title || 'Khoảng thời gian'}>
          <Button
            icon={'calendar'}
            style={{width: '100%'}}
          >
            {value ? value : (placeholder || 'Chọn khoảng thời gian')}
          </Button>
        </Tooltip>
      </Popover>
    )
  }

}