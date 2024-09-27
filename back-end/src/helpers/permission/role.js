module.exports = {
  groupName: 'Phân quyền',
  permissions: [
    {
      path: '/api/v1.0/roles/create',
      method: 'post',
      name: 'CREATE_ROLE',
      label: 'Tạo mới',
    },
    {
      path: '/api/v1.0/roles/list',
      method: 'get',
      name: 'VIEW_LIST_ROLES',
      label: 'Xem danh sách',
    },

    {
      path: '/api/v1.0/roles/detail/*',
      method: 'get',
      name: 'VIEW_ROLE_DETAIL',
      label: 'Xem chi tiết',
    },
    {
      path: '/api/v1.0/roles/edit/*',
      method: 'put',
      name: 'EDIT_ROLE',
      label: 'Chỉnh sửa',
    },
    {
      path: '/api/v1.0/roles/detail/*',
      method: 'delete',
      name: 'DELETE_OR_RESTORE_ROLE',
      label: 'Xóa hoặc khôi phục',
    },
  ],
};
