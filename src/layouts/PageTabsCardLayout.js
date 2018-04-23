import React from 'react';
import './PageHeaderLayout.less';

export default ({children, wrapperClassName, ...restProps}) => (
  <div className={wrapperClassName} style={{margin: '-24px -24px 0', padding: '10px 5px'}}>
    <div className={'layout-tabs-card'}>
      {children}
    </div>
  </div>
);
