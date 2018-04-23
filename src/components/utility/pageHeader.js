import React from 'react';
import classNames from 'classnames';
import '../../components/PageHeader/index.less';
// render() {
//   const {
//     title,
//     logo,
//     action,
//     content,
//     extraContent,
//     tabList,
//     className,
//     tabActiveKey,
//     tabBarExtraContent,
//   } = this.props;
//   const clsString = classNames('pageHeader', className);


export default props => (
  <div style={{margin: '-24px -24px 0'}} className={classNames('pageHeader', props.className)}>
    <div className={'detail'}>
      <div className={'main'}>
        <div className={'row'}>
          <h1 className={'title'}>{props.children}</h1>

        </div>
      </div>
    </div>
  </div>
);
