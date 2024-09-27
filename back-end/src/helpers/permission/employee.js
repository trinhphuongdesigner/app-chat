module.exports = {
  groupName: 'Nhân viên',
  permissions: [

    {
      path: '/api/v1.0/employees/list',
      method: 'get',
      name: 'VIEW_LIST_EMPLOYEES',
      label: 'Xem danh sách',
    },
    {
      path: '/api/v1.0/employees/add',
      method: 'post',
      name: 'ADD_EMPLOYEE',
      label: 'Tạo mới',
    },
    {
      path: '/api/v1.0/employees/detail/*',
      method: 'get',
      name: 'VIEW_EMPLOYEE_DETAIL',
      label: 'Xem chi tiết',
    },
    // {
    //   path: '/api/v1.0/employees/*',
    //   method: 'put',
    //   name: 'EDIT_EMPLOYEE',
    //   label: 'Chỉnh sửa',
    // },
    {
      path: '/api/v1.0/employees/detail/*',
      method: 'delete',
      name: 'DELETE_EMPLOYEE',
      label: 'Xóa',
    },
    {
      path: '/api/v1.0/employees/role/*',
      method: 'put',
      name: 'EDIT_ROLE_EMPLOYEE',
      label: 'Phân quyền',
    },
    {
      path: '/api/v1.0/employees/reset-password',
      method: 'put',
      name: 'RESET_PASSWORD_EMPLOYEE',
      label: 'Cấp lại mật khẩu',
    },
  ],
};
