const siteConfig = {
  siteName: 'SHIP-FAST',
  siteIcon: 'ion-flash',
  footerText: 'Copyright ©2017 Logistic Viet Nam'
};

const paginationConfig = {
  perPage: 20,
  page: 1
};

const defaultPagination = {
  current: 1,
  pageSize: 20,
  total: 0,
};

const defaultPaginationPrint = {
  current: 1,
  pageSize: 50,
  total: 0,
};

const formModeConfig = {
  create: 'CREATE',
  update: 'UPDATE'
};

const messageConfig = {
  successTitle: 'Xong',
  errorTitle: 'Oops! Có lỗi xảy ra',
  tryAgain: 'Vui lòng thử lại'
};

const dateOptionsConfig = [
  {Key: 'today', Type: 'day', Name: 'Hôm nay', Value: 0},
  {Key: 'yesterday', Type: 'day', Name: 'Hôm qua', Value: 1},
  {Key: '7DaysAgo', Type: 'day', Name: '7 ngày trước', Value: 7, ToNow: true},
  {Key: '14DaysAgo', Type: 'day', Name: '14 ngày trước', Value: 14, ToNow: true},
  {Key: '30DaysAgo', Type: 'day', Name: '30 ngày trước', Value: 30, ToNow: true},
  {Key: '90DaysAgo', Type: 'day', Name: '90 ngày trước', Value: 90, ToNow: true},
  {Key: 'thisWeek', Type: 'week', Name: 'Tuần này', Value: 0},
  {Key: 'lastWeek', Type: 'week', Name: 'Tuần trước', Value: 1},
  {Key: 'thisMonth', Type: 'month', Name: 'Tháng này', Value: 0},
  {Key: 'lastMonth', Type: 'month', Name: 'Tháng trước', Value: 1}
];

const defaultOptionsConfig = {
  date: '30DaysAgo'
};

export {
  siteConfig,
  paginationConfig,
  defaultPagination,
  formModeConfig,
  messageConfig,
  dateOptionsConfig,
  defaultPaginationPrint,
  defaultOptionsConfig
};
