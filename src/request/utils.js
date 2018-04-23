import {message} from 'antd';

export function errorMessage(err) {
  let statusCode = false;
  if (err && err.response && (err.response.status === 400 || err.response.status === 422)) {
    statusCode = err.response.status
    if (err.response.body) {
      let {errors} = err.response.body;
      errors.map(val =>
        message.error(val.message)
      );
      return;
    }
  }
  if (statusCode === 401) {
    message.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
  }
  else if (statusCode !== 504) {
    console.error("Error: ", err && err.response && err.response.body);
    message.error('Có lỗi xảy ra, Vui lòng thử lại sau');
  }
}

export function successMessage(message) {
  message.success(message);
}