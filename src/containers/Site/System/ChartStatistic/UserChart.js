import React from 'react';
import {Spin, Row, Col} from "antd";
import moment from 'moment';
import {Chart, Geom, Axis, Tooltip as TooltipBizCharts} from 'bizcharts';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import {isObservableArray} from 'mobx';
import SelectDate from "../../Common/SelectDate/SelectDate";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import ContentHolder from "../../../../components/utility/ContentHolder";
import {defaultOptionsConfig} from "../../../../config";

@inject(Keys.usersStatisticsByDate)
@observer
export default class UserChart extends React.PureComponent {

  constructor(props) {
    super(props);
    this.usersStatisticsByDate = props.usersStatisticsByDate;
  }

  componentDidMount() {
    this.usersStatisticsByDate.fetchByTimeDefault();
  }

  render() {
    let {dataSource, fetching} = this.usersStatisticsByDate;
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
        title={'Thống kê người dùng'}
      >
        <ContentHolder>
          <Row gutter={10} type={'flex'} align={'middle'}>
            <Col md={3} sm={12} xs={24} style={{textAlign: 'right'}}>
              <span>Thời gian tạo:</span>
            </Col>

            <Col md={6} sm={12} xs={24}>
              <SelectDate
                defaultSelected={defaultOptionsConfig.date}
                value={this.usersStatisticsByDate.timeSelected}
                onChange={this.usersStatisticsByDate.onChangeTime}
              />
            </Col>
          </Row>

          <Spin spinning={fetching}>
            <Chart height={400} data={dataSource ? dataSource.slice() : []} scale={cols} forceFit>
              <Axis name="Time"/>
              <Axis name="Count" label={{
                formatter: val => (val + ' người')
              }}/>
              <TooltipBizCharts
                crosshairs={{type: 'line'}}
                itemTpl='<tr><td style="display:none">{index}</td><td>Số người:&nbsp;</td><td>{value}</td></tr>'
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