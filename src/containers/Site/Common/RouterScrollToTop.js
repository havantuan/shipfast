import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'

class RouterScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return (
      <div/>
    )
  }
}

export default withRouter(RouterScrollToTop);