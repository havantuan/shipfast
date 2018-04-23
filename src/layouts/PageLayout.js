import React from 'react';
import './PageHeaderLayout.less';

export default ({children, wrapperClassName, top, ...restProps}) => (
  <div style={{margin: '-24px -24px 0'}} className={wrapperClassName}>
    {top}
    {children ? <div className={'content'}>{children}</div> : null}
  </div>
);
