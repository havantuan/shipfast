import React, {Component} from 'react';

export default class TableFooter extends Component {

  render() {
    const {pagination = {}, name} = this.props;
    let counter = pagination.pageSize * (pagination.current - 1);
    let next = pagination.pageSize * pagination.current;

    return (
      <div style={{textAlign: 'center'}}>
        {
          pagination.total > 0 &&
          (`Hiển thị từ ${counter + 1} - ${next <= pagination.total ? next : pagination.total} của ${pagination.total} ${name}`)
        }
      </div>
    )
  }

}