import React from 'react';
import {Tabs, Icon} from 'antd';
import PageTabsCardLayout from "../../../../../layouts/PageTabsCardLayout";
import PrintTask from "./PrintTask/index";
import TaskList from "./TaskList";

export default class TaskAssign extends React.PureComponent {

  render() {
    return (
      <PageTabsCardLayout>
        <Tabs type="card">
          <Tabs.TabPane tab={<span><Icon type="table"/>Danh sách công việc</span>} key={'1'}>
            <TaskList/>
          </Tabs.TabPane>

          <Tabs.TabPane tab={<span><Icon type="printer"/>In nhãn công việc</span>} key={'2'}>
            <PrintTask/>
          </Tabs.TabPane>
        </Tabs>
      </PageTabsCardLayout>
    )
  }

}