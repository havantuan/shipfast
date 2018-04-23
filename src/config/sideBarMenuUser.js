const sideBarMenuUserConfig = {
    manager: {},

    accountant: {
        item_2: {
            title: 'Tạo đơn hàng',
            url: '/order',
            icon: "plus-circle-o",
            key: 'item_2',
        },
        item_3: {
            title: 'Đơn hàng',
            url: '',
            icon: "profile",
            key: 'item_3',
            isCollapsed: false,
        },
        item_4: {
            title: 'Kho hàng',
            url: '/inventory',
            icon: "book",
            key: 'item_4',
        },
        item_1: {
            title: 'Điểm gửi hàng',
            url: '/map',
            icon: "shop",
            key: 'item_1',
        },
        item_6: {
            title: 'Đối soát',
            url: '/customerDebt',
            icon: "profile",
            key: 'item_6',
        },
    },

    system: {}
};

export default sideBarMenuUserConfig;