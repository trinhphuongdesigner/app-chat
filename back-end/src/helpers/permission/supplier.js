module.exports = {
  groupName: 'Nhà cung cấp',
  permissions: [
    {
      path: '/api/v1.0/employees/list',
      method: 'get',
      name: 'VIEW_LIST_SUPPLIERS',
      label: 'Xem danh sách',
    },
    {
      path: '/api/v1.0/employees/add',
      method: 'post',
      name: 'ADD_SUPPLIER',
      label: 'Tạo mới',
    },
    {
      path: '/api/v1.0/employees/detail/*',
      method: 'get',
      name: 'VIEW_SUPPLIER_DETAIL',
      label: 'Xem chi tiết',
    },
    {
      path: '/api/v1.0/employees/*',
      method: 'put',
      name: 'EDIT_SUPPLIER',
      label: 'Chỉnh sửa',
    },
    {
      path: '/api/v1.0/employees/detail/*',
      method: 'delete',
      name: 'DELETE_SUPPLIER',
      label: 'Xóa',
    },
    {
      path: '/api/v1.0/employees/detail/*',
      method: 'get',
      name: 'SEARCH_SUPPLIER',
      label: 'Tìm kiếm',
    },
  ],
};
