import React from 'react';
import {Link} from 'react-router-dom';
import Image from '../../image/rob.png';
import routerConfig from "../../config/router";
import {WebSite} from "../../helpers/WebSite";

class FourZeroFour extends React.Component {
  render() {
    return (
      <div className="iso404Page">
        <div className="iso404Content">
          <h1>
            {/*<IntlMessages id="page404.title" />*/}
            404
          </h1>
          <h3>
            {/*<IntlMessages id="page404.subTitle" />*/}
            {'Không tìm thấy trang'}
          </h3>
          <p>
            {/*<IntlMessages id="page404.description" />*/}
            {'Trang đã bị xóa hoặc địa chỉ url không đúng!'}
          </p>
          <button type="button">
            {
              WebSite.IsKh() ?
                <Link to={routerConfig.listOrder}>
                  {/*<IntlMessages id="page404.backButton" />*/}
                  {'Trở về'}
                </Link>
                :
                <Link to={routerConfig.dashboard}>
                  {/*<IntlMessages id="page404.backButton" />*/}
                  {'Trở về'}
                </Link>
            }
          </button>
        </div>

        <div className="iso404Artwork">
          <img alt="#" src={Image}/>
        </div>
      </div>
    );
  }
}

export default FourZeroFour;
