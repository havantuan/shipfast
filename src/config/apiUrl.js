const REST_API_URL = "/api/v1";
const apiUrl = {
  LOGIN: process.env.SITE === 'KH' ? '/api/v1/oauth/token' : '/api/v1/oauth/staff/token',
  REVOKE: '/api/v1/oauth/revoke',
  CREATE_HUB_URL: `${REST_API_URL}/hub`,
  GRAPH_URL: `${REST_API_URL}/graph`,
  UPDATE_HUB_URL: `${REST_API_URL}/hub/:id`,
  IMPORT_CONFIG_URL: `${REST_API_URL}/import/config`,
  CUSTOMER_IMPORT_EXCEL_URL: `${REST_API_URL}/import/customer/order`,
  CUSTOMER_IMPORT_ORDER_JSON_URL: `${REST_API_URL}/import/customer/order/commit`,
  STAFF_IMPORT_EXCEL_URL: `${REST_API_URL}/import/staff/order`,
  STAFF_IMPORT_ORDER_JSON_URL: `${REST_API_URL}/import/staff/order/commit`,
  ACTIVE_HUB_URL: `${REST_API_URL}/hub/:id/active`,
  DEACTIVE_HUB_URL: `${REST_API_URL}/hub/:id/deactive`,

  UPDATE_ROLE_URL: `${REST_API_URL}/staff/:id/grant/roles`,
  GRANT_HUB_URL: `${REST_API_URL}/staff/:id/grant/hubs`,
  GRANT_ROLE_URL: `${REST_API_URL}/staff/:id/grant/roles`,
  GRANT_PERMISSION_URL: `${REST_API_URL}/role/:id/grant/permissions`,

  CREATE_STAFF_URL: `${REST_API_URL}/staff`,
  UPDATE_STAFF_URL: `${REST_API_URL}/staff/:id`,

  CREATE_ORDER_URL: `${REST_API_URL}/order/user`,
  CREATE_ORDER_URL_STAFF: `${REST_API_URL}/order/staff`,
  UPDATE_ORDER_STATUS_URL: `${REST_API_URL}/order/:code/status`,
  ASSIGN_ORDER_TO_HUB_URL: `${REST_API_URL}/order/:code/assignHub`,
  CREATE_TASK_URL: `${REST_API_URL}/order/:code/createTask`,
  UPDATE_ORDER_HUB_URL: `${REST_API_URL}/order/:code/assignHub`,
  UPDATE_ORDER_HUB_RELEASED_URL: `${REST_API_URL}/order/:code/receiverHub`,
  UPDATE_ORDER_STATUSES_URL: `${REST_API_URL}/order/statuses`,
  ASSIGN_ORDER_TO_HUBS_URL: `${REST_API_URL}/order/:code/senderAndReceiverHubs`,
  REJECT_ORDER_URL: `${REST_API_URL}/order/:code/reject`,
  CANCEL_ORDER_URL: `${REST_API_URL}/order/:code/cancel`,
  CONFIRM_RETURN_ORDER_URL: `${REST_API_URL}/order/:code/confirmReturn`,
  PERFORM_RETURN_ORDER_URL: `${REST_API_URL}/order/:code/performReturn`,
  UPDATE_SURCHARGE_URL: `${REST_API_URL}/order/:code/updateSurcharge`,
  CONFIRM_ORDER_OVER_WEIGHT_URL: `${REST_API_URL}/order/:code/overWeight`,
  PERFORM_OVER_WEIGHT_URL: `${REST_API_URL}/order/:code/performOverWeight`,
  UPDATE_ORDER_WITH_CODE_URL: `${REST_API_URL}/order/:code/user/update`,

  UPDATE_STAFF_PROFILE_URL: `${REST_API_URL}/staff/:id/profile`,
  UPDATE_STAFF_SCANNER_KEY_URL: `${REST_API_URL}/user/:id/scannerKey`,
  UPDATE_STAFF_PRIMARY_HUB_URL: `${REST_API_URL}/staff/:id/primaryHub`,
  CREATE_STAFF_FROM_USER_URL: `${REST_API_URL}/staff/createFromUserID/:id`,

  CREATE_INVENTORY_URL: `${REST_API_URL}/inventory`,
  UPDATE_INVENTORY_URL: `${REST_API_URL}/inventory/:id`,

  GRANT_TASK_URL: `${REST_API_URL}/staff/:id/task/assign`,
  REJECT_TASK_URL: `${REST_API_URL}/staff/:id/task/reject`,
  TASK_ASSIGN_CONFIRM_URL: `${REST_API_URL}/staff/:id/task/assignConfirm`,
  CONFIRM_TASK_ORDERS_URL: `${REST_API_URL}/task/:code/orders/confirm`,
  CONFIRM_TASK_URL: `${REST_API_URL}/task/:code/confirm`,
  CANCEL_TASK_URL: `${REST_API_URL}/task/:code/cancel`,
  UPDATE_ORDERS_STATUSES_IN_TASK_URL: `${REST_API_URL}/task/:code/orders/updateStatus`,

  ACTIVE_STAFF_URL: `${REST_API_URL}/staff/:id/active`,
  DEACTIVE_STAFF_URL: `${REST_API_URL}/staff/:id/deactive`,

  CREATE_USER_URL: `${REST_API_URL}/user/register`,
  CREATE_ROUTE_URL: `${REST_API_URL}/route`,
  UPDATE_ROUTE_URL: `${REST_API_URL}/route/:id`,

  FORGOT_PASSWORD_URL: `${REST_API_URL}/user/forgotPassword`,
  RESET_PASSWORD_URL: `${REST_API_URL}/user/resetPassword`,
  UPDATE_INFORMATION_URL: `${REST_API_URL}/user/updateInformation`,

  HANDOVER_CONFIRM_URL: `${REST_API_URL}/order/:id/handover`,
  UPDATE_RECEIVER_URL: `${REST_API_URL}/order/:code/updateReceiver`,

  CREATE_PICKING_LIST_URL: `${REST_API_URL}/pickingList/create`,
  CONFIRM_PICKING_LIST_ORDERS_URL: `${REST_API_URL}/pickingList/:code/orders/confirm`,
  REPORT_LOST_PICKING_LIST_ORDERS_URL: `${REST_API_URL}/pickingList/:code/orders/lost`,

  CREATE_CONTAINER_URL: `${REST_API_URL}/container/create`,
  CREATE_KEY_URL: `${REST_API_URL}/user/keys`,
  ACTIVE_API_KEY_URL: `${REST_API_URL}/user/keys/:id/active`,
  DEACTIVE_API_KEY_URL: `${REST_API_URL}/user/keys/:id/deactive`,
  DELETE_API_KEY_URL: `${REST_API_URL}/user/keys/:id`,
  UPDATE_API_KEY_URL: `${REST_API_URL}/user/keys/:accessKey`,

  CREATE_CUSTOMER_URL: `${REST_API_URL}/user/create`,
  ACTIVE_CUSTOMER_URL: `${REST_API_URL}/user/:id/activate`,
  DEACTIVE_CUSTOMER_URL: `${REST_API_URL}/user/:id/deactivate`,
  UPDATE_CUSTOMER_URL: `${REST_API_URL}/user/:id/staff/updateInformation`,

  CREATE_DISCOUNT_URL: `${REST_API_URL}/discount`,
  UPDATE_DISCOUNT_URL: `${REST_API_URL}/discount/:id`,

  CREATE_NOTIFICATION_URL: `${REST_API_URL}/notification/create`,
  CREATE_BANK_ACCOUNT_URL: `${REST_API_URL}/me/bankAccount`,
  UPDATE_BANK_ACCOUNT_URL: `${REST_API_URL}/bankAccount/:id/update`,
  ACTIVE_ACCOUNT_BANK_URL: `${REST_API_URL}/bankAccount/:id/activate`,
  DEACTIVE_ACCOUNT_BANK_URL: `${REST_API_URL}/bankAccount/:id/deactivate`,
  CREATE_CROSS_URL: `${REST_API_URL}/customerCross`,
  UPDATE_CROSS_URL: `${REST_API_URL}/customerCross/done`,
  UPDATE_CUSTOMER_CROSS_URL: `${REST_API_URL}/customerCross/:code/update`,
  EXPORT_ORDER_URL: `${REST_API_URL}/export/order`,
  EXPORT_TASK_URL: `${REST_API_URL}/export/taskOrder`,
};
export default apiUrl