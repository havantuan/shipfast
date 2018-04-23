import React, {Component} from 'react';
import {Button} from 'antd';
import ContentHolder from '../../../../../components/utility/ContentHolder';
import CreateListItem from "./CreateListItem";
import OrderCreateList from "./OrderCreateList";
import CreateContainer from "./CreateContainer";
import PageHeaderLayout from "../../../../../layouts/PageHeaderLayout";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../../stores/index";

@inject(Keys.createPickingList)
@observer
export default class CreateList extends Component {

  constructor(props) {
    super(props);
    this.createPickingList = props.createPickingList;
  }

  render() {
    const {keys} = this.createPickingList;

    return (
      <PageHeaderLayout
        title={'Tạo bảng kê đi'}
      >
        <ContentHolder>
          <div style={{marginBottom: '20px'}}>
            <div className={'picking-list-header'}>
              <h2>Bước 1. Tạo bảng kê</h2>
              <p style={{fontStyle: 'italic'}}>
                {`(Bạn có thể tạo được nhiều bảng kê trước khi tạo chuyến thư đi!)`}
              </p>
            </div>

            <ContentHolder>
              {
                Array.isArray(keys.slice()) &&
                keys.map((val, index) => (
                  <div key={index} className="create-list-item">
                    {
                      keys.length > 1 &&
                      <h2 style={{marginTop: index !== 0 ? '15px' : '0'}}>
                        {`Bảng kê thứ ${index + 1}`}
                      </h2>
                    }

                    <OrderCreateList
                      {...val}
                      onFormChange={this.createPickingList.handleFormChange}
                    />

                    <CreateListItem
                      {...val}
                      counter={keys.length}
                      onFormChange={this.createPickingList.handleFormChange}
                    />
                  </div>
                ))
              }

              <div style={{marginTop: '20px'}}>
                <Button
                  icon="plus"
                  onClick={this.createPickingList.addListItem}
                >
                  Thêm bảng kê
                </Button>
              </div>
            </ContentHolder>
          </div>

          <div>
            <h2 className={'picking-list-header'}>Bước 2. Tạo chuyến thư</h2>

            <CreateContainer/>
          </div>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }
}