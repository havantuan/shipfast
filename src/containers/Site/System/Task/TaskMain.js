import React, {Component} from 'react';
import {Col, Row} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import basicStyle from '../../../../config/basicStyle';
import TaskList from "./TaskList";
import TaskTable from "./TaskTable";
import PageLayout from "../../../../layouts/PageLayout";

export default class TaskMain extends Component {

  render() {
    const {rowStyle, colStyle, gutter} = basicStyle;

    return (
      <PageLayout>
        <ContentHolder>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={8} sm={8} xs={24} style={colStyle}>
              <TaskList/>
            </Col>

            <Col md={16} sm={16} xs={24} style={colStyle}>
              <TaskTable/>
            </Col>
          </Row>
        </ContentHolder>
      </PageLayout>
    );
  }
}