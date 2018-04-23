// Use require.context to require reducers automatically
// Ref: https://webpack.github.io/docs/context.html
// const context = require.context('./', false, /\.js$/);
// const keys = context.keys().filter(item => item !== './index.js');

import appStore from './appStore';
import routerStore from './routerStore';
import authStore from './authStore';
import meStore from './meStore';
import updateCustomerStore from './updateCustomerStore';
import myApiKeyStore from './myApiKeyStore';
import myBankStore from './myBankStore';
import staffProfileStore from './staffProfileStore';
import MyCrossStore from './crossStore';
import crossStore from './crossStore';
import customerDebtStore from './customerDebtStore';
import routeStore from "./routeStore";
import hubProviderStore from "./common/hubProviderStore";
import cityProviderStore from "./common/cityProviderStore";
import districtProviderStore from "./common/districtProviderStore";
import wardProviderStore from "./common/wardProviderStore";
import staffProviderStore from "./common/staffProviderStore";
import taskStatusProviderStore from "./common/taskStatusProviderStore";
import crossStatusProviderStore from "./common/crossStatusProviderStore";
import bankProviderStore from "./common/bankProviderStore";
import enumProviderStore from "./common/enumProviderStore";
import inventoryProviderStore from "./common/inventoryProviderStore";
import orderStatusProviderStore from "./common/orderStatusProviderStore";
import groupOrderStatusesProviderStore from "./common/groupOrderStatusesProviderStore";
import eventOrderStatusStore from "./common/eventOrderStatusStore";
import pickingListStatusesStore from "./common/pickingListStatusesStore";
import roleProviderStore from "./common/roleProviderStore";
import inventoryStore from "./inventoryStore";
import serviceTypeProviderStore from "./common/serviceTypeProviderStore";
import customerProviderStore from "./common/customerProviderStore";
import discountStore from './discountStore';
import myInventoryStore from "./myInventoryStore";
import hubsForMapStore from "./hubsForMapStore";
import orderGroupStatusStore from "./orderGroupStatusStore";
import myOrderStore from "./myOrderStore";
import updateRouteStore from "./updateRouteStore";
import staffStore from "./staffStore";
import roleStore from "./roleStore";
import hubStore from "./hubStore";
import staffByUserStore from "./staffByUserStore";
import permissionStore from "./permissionStore";
import createOrderStore from "./createOrderStore";
import notificationStore from './notificationStore';
import hubTableStore from './hubTableStore';
import eventStatusStatisticStore from './statistics/eventStatusStatisticStore';
import taskStatisticStore from './statistics/taskStatisticStore';
import taskStatusStatisticStore from './statistics/taskStatusStatisticStore';
import orderingOrderStore from './orders/orderingOrderStore';
import grantTaskStore from './tasks/grantTaskStore';
import taskAssignGroupStore from './tasks/taskAssignGroupStore';
import orderStore from './orders/orderStore';
import taskStore from './taskStore';
import singleAssignConfirmStore from './tasks/singleAssignConfirmStore';
import assignConfirmStore from './assignConfirmStore';
import handerOverStore from './handerOverStore';
import letterContainerStore from './letterContainerStore';
import wattingOrderStore from './orders/wattingOrderStore';
import assignHandOverStore from './handOver/assignHandOverStore';
import customerTableStore from './customerTableStore';
import createPickingListStore from './pickingList/createPickingListStore';
import createContainerStore from './pickingList/createContainerStore';
import receivePickingListStore from './pickingList/receivePickingListStore';
import pickingListStore from './pickingList/pickingListStore';
import labelOrderStore from './orders/labelOrderStore';
import reProcessOrderStore from './orders/reProcessOrderStore';
import MutiOrderStore from './orders/mutiOrderStore';
import detailOrderStore from './orders/detailOrderStore';
import myTaskStore from './tasks/myTaskStore';
import uploadOrderStore from './uploadOrderStore';
import detailcrossStore from './detailcrossStore';
import detailContainer from './detailContainer';
import crossTableStore from './crossTableStore';
import handerOverDetail from './handerOverDetail';
import staffSearch from './common/staffSearch';
import ordersStatisticsByDateStore from './statistics/ordersStatisticsByDateStore';
import TaskOrderStore from './TaskOrderStore';
import printTasksStore from './tasks/printTasksStore';
import meCrossStore from './meCrossStore';
import orderStatusesProviderStore from './common/orderStatusesProviderStore';
import myLabelOrderStore from './orders/myLabelOrderStore';
import uploadOrderByStaffStore from './orders/uploadOrderByStaffStore';
import usersStatisticsByDateStore from './statistics/usersStatisticsByDateStore';
import groupTaskOrderStatusesProviderStore from './common/groupTaskOrderStatusesProviderStore';


