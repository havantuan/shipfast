import React, {Component} from 'react';
import {Button, Checkbox, Col, Icon, Row, Spin, Table, Tag} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import StatusTag from "../../Common/StatusTag/StatusTag";
import basicStyle from '../../../../config/basicStyle';
import './Style.css';
import HandOverControl from "./HandOverControl";
import HandOverTable from "./HandOverTable";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

@inject(Keys.assignHandOver, Keys.detailOrder)
@observer
export default class HandOverOrder extends Component {

  constructor(props) {
    super(props);
    this.assignHandOver = props.assignHandOver;
  }

  componentWillUnmount() {
    this.assignHandOver.clear();
  }

  onChange = (e, index) => {
    let {value, checked} = e.target;
    this.assignHandOver.onChange(checked, value, index);
  };

  onCheckAllChange = (e) => {
    this.assignHandOver.onCheckAllChange(e.target.checked);
  };

  render() {
    const {rowStyle} = basicStyle;
    const {dataSource, indeterminate, checkAll, checkedList, filter, fetching} = this.assignHandOver;

    const title = () => (
      <Checkbox
        indeterminate={indeterminate}
        onChange={this.onCheckAllChange}
        checked={checkAll}
        style={{display: 'inline-block'}}
      >
        Chọn tất cả các đơn hàng
      </Checkbox>
    );

    const columns = [{
      key: 'rowItem',
      render: (text, record, index) =>
        <div style={{paddingLeft: '12px'}}>
          <Checkbox
            onChange={(e) => this.onChange(e, index)}
            checked={checkedList ? checkedList[index] : false}
            value={record.Code}
            style={{marginRight: '8px'}}
          >
          </Checkbox>

          <Tag color={"blue"} onClick={(e) => this.props.detailOrder.showRootModal(record.Code)}>
            <span>{record.Code}</span>
          </Tag>

          <div style={{marginLeft: '24px', marginTop: 5}}>
            {
              record.StatusCode && <StatusTag value={record.StatusCode}/>
            }
          </div>
        </div>
    }];

    return (
      <PageHeaderLayout
        title={'Bàn giao'}
      >

        <ContentHolder>
          <Row style={rowStyle} justify={"start"}>
            <Col sm={16} xs={24}>
              <HandOverControl/>
            </Col>
          </Row>
          {
            filter && filter.StaffID &&
            <Row style={rowStyle} justify={"start"} gutter={basicStyle.gutter}>
              <Col sm={7} xs={24}>
                <div className={"control"}>
                  <div className={"filter"}>
                    {/*<Dropdown overlay={menu} trigger={['click']}>*/}
                      {/*<Button>*/}
                        {/*<Icon type="filter"/>Tất cả <Icon type="down"/>*/}
                      {/*</Button>*/}
                    {/*</Dropdown>*/}
                  </div>

                  <div className={"confirm"}>
                    <Button
                      className="orange-button"
                      onClick={this.assignHandOver.confirmStatus}
                      disabled={!this.assignHandOver.isAssign}
                    >
                      <Icon type="check"/>XN trạng thái
                    </Button>
                  </div>
                </div>

                <Spin spinning={fetching || false}>
                  <Table
                    title={title}
                    bordered={true}
                    showHeader={false}
                    size={'middle'}
                    dataSource={dataSource.slice()}
                    columns={columns}
                    rowKey={record => record.Code}
                    pagination={this.assignHandOver.pagination}
                    onChange={this.assignHandOver.handleTableChange}
                  />
                </Spin>
              </Col>

              <Col sm={17} xs={24}>
                <HandOverTable/>
              </Col>
            </Row>
          }
        </ContentHolder>
      </PageHeaderLayout>
    )
  }
}