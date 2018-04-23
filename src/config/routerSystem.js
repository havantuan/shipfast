const routerPrefix = {
  home: '/',
  dashboard: '/dashboard'
};

const routerSystemConfig = {
  home: routerPrefix.home,
  signIn: '/signin',
  forgotPassword: '/forgotpassword',
  dashboard: routerPrefix.dashboard,
  staff: routerPrefix.dashboard + '/staff',
  createStaff: routerPrefix.dashboard + '/staff/create',
  role: routerPrefix.dashboard + '/role',
  updateStaff: routerPrefix.dashboard + '/staff/update/:id',
  userConfig: routerPrefix.dashboard + '/user/config',
  createRoute: routerPrefix.dashboard + '/route/add',
  Route: routerPrefix.dashboard + '/route',
  updateRoute: routerPrefix.dashboard + '/route/update/:id',
  activeHub: routerPrefix.dashboard + '/hub',
  createHub: routerPrefix.dashboard + '/hub/create',
  updateHub: routerPrefix.dashboard + '/hub/update/:id',
  createStaffFromUser: routerPrefix.dashboard + '/staff/user/create',
  discount: routerPrefix.dashboard + '/discount',
  notification: routerPrefix.dashboard + '/notification',
  createNotification: routerPrefix.dashboard + '/notification/create',
};

export default routerSystemConfig;