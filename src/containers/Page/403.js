import React from 'react';
import {Link} from 'react-router-dom';
import Image from '../../image/rob.png';
// import IntlMessages from '../../components/utility/intlMessages';
import {notification} from '../../components';

class PermissionDenied extends React.Component {
  componentDidMount() {
    notification('error', 'Từ chối truy cập', 'Bạn không có quyền truy cập trang');
  }

  render() {
    return (
      <div className="iso404Page">
        <div className="iso404Content">
          <h1>
            403
          </h1>
          <h3>
            {'Từ chối truy cập'}
          </h3>
          <p>
          </p>
          <button type="button">
            <Link to="/dashboard">
              {'Trở về'}
            </Link>
          </button>
        </div>

        <div className="iso404Artwork">
          <img alt="#" src={Image}/>
        </div>
      </div>
    );
  }
}

export default PermissionDenied;
