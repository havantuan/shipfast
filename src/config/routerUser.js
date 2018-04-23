const routerPrefix = {
  home: '/',
  dashboard: '/dashboard'
};

const routerUserConfig = {
  home: routerPrefix.home,
  signIn: '/signin',
  signUp: '/signup',
  forgotPassword: '/forgotpassword',
  resetPassword: '/resetpassword',
  listOrder: routerPrefix.dashboard,
  userConfig: routerPrefix.dashboard + '/user/config',
  // hub: routerPrefix.dashboard + '/hub',
  // listOrder: routerPrefix.dashboard + '/listorder',
  orderCreate: routerPrefix.dashboard + '/order',
  inventory: routerPrefix.dashboard + '/inventory',
  createInventory: routerPrefix.dashboard + '/inventory/create',
  updateInventory: routerPrefix.dashboard + '/inventory/update/:id',
  payConfig: routerPrefix.dashboard + '/pay/config',
  map: routerPrefix.dashboard + '/map',
  updateOrder: routerPrefix.dashboard + '/order/update/:code',
  customerDebt: routerPrefix.dashboard + '/customerDebt/',
  crossDetail: routerPrefix.dashboard + '/cross/:code',
  searchOrder: routerPrefix.dashboard + '/search/:query',
};

export default routerUserConfig;