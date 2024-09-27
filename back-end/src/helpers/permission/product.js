module.exports = {
  groupName: 'Sản phẩm',
  permissions: [
    {
      path: '/api/v1.0/employees/list',
      method: 'get',
      name: 'VIEW_LIST_PRODUCTS',
      label: 'Xem danh sách',
    },
    {
      path: '/api/v1.0/employees/add',
      method: 'post',
      name: 'ADD_PRODUCT',
      label: 'Tạo mới',
    },
    {
      path: '/api/v1.0/employees/detail/*',
      method: 'get',
      name: 'VIEW_PRODUCT_DETAIL',
      label: 'Xem chi tiết',
    },
    {
      path: '/api/v1.0/employees/*',
      method: 'put',
      name: 'EDIT_PRODUCT',
      label: 'Chỉnh sửa',
    },
    {
      path: '/api/v1.0/employees/detail/*',
      method: 'delete',
      name: 'DELETE_PRODUCT',
      label: 'Xóa',
    },
    {
      path: '/api/v1.0/employees/detail/*',
      method: 'get',
      name: 'SEARCH_PRODUCT',
      label: 'Tìm kiếm',
    },
  ],
};
