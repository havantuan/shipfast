import React from 'react';
import Image from '../../image/rob.png';

class FiveHundredFour extends React.Component {
  render() {
    return (
      <div className="iso500Page">
        <div className="iso500Content">
          <h1>
            {'504'}
          </h1>
          <h3>
            {'Có lỗi xảy ra vui lòng thử lại sau'}
          </h3>
          <p>
            {'Bạn vui lòng nhấn vào nút thử lại hoặc kiểm tra kết nối mạng'}
          </p>
          <button type="button" onClick={() => window.location.reload()}>

            {'Thử lại'}

          </button>
        </div>

        <div className="iso500Artwork">
          <img alt="#" src={Image}/>
        </div>
      </div>
    );
  }
}

export default FiveHundredFour;
