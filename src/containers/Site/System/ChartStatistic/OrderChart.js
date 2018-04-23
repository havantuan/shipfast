import React from 'react';
import {Spin, Row, Col, Tooltip} from "antd";
import moment from 'moment';
import {Chart, Geom, Axis, Tooltip as TooltipBizCharts} from 'bizcharts';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import {isObservableArray, computed} from 'mobx';
import SelectDate from "../../Common/SelectDate/SelectDate";
import EnumOrderStatisticsType from "../../Common/EnumProvider/orderStatisticsType";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import ContentHolder from "../../../../components/utility/ContentHolder";

@inject(Keys.ordersStatisticsByDate)
@observer
export default class OrderChart extends React.PureComponent {

  constructor(props) {
    super(props);
    this.ordersStatisticsByDate = props.ordersStatisticsByDate;
  }

  componentDidMount() {
    this.ordersStatisticsByDate.reload();
  }

  @computed
  get orderStatisticsTypeSelected() {
    return (this.ordersStatisticsByDate.filter && this.ordersStatisticsByDate.filter.OrderStatisticsType) || 'Create';
  }

  @computed
  get timeSelected() {
    let {StartTime, EndTime} = this.ordersStatisticsByDate.filter;
    if (StartTime && EndTime) {
      return [StartTime, EndTime];
    }
  }

  handleChangeTime = (time) => {
    this.ordersStatisticsByDate.onFilter({
      StartTime: time[0],
      EndTime: time[1]
    });
  };

  render() {
    let {dataSource, fetching} = this.ordersStatisticsByDate;
    if (isObservableArray(dataSource)) {
      dataSource = dataSource.map(val => {
        return {
          ...val,
          Time: val.Time ? moment(val.Time).format('DD-MM-YYYY') : null
        }
      })
    }
    else {
      dataSource = [];
    }

    const cols = {
      'Count': {min: 0},
      'Time': {range: [0, 1]}
    };

    return (
      <PageHeaderLayout
        title={'Thống kê đơn hàng'}
      >
        <ContentHolder>
          <Row gutter={10} type={'flex'} align={'middle'}>
            <Col md={3} sm={12} xs={24} style={{textAlign: 'right'}}>
              <span>Thời gian tạo:</span>
            </Col>

            <Col md={6} sm={12} xs={24}>
              <SelectDate
                defaultSelected={this.ordersStatisticsByDate.defaultKey}
                value={this.timeSelected}
                onChange={this.handleChangeTime}
              />
            </Col>

            <Col md={3} sm={12} xs={24} style={{textAlign: 'right'}}>
              <span>Công việc:</span>
            </Col>

            <Col md={6} sm={12} xs={24}>
              <Tooltip placement="left" title={'Loại công việc'}>
                <EnumOrderStatisticsType
                  valueByCode
                  value={this.orderStatisticsTypeSelected}
                  onChange={this.ordersStatisticsByDate.onChangeOrderStatisticsType}
                />
              </Tooltip>
            </Col>
          </Row>

          <Spin spinning={fetching}>
            <Chart height={400} data={dataSource ? dataSource.slice() : []} scale={cols} forceFit>
              <Axis name="Time"/>
              <Axis name="Count" label={{
                formatter: val => (val + ' đơn')
              }}/>
              <TooltipBizCharts
                crosshairs={{type: 'line'}}
                itemTpl='<tr><td style="display:none">{index}</td><td>Tổng đơn:&nbsp;</td><td>{value}</td></tr>'
              />
              <Geom type="area" position="Time*Count"/>
              <Geom type="line" position="Time*Count" size={2}/>
              <Geom type='point' position="Time*Count" size={4} shape={'circle'}
                    style={{stroke: '#fff', lineWidth: 1}}/>
            </Chart>
          </Spin>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}