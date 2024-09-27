module.exports = {
  groupName: 'Đơn hàng',
  permissions: [
    {
      path: '/api/v1.0/employees/list',
      method: 'get',
      name: 'VIEW_LIST_ORDERS',
      label: 'Xem danh sách',
    },
    {
      path: '/api/v1.0/employees/add',
      method: 'post',
      name: 'ADD_ORDER',
      label: 'Tạo mới',
    },
    {
      path: '/api/v1.0/employees/detail/*',
      method: 'get',
      name: 'VIEW_ORDER_DETAIL',
      label: 'Xem chi tiết',
    },
    {
      path: '/api/v1.0/employees/*',
      method: 'put',
      name: 'EDIT_ORDER',
      label: 'Chỉnh sửa',
    },
    {
      path: '/api/v1.0/employees/detail/*',
      method: 'delete',
      name: 'DELETE_ORDER',
      label: 'Xóa',
    },
    {
      path: '/api/v1.0/employees/detail/*',
      method: 'get',
      name: 'SEARCH_ORDER',
      label: 'Tìm kiếm',
    },
  ],
};
