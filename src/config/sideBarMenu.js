import permissions from "../permissions/permissions";

const sideBarMenuConfig = {
  manager: {},

  accountant: {
    group_0: {
      title: 'Trang chủ',
      key: 'group_0',
      icon: 'dashboard',
      url: '',
      isShowAllHubs: true
    },
    group_1: {
      title: 'Khai thác',
      key: 'group_1',
      icon: "shopping-cart",
      submenu: {
        item_1: {
          title: 'Duyệt đơn',
          url: '/ordering',
          icon: "ion-checkmark",
          key: 'item_1',
          permission: permissions.assignHubOrder,
          countName: 'WaitingProduct'
        },
        item_2: {
          title: 'Giao việc',
          url: '/task',
          icon: "ion-compose",
          key: 'item_2',
          permission: permissions.assignTaskStaff,
        },
        item_3: {
          title: 'Bàn giao',
          url: '/task/update',
          icon: "ion-shuffle",
          key: 'item_3',
          permission: permissions.handOverOrder,
          countName: 'HandOver'
        },
        item_4: {
          title: 'Nhập doanh thu',
          url: '/revenue',
          icon: "ion-ios-pie",
          key: 'item_4',
          permission: permissions.createOrder
        },
      }
    },
    group_2: {
      title: 'Điểm gửi hàng',
      key: 'group_2',
      icon: "file-text",
      isShowAllHubs: true,
      submenu: {
        item_1: {
          title: 'Tạo bảng kê đi',
          url: '/hub/load/create',
          icon: "ion-log-out",
          key: 'item_1',
          permission: permissions.createPickingList
        },
        item_2: {
          title: 'Bảng kê',
          url: '/hub/load',
          icon: "ion-cube",
          key: 'item_2',
          permission: permissions.readPickingList,
          isShowAllHubs: true,
        },
        item_3: {
          title: 'Nhận bảng kê',
          url: '/hub/container/receive',
          icon: "ion-pin",
          key: 'item_3',
          permission: permissions.receivePickingList,
          countName: 'PickingLists'
        },
        item_354: {
          title: 'Chờ đóng bảng kê',
          url: '/order-watting',
          icon: "ion-aperture",
          key: 'item_4',
          permission: permissions.readPickingList,
          isShowAllHubs: true,
          countName: 'WaitingForPickingListCreating'
        },
        item_5: {
          title: 'Chuyến thư',
          url: '/container',
          icon: "ion-android-bus",
          key: 'item_5',
          permission: permissions.readContainer,
          isShowAllHubs: true,
        },
      }
    },

    group_3: {
      title: 'Cần xác nhận',
      key: 'group_3',
      icon: "clock-circle-o",
      url: '/orders/confirmation',
      countName: 'OrdersConfirmation'
    },

    group_4: {
      title: 'Xử lý khiếu nại',
      key: 'group_4',
      icon: "exclamation-circle-o",
      url: '/orders/complaint',
      countName: 'OrdersComplaint'
    },

    group_5: {
      title: 'Danh sách',
      key: 'group_5',
      icon: "profile",
      isShowAllHubs: true,
      submenu: {
        item_1: {
          title: 'Công việc của tôi',
          url: '/my-tasks',
          icon: "ion-briefcase",
          key: 'item_1',
          isShowAllHubs: true,
        },
        item_2: {
          title: 'Đơn hàng',
          url: '/listorder',
          icon: "ion-android-list",
          key: 'item_2',
          permission: permissions.readOrder,
          isShowAllHubs: true,
        },
        item_3: {
          title: 'Công việc',
          url: '/task/list',
          icon: "ion-android-alarm-clock",
          key: 'item_3',
          permission: permissions.readTask,
          isShowAllHubs: true,
        },
        item_4: {
          title: 'Danh sách giao việc',
          url: '/task-assign/list',
          icon: "ion-clipboard",
          key: 'item_4',
          permission: permissions.assignTaskStaff,
          isShowAllHubs: true,
        },
        item_5: {
          title: 'Danh sách bàn giao',
          url: '/handerover/list',
          icon: "ion-xbox",
          key: 'item_5',
          permission: permissions.handOverOrder,
          isShowAllHubs: true,
        },
        item_6: {
          title: 'Điểm gửi hàng',
          url: '/hub',
          icon: "ion-ios-home-outline",
          key: 'item_6',
          isShowAllHubs: true,
        },
        item_7: {
          title: 'Khách hàng',
          url: '/seller',
          icon: "ion-android-contacts",
          key: 'item_7',
          permissions: permissions.readCustomer,
          isShowAllHubs: true,
        },
        item_9: {
          title: 'Khuyến mãi',
          // title: 'Mạng lưới điểm gửi hàng',
          url: '/discount',
          icon: "ion-star",
          key: 'item_9',
        },
        item_8: {
          title: 'Bản đồ',
          // title: 'Mạng lưới điểm gửi hàng',
          url: '/map',
          icon: "ion-android-globe",
          key: 'item_8',
          isShowAllHubs: true,
        },
      }
    },
    group_6: {
      title: 'Báo cáo',
      key: 'group_6',
      icon: "export",
      isShowAllHubs: true,
      submenu: {
        item_1: {
          title: 'Tạo đối soát',
          url: '/cross/create',
          key: 'item_1',
          permissions: permissions.createCustomerCross,
          isShowAllHubs: true,
        },
        item_2: {
          title: 'Đối soát',
          url: '/cross',
          icon: "ion-ios-flask-outline",
          key: 'item_2',
          permissions: permissions.viewCustomerCross,
          isShowAllHubs: true,
        },
        item_3: {
          title: 'Báo cáo sản lượng',
          url: '/task-order',
          key: 'item_3',
          isShowAllHubs: true,
        },
        item_4: {
          title: 'Thống kê đơn hàng',
          url: '/chart/order',
          key: 'item_4',
          isShowAllHubs: true,
        },
        item_6: {
          title: 'Thống kê người dùng',
          url: '/chart/user',
          key: 'item_6',
          isShowAllHubs: true,
        },
      }
    },
  },
  system: {}
};

export default sideBarMenuConfig;