const Keys = {
  app: 'app',
  auth: 'auth',
  router: 'router',
  me: 'me',
  updateCustomer: 'updateCustomer',
  myApiKey: 'myApiKey',
  staffProfile: 'staffProfile',
  myCross: 'myCross',
  customerDebt: 'customerDebt',
  myBank: 'myBank',
  route: 'route',
  hubProvider: 'hubProvider',
  cityProvider: 'cityProvider',
  districtProvider: 'districtProvider',
  wardProvider: 'wardProvider',
  staffProvider: 'staffProvider',
  taskStatusProvider: 'taskStatusProvider',
  crossStatusProvider: 'crossStatusProvider',
  bankProvider: 'bankProvider',
  enumProvider: 'enumProvider',
  inventoryProvider: 'inventoryProvider',
  orderStatusProvider: 'orderStatusProvider',
  orderStatusesByGroupCodeProvider: 'orderStatusesByGroupCodeProvider',
  groupOrderStatusesProvider: 'groupOrderStatusesProvider',
  eventOrderStatus: 'eventOrderStatus',
  pickingListStatuses: 'pickingListStatuses',
  roleProvider: 'roleProvider',
  inventoryStore: 'inventoryStore',
  serviceTypeProvider: 'serviceTypeProvider',
  customerProvider: 'customerProvider',
  discount: 'discount',
  myInventory: 'myInventory',
  hubsForMap: 'hubsForMap',
  orderGroupStatus: 'orderGroupStatus',
  myOrder: 'myOrder',
  updateRoute: 'updateRoute',
  staff: 'staff',
  role: 'role',
  hub: 'hub',
  staffByUser: 'staffByUser',
  createOrder: 'createOrder',
  notification: 'notification',
  permission: 'permission',
  eventStatusStatistic: 'eventStatusStatistic',
  taskStatistic: 'taskStatistic',
  taskStatusStatistic: 'taskStatusStatistic',
  hubTable: 'hubTable',
  orderingOrder: 'orderingOrder',
  grantTask: 'grantTask',
  taskAssignGroup: 'taskAssignGroup',
  order: 'order',
  task: 'task',
  singleAssignConfirm: 'singleAssignConfirm',
  assignConfirm: 'assignConfirm',
  handerOver: 'handerOver',
  letterContainer: 'letterContainer',
  wattingOrder: 'wattingOrder',
  assignHandOver: 'assignHandOver',
  customerTable: 'customerTable',
  cross: 'cross',
  createPickingList: 'createPickingList',
  createContainer: 'createContainer',
  receivePickingList: 'receivePickingList',
  pickingList: 'pickingList',
  labelOrder: 'labelOrder',
  reProcessOrder: 'reProcessOrder',
  mutiOrder: 'mutiOrder',
  detailOrder: 'detailOrder',
  myTask: 'myTask',
  uploadOrder: 'uploadOrder',
  detailcross: 'detailcross',
  detailContainer: 'detailContainer',
  crossTable: 'crossTable',
  handerOverDetail: 'handerOverDetail',
  staffSearch: 'staffSearch',
  ordersStatisticsByDate: 'ordersStatisticsByDate',
  TaskOrder: 'TaskOrder',
  printTasks: 'printTasks',
  meCross: 'meCross',
  orderStatusesProvider: 'orderStatusesProvider',
  myLabelOrder: 'myLabelOrder',
  uploadOrderByStaff: 'uploadOrderByStaff',
  groupTaskOrderStatus: 'groupTaskOrderStatus',
  usersStatisticsByDate: 'usersStatisticsByDate',
};

