/**
 *
 * @param json
 * @returns {string}
 */
import moment from "moment";
import {dateOptionsConfig, defaultOptionsConfig} from '../config';

export function serializeJSON(json = {}) {
  if (Object.keys(json).length === 0) {
    return '';
  } else {
    let parameters = Object.keys(json).filter(function (key) {
      return json[key] !== null;
    });
    return parameters.forEach(function (keyName) {
      if (json[keyName] !== null) {
        return encodeURIComponent(keyName) + '=' + encodeURIComponent(json[keyName]);
      }
    }).join('&');
  }
}


export function today() {
  let d = new Date();
  let today = d.toLocaleString();
  return '' + today;

}


export function timeDifference(givenTime) {
  givenTime = new Date(givenTime);
  const milliseconds = new Date().getTime() - givenTime.getTime();
  const numberEnding = number => {
    return number > 1 ? 's' : '';
  };
  const number = num => num > 9 ? '' + num : '0' + num;
  const getTime = () => {
    let temp = Math.floor(milliseconds / 1000);
    const years = Math.floor(temp / 31536000);
    if (years) {
      const month = number(givenTime.getUTCMonth() + 1);
      const day = number(givenTime.getUTCDate());
      const year = givenTime.getUTCFullYear() % 100;
      return `${day}-${month}-${year}`;
    }
    const days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
      if (days < 28) {
        return days + ' ngày' + numberEnding(days);
      } else {
        const months = [
          'Tháng một',
          'Tháng hai',
          'Tháng ba',
          'Tháng tư',
          'Tháng năm',
          'Tháng sáu',
          'Tháng bảy',
          'Tháng tám',
          'Tháng chín',
          'Tháng mười',
          'Tháng mười một',
          'Tháng mười hai',
        ];
        const month = months[givenTime.getUTCMonth()];
        const day = number(givenTime.getUTCDate());
        return `${day} ${month}`;
      }
    }
    const hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
      return `${hours} giờ trước`;
    }
    const minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
      return `${minutes} phút trước`;
    }
    return 'vừa xong';
  };
  return getTime();
}

export function convertToSorter(sort) {
  let sorter = {};
  if (Object.keys(sort).length > 0) {
    sorter['Field'] = sort.columnKey;
    sorter['ASC'] = sort.order === 'ascend';
    return [sorter];
  }
  return []
}

export function convertToPagination(pagination, originalPagination) {
  const pager = {...originalPagination};
  pager.current = pagination.current;
  return pager;
}

export function formatNumber(values, text = '') {
  if (values) {
    if (isNaN(values)) {
      if (values.indexOf(' ') !== -1) {
        if (text === 'number') {
          return +values.replace(/ /g, '');
        }
        if (text === 'float') {
          // value is float.
          let strArray = values.split(' ');
          strArray.pop();
          let number = strArray.join();
          return +number;
        } else {
          let strArray = values.split(' ');
          strArray.pop();
          let number = strArray.join();
          return +number.replace(/\,|\./gi, '');
        }
      }
    }
    else {
      return +values;
    }
  }
  return 0;
}

export function numberFormat(value, fix = 0, space = ".") {
  let num = parseInt(value);
  if (num) {
    let p = num.toFixed(fix).split(".");
    return p[0].split("").reduceRight(function (acc, num, i, orig) {
      if ("-" === num && 0 === i) {
        return num + acc;
      }
      let pos = orig.length - i - 1;
      return num + (pos && !(pos % 3) ? space : "") + acc;
    }, "") + (p[1] ? "." + p[1] : "");
  }
  return 0;
}

export function currencyFormat(value) {
  return value ? numberFormat(value, 0, '.') : '0';
}

export function isEmpty(obj) {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop))
      return true;
  }
  return false;
}

export function checkExist(array, val) {
  if (!Array.isArray(array) || array.length === 0) {
    return false;
  }
  // check exist value in array
  return array.some(item => `${val}`.toUpperCase() === `${item}`.toUpperCase());
}

// export function getDefaultInventoryID() {
//     let data = store.getState().getMe.get('data');
//     return ObjectPath.get(data, "Me.DefaultInventoryID", 0);
// }

export function getCurrentSite() {
  return process.env.SITE; // HUB - KH - SYSTEM
}

export function filterDateTime(dateTime) {
  return dateTime ? `="${dateTime}"` : '';
}

export function convertObjToArray(data) {
  return Object.keys(data).map(key => data[key]);
}

export function isDifferentValues(value1, value2) {
  return JSON.stringify(value1) !== JSON.stringify(value2);
}

export function onChangeDateTime(dateValue, isKey = false) {
  // dateValue: {Key: 'today', Type: 'day', Name: 'Hôm nay', Value: 0}
  let dateTime = isKey ? null : dateValue;
  if (isKey) {
    if (!dateValue) {
      dateValue = defaultOptionsConfig.date
    }
    dateTime = dateOptionsConfig.find(val => val.Key === dateValue);
    if (!dateTime) {
      dateTime = dateOptionsConfig.find(val => val.Key === defaultOptionsConfig.date);
    }
  }
  let startTime = null;
  let endTime = null;
  let timeNow = moment().endOf('day');
  if (dateTime && dateTime.Type) {
    let value = dateTime.Value || 0;
    let subtractTime = moment(timeNow).subtract(value, `${dateTime.Type}s`);
    if (dateTime.ToNow) {
      startTime = subtractTime.startOf(dateTime.Type).format();
      endTime = moment(timeNow).format();
    }
    else {
      startTime = subtractTime.startOf(dateTime.Type).format();
      endTime = subtractTime.endOf(dateTime.Type).format();
    }
  }
  return [startTime, endTime];
}

export function setDefaultDate(start, end) {
  let time = onChangeDateTime(defaultOptionsConfig.date, true);
  let tmp = {};
  tmp[start] = time[0];
  tmp[end] = time[1];
  return tmp;
}

export function trimPrefix(formValues, prefixID) {
  if (!prefixID || prefixID === '') {
    return formValues;
  }
  let data = {};
  Object.keys(formValues).forEach(val => {
    if (val.indexOf(prefixID) !== -1) {
      let key = val.replace(prefixID, '');
      data[key] = formValues[val];
    }
  });
  return data;
}