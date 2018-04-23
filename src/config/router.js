const routerPrefix = {
  home: '/',
  dashboard: '/dashboard'
};

const routerConfig = {
  home: routerPrefix.home,
  signIn: '/signin',
  page504: '/504',
  signUp: '/signup',
  forgotPassword: '/forgotpassword',
  resetPassword: '/resetpassword',
  dashboard: routerPrefix.dashboard,
  hub: routerPrefix.dashboard + '/hub',
  orderCreate: routerPrefix.dashboard + '/order',
  listOrder: routerPrefix.dashboard + '/listorder',
  task: routerPrefix.dashboard + '/task',
  printTask: '/print/task/:code',
  updateTask: routerPrefix.dashboard + '/task/update',
  printHandOver: '/print/record_update/:code',
  wareHouse: routerPrefix.dashboard + '/warehouse',
  createReceipt: routerPrefix.dashboard + '/receipt/create',
  seller: routerPrefix.dashboard + '/seller',
  printMuti: '/print/muti/:code',
  inventory: routerPrefix.dashboard + '/inventory',
  createInventory: routerPrefix.dashboard + '/inventory/create',
  updateInventory: routerPrefix.dashboard + '/inventory/update/:id',
  userConfig: routerPrefix.dashboard + '/user/config',
  map: routerPrefix.dashboard + '/map',
  listTask: routerPrefix.dashboard + '/task/list',
  detailTask: routerPrefix.dashboard + '/task/detail/:code',
  taskAssignList: routerPrefix.dashboard + '/task-assign/list',
  createRoute: routerPrefix.dashboard + '/route/add',
  Route: routerPrefix.dashboard + '/route',
  orderingOrders: routerPrefix.dashboard + '/ordering',
  payConfig: routerPrefix.dashboard + '/user/payconfig',
  list: routerPrefix.dashboard + '/hub/load',
  createList: routerPrefix.dashboard + '/hub/load/create',
  receiveList: routerPrefix.dashboard + '/hub/container/receive',
  receiveListWithCode: routerPrefix.dashboard + '/hub/container/receive/:code',
  listDetail: routerPrefix.dashboard + '/hub/load/detail/:code',
  printList: '/print/load/:code',
  printContainer: '/print/container/:code',
  revenue: routerPrefix.dashboard + '/revenue',
  handerOverList: routerPrefix.dashboard + '/handerover/list',
  detailHandOver: routerPrefix.dashboard + '/handerover/detail/:code',
  myTasks: routerPrefix.dashboard + '/my-tasks',
  Container: routerPrefix.dashboard + '/container',
  orderWatting: routerPrefix.dashboard + '/order-watting',
  detailContainer: routerPrefix.dashboard + '/container/detail/:code',
  createSeller: routerPrefix.dashboard + '/seller/create',
  updateSeller: routerPrefix.dashboard + '/seller/update/:id',
  crossCustomer: routerPrefix.dashboard + '/cross',
  crossCustomerCreate: routerPrefix.dashboard + '/cross/create',
  crossDetail: routerPrefix.dashboard + '/cross/:code',
  taskOrder: routerPrefix.dashboard + '/task-order',
  printMultipleOfTask: '/tasks/print/:code',
  orderConfirmation: routerPrefix.dashboard + '/orders/confirmation',
  orderComplaint: routerPrefix.dashboard + '/orders/complaint',
  searchOrder: routerPrefix.dashboard + '/search/:query',
  orderChart: routerPrefix.dashboard + '/chart/order',
  userChart: routerPrefix.dashboard + '/chart/user',
  discount: routerPrefix.dashboard + '/discount',
};

export default routerConfig;