const stores = {
  app: appStore,
  router: routerStore,
  auth: authStore,
  me: meStore,
  updateCustomer: updateCustomerStore,
  myApiKey: myApiKeyStore,
  myBank: myBankStore,
  staffProfile: staffProfileStore,
  myCross: MyCrossStore,
  customerDebt: customerDebtStore,
  route: routeStore,
  hubProvider: hubProviderStore,
  cityProvider: cityProviderStore,
  districtProvider: districtProviderStore,
  wardProvider: wardProviderStore,
  staffProvider: staffProviderStore,
  taskStatusProvider: taskStatusProviderStore,
  crossStatusProvider: crossStatusProviderStore,
  bankProvider: bankProviderStore,
  enumProvider: enumProviderStore,
  inventoryProvider: inventoryProviderStore,
  orderStatusProvider: orderStatusProviderStore,
  groupOrderStatusesProvider: groupOrderStatusesProviderStore,
  eventOrderStatus: eventOrderStatusStore,
  pickingListStatuses: pickingListStatusesStore,
  roleProvider: roleProviderStore,
  inventoryStore: inventoryStore,
  serviceTypeProvider: serviceTypeProviderStore,
  customerProvider: customerProviderStore,
  discount: discountStore,
  myInventory: myInventoryStore,
  hubsForMap: hubsForMapStore,
  orderGroupStatus: orderGroupStatusStore,
  myOrder: myOrderStore,
  updateRoute: updateRouteStore,
  staff: staffStore,
  role: roleStore,
  hub: hubStore,
  staffByUser: staffByUserStore,
  permission: permissionStore,
  createOrder: createOrderStore,
  notification: notificationStore,
  hubTable: hubTableStore,
  eventStatusStatistic: eventStatusStatisticStore,
  taskStatistic: taskStatisticStore,
  taskStatusStatistic: taskStatusStatisticStore,
  orderingOrder: orderingOrderStore,
  grantTask: grantTaskStore,
  taskAssignGroup: taskAssignGroupStore,
  order: orderStore,
  task: taskStore,
  singleAssignConfirm: singleAssignConfirmStore,
  assignConfirm: assignConfirmStore,
  handerOver: handerOverStore,
  letterContainer: letterContainerStore,
  wattingOrder: wattingOrderStore,
  assignHandOver: assignHandOverStore,
  customerTable: customerTableStore,
  cross: crossStore,
  createPickingList: createPickingListStore,
  createContainer: createContainerStore,
  receivePickingList: receivePickingListStore,
  pickingList: pickingListStore,
  labelOrder: labelOrderStore,
  reProcessOrder: reProcessOrderStore,
  mutiOrder: MutiOrderStore,
  myTask: myTaskStore,
  detailOrder: detailOrderStore,
  uploadOrder: uploadOrderStore,
  detailcross: detailcrossStore,
  detailContainer: detailContainer,
  crossTable: crossTableStore,
  handerOverDetail: handerOverDetail,
  staffSearch: staffSearch,
  ordersStatisticsByDate: ordersStatisticsByDateStore,
  TaskOrder: TaskOrderStore,
  printTasks: printTasksStore,
  meCross: meCrossStore,
  orderStatusesProvider: orderStatusesProviderStore,
  myLabelOrder: myLabelOrderStore,
  uploadOrderByStaff: uploadOrderByStaffStore,
  groupTaskOrderStatus: groupTaskOrderStatusesProviderStore,
  usersStatisticsByDate: usersStatisticsByDateStore,
};

export {Keys, stores}
