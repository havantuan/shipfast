import React, {Component} from 'react';
import ContentHolder from '../../../../../components/utility/ContentHolder';
import './Style.css';
import TaskListControl from "./TaskListControl";
import TaskTable from "./TaskTable";
import PageLayout from '../../../../../layouts/PageLayout';

export default class TaskList extends Component {

  render() {
    return (
      <PageLayout>
        <ContentHolder>
          <div style={{marginBottom: '10px'}}>
            <TaskListControl/>
          </div>

          <TaskTable/>
        </ContentHolder>
      </PageLayout>
    )
  }

}
