// import {store} from "../redux/store";
import permissions from './permissions';
import roles from './roles';
import ObjectPath from "object-path";
import meStore from '../stores/meStore';

class Permission {
  // check permission and role utilities

  getUserPermission() {
    // console.log('%c permission', 'background: #00b33c; color: #fff;', meStore.current.Permissions);
    return ObjectPath.get(meStore, 'current.Permissions', []);

    // let data = store.getState().getMe.get('data');
    // return ObjectPath.get(data, "Me.Permissions", []);

    // return JSON.parse(localStorage.getItem('Permissions'));
  }

  getUserRoles() {
    return meStore.current.Roles;
  }

  allowPermission(neededPermission) {
    return this.getUserPermission().indexOf(neededPermission) >= 0;
  }

  allowRole(neededRole) {
    return this.getUserRoles().indexOf(neededRole) >= 0;
  }

  allowHub() {
    return this.allowRole(roles.hub);
  }

  allowManager() {
    return this.allowRole(roles.manager);
  }

  allowAccountant() {
    return this.allowRole(roles.accountant);
  }

  allowShipper() {
    return this.allowRole(roles.shipper);
  }

  allowCreateUser() {
    return this.allowPermission(permissions.createUser);
  }

  allowDeleteUser() {
    return this.allowPermission(permissions.deleteUser);
  }

  allowReadUser() {
    return this.allowPermission(permissions.readUser);
  }

  allowUpdateUser() {
    return this.allowPermission(permissions.updateUser);
  }

  allowGrantPermissionRole() {
    return this.allowPermission(permissions.grantPermissionRole);
  }

  allowReadStaff() {
    return this.allowPermission(permissions.readStaff);
  }

  allowCreateStaff() {
    return this.allowPermission(permissions.createStaff);
  }

  allowUpdateStaff() {
    return this.allowPermission(permissions.updateStaff);
  }

  allowGrantHubStaff() {
    return this.allowPermission(permissions.grantHubStaff);
  }

  allowGrantRoleStaff() {
    return this.allowPermission(permissions.grantRoleStaff);
  }

  allowAssignTaskStaff() {
    return this.allowPermission(permissions.assignTaskStaff);
  }

  allowUpdateStateStaff() {
    return this.allowPermission(permissions.updateStateStaff);
  }

  allowCreateHub() {
    return this.allowPermission(permissions.createHub);
  }

  allowUpdateHub() {
    return this.allowPermission(permissions.updateHub);
  }

  allowGrantRouteHub() {
    return this.allowPermission(permissions.grantRouteHub);
  }

  allowUpdateStateHub() {
    return this.allowPermission(permissions.updateStateHub);
  }

  allowCreateRoute() {
    return this.allowPermission(permissions.createRoute);
  }

  allowReadRoute() {
    return this.allowPermission(permissions.readRoute);
  }

  allowUpdateRoute() {
    return this.allowPermission(permissions.updateRoute);
  }

  allowReadTask() {
    return this.allowPermission(permissions.readTask);
  }

  allowUpdateStatusTask() {
    return this.allowPermission(permissions.updateStatusTask);
  }

  allowCreateCustomer() {
    return this.allowPermission(permissions.createCustomer);
  }

  allowReadCustomer() {
    return this.allowPermission(permissions.readCustomer);
  }

  allowUpdateCustomer() {
    return this.allowPermission(permissions.updateCustomer);
  }

  allowUpdateStateCustomer() {
    return this.allowPermission(permissions.updateStateCustomer);
  }

  allowCreateInventory() {
    return this.allowPermission(permissions.createInventory);
  }

  allowUpdateInventory() {
    return this.allowPermission(permissions.updateInventory);
  }

  allowReadInventory() {
    return this.allowPermission(permissions.readInventory);
  }

  allowConfigSystem() {
    return this.allowPermission(permissions.configSystem);
  }

  allowCreateOrder() {
    return this.allowPermission(permissions.createOrder);
  }

  allowUpdateOrder() {
    return this.allowPermission(permissions.updateOrder);
  }

  allowDeleteOrder() {
    return this.allowPermission(permissions.deleteOrder);
  }

  allowReadOrder() {
    return this.allowPermission(permissions.readOrder);
  }

  allowRePickupOrder() {
    return this.allowPermission(permissions.rePickupOrder);
  }

  allowReDeliverOrder() {
    return this.allowPermission(permissions.reDeliverOrder);
  }

  allowHandOverOrder() {
    return this.allowPermission(permissions.handOverOrder);
  }

  allowReturnOrder() {
    return this.allowPermission(permissions.returnOrder);
  }

  allowUpdateStatusOrder() {
    return this.allowPermission(permissions.updateStatusOrder);
  }

  allowAssignHubOrder() {
    return this.allowPermission(permissions.assignHubOrder);
  }

  allowReadPickingList() {
    return this.allowPermission(permissions.readPickingList);
  }

  allowCreatePickingList() {
    return this.allowPermission(permissions.createPickingList);
  }

  allowReceivePickingList() {
    return this.allowPermission(permissions.receivePickingList);
  }

  allowReadContainer() {
    return this.allowPermission(permissions.readContainer);
  }

  allowCreateContainer() {
    return this.allowPermission(permissions.createContainer);
  }

  allowReceiveContainer() {
    return this.allowPermission(permissions.receiveContainer);
  }

  allowCreateDiscount() {
    return this.allowPermission(permissions.createDiscount);
  }

  allowUpdateDiscount() {
    return this.allowPermission(permissions.updateDiscount);
  }

  allowUpdateNotification() {
    return this.allowPermission(permissions.updateNotification);
  }

  allowViewCustomerCross() {
    return this.allowPermission(permissions.viewCustomerCross);
  }

  allowUpdateCustomerCross() {
    return this.allowPermission(permissions.updateCustomerCross);
  }

  allowCreateCustomerCross() {
    return this.allowPermission(permissions.createCustomerCross);
  }
  allRejectOrder() {
    return this.allowPermission(permissions.rejectOrder)
  }
}

export default new Permission()