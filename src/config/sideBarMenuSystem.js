import permissions from "../permissions/permissions";

const sideBarMenuConfig = {
  manager: {},
  accountant: {
    item_1: {
      title: 'Danh sách tuyến',
      url: '/route',
      icon: "swap",
      key: 'item_1',
      permission: permissions.readRoute
    },
    item_2: {
      title: 'Nhân viên',
      url: '/staff',
      icon: "user",
      key: '2',
      permission: permissions.readStaff
    },
    item_3: {
      title: 'Khuyến mại',
      url: '/discount',
      icon: "star-o",
      key: 'item_3',
    },
    item_4: {
      title: 'Vai trò',
      url: '/role',
      icon: "tags-o",
      key: 'item_4',
      permission: permissions.grantPermissionRole
    },
    item_5: {
      title: 'Điểm gửi hàng',
      url: '/hub',
      icon: "shop",
      key: 'item_5',
      permission: permissions.updateStateHub
    },
    item_6: {
      title: 'Thông báo',
      url: '/notification',
      icon: "notification",
      key: 'item_6'
    },
  },
  system: {}
};

export default sideBarMenuConfig;