import React from 'react';
import {Spin, Row, Col} from "antd";
import {GoogleChart} from "../../../Charts/googleChart/index";
import ObjectPath from 'object-path';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import {DonutChart} from "../../../Charts/googleChart/config";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import ContentHolder from "../../../../components/utility/ContentHolder";
import SelectDate from "../../Common/SelectDate/SelectDate";
import {defaultOptionsConfig} from "../../../../config";

@inject(Keys.taskStatusStatistic)
@observer
export default class TaskChart extends React.PureComponent {

  constructor(props) {
    super(props);
    this.taskStatusStatistic = props.taskStatusStatistic;
  }

  componentDidMount() {
    this.taskStatusStatistic.fetch();
  }

  render() {
    const taskStatusData = this.taskStatusStatistic.dataSource;

    return (
      <PageHeaderLayout
        title={'Thống kê công việc'}
      >
        <ContentHolder>
          <Row gutter={10} type={'flex'} align={'middle'}>
            <Col md={3} sm={12} xs={24} style={{textAlign: 'right'}}>
              <span>Thời gian tạo:</span>
            </Col>

            <Col md={6} sm={12} xs={24}>
              <SelectDate
                defaultSelected={defaultOptionsConfig.date}
                value={this.taskStatusStatistic.createdDateSelected}
                onChange={this.taskStatusStatistic.onChangeCreatedDate}
              />
            </Col>
          </Row>

          <Spin spinning={ObjectPath.get(this.taskStatusStatistic, "fetching", false)}>
            {
              taskStatusData && taskStatusData.length > 0 &&
              <GoogleChart
                {...DonutChart}
                data={[['task', 'statistic'], ...taskStatusData.map(val => [ObjectPath.get(val, 'StatusCode.Name', ''), val.Count])]}
                options={{
                  ...DonutChart.options,
                  title: 'Thống kê công việc',
                  colors: taskStatusData.map(val => val.StatusCode.Color)
                }}
              />
            }
          </Spin>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}