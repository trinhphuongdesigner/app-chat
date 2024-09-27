module.exports = {
  groupName: 'Danh mục',
  permissions: [
    {
      path: '/api/v1.0/employees/list',
      method: 'get',
      name: 'VIEW_LIST_CATEGORIES',
      label: 'Xem danh sách',
    },
    {
      path: '/api/v1.0/employees/add',
      method: 'post',
      name: 'ADD_CATEGORY',
      label: 'Tạo mới',
    },
    {
      path: '/api/v1.0/employees/detail/*',
      method: 'get',
      name: 'VIEW_CATEGORY_DETAIL',
      label: 'Xem chi tiết',
    },
    {
      path: '/api/v1.0/employees/*',
      method: 'put',
      name: 'EDIT_CATEGORY',
      label: 'Chỉnh sửa',
    },
    {
      path: '/api/v1.0/employees/detail/*',
      method: 'delete',
      name: 'DELETE_CATEGORY',
      label: 'Xóa',
    },
    {
      path: '/api/v1.0/employees/reset-password',
      method: 'put',
      name: 'SEARCH_CATEGORY',
      label: 'Tìm kiếm',
    },
  ],
};
