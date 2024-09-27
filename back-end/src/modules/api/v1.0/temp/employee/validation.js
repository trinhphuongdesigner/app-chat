const yup = require('yup');
const { ObjectId } = require('mongodb');
const { REGEX } = require('../../../../../constants');

module.exports = {
  createEmployeeSchema: yup.object({
    body: yup.object({
      firstName: yup
        .string()
        .required('Tên khách hàng không được để trống')
        .max(50, 'Tên khách hàng không vượt quá 50 ký tự'),
      lastName: yup
        .string()
        .required('Họ khách hàng không được để trống')
        .max(50, 'Họ khách hàng không vượt quá 50 ký tự'),
      email: yup
        .string()
        .required('Email: bắt buộc điền')
        .test('email type', 'Email: không hợp lệ', (value) => {
          const emailRegex = REGEX.MAIL;
          return emailRegex.test(value);
        }),
      password: yup
        .string()
        .required('Mật khẩu không được để trống')
        .test('password type', 'Mật khẩu: giá trị không hợp lệ', (value) => {
          const passwordRegex = REGEX.PASSWORD;
          return passwordRegex.test(value);
        })
        .min(8)
        .max(20),
      birthday: yup
        .date()
        .test(
          'birthDay type',
          'Ngày sinh: không thấp hơn ngày hiện tại',
          (value) => {
            if (value) {
              const currentDate = new Date();
              const selectedDate = new Date(value);
              return selectedDate <= currentDate;
            }
            return true;
          },
        ),
      phoneNumber: yup
        .string()
        .required('Số điện thoại bắt buộc điền')
        .test('phoneNumber type', 'Số diện thoại không hợp lệ', (value) => {
          const phoneRegex = REGEX.PHONE;
          return phoneRegex.test(value);
        }),
      // avatarId: yup
      //   .string()
      //   .test('inValid', 'avatarId sai định dạng', (value) => {
      //     if (value) {
      //       return ObjectId.isValid(value);
      //     }
      //     return true;
      //   }),
      address: yup
        .string()
        .required('Đại chỉ bắt buộc điền')
        .max(500, 'Địa chỉ không được vượt quá 500 ký tự'),
      roleId: yup.string().test('inValid', 'roleId sai định dạng', (value) => {
        if (value) {
          return ObjectId.isValid(value);
        }
        return true;
      }),
    }),
  }),

  updateEmployeeProfileSchema: yup.object({
    body: yup.object({
      firstName: yup
        .string()
        .required('Tên khách hàng không được để trống')
        .max(50, 'Tên khách hàng không vượt quá 50 ký tự'),
      lastName: yup
        .string()
        .required('Họ khách hàng bắt buộc điền')
        .max(50, 'Họ khách hàng không vượt quá 50 ký tự'),
      email: yup
        .string()
        .required('Email: bắt buộc điền')
        .test('email type', 'Email: không hợp lệ', (value) => {
          const emailRegex = REGEX.MAIL;
          return emailRegex.test(value);
        }),
      birthday: yup
        .date()
        .test(
          'birthDay type',
          'Ngày sinh: không thấp hơn ngày hiện tại',
          (value) => {
            if (value) {
              const currentDate = new Date();
              const selectedDate = new Date(value);
              return selectedDate >= currentDate;
            }
            return true;
          },
        ),
      phoneNumber: yup
        .string()
        .required('Số điện thoại bắt buộc điền')
        .test('phoneNumber type', 'Số điện thoại: không hợp lệ', (value) => {
          const phoneRegex = REGEX.PHONE;
          return phoneRegex.test(value);
        }),
      address: yup.string().max(500, 'Địa chỉ không vượt qua 500 ký tự'),
      roleId: yup.string().test('inValid', 'roleId sai định dạng', (value) => {
        if (value) {
          return ObjectId.isValid(value);
        }
        return true;
      }),
    }),
  }),

  searchEmployeeSchema: yup.object({
    query: yup.object({
      keyword: yup.string().max(500, 'Từ khóa không vượt quá 500 ký tự'),
      page: yup.number(),
      pageSize: yup.number(),
    }),
  }),

  changePasswordEmployeeSchema: yup.object({
    body: yup.object({
      oldPassword: yup
        .string()
        .required('Mật khẩu cũ: không được để trống')
        .test('password type', 'Mật khẩu cũ: không hợp lệ', (value) => {
          const passwordRegex = REGEX.PASSWORD;

          return passwordRegex.test(value);
        })
        .min(8)
        .max(20),
      newPassword: yup
        .string()
        .required('Mật khẩu mới: không được để trống')
        .test('password type', 'Mật khẩu mới: không hợp lệ', (value) => {
          const passwordRegex = REGEX.PASSWORD;

          return passwordRegex.test(value);
        })
        .min(8)
        .max(20),
      confirmPassword: yup
        .string()
        .required('Xác nhận mật khẩu: không được để trống')
        .test('password type', 'Xác nhận mật khẩu: không hợp lệ', (value) => {
          const passwordRegex = REGEX.PASSWORD;

          return passwordRegex.test(value);
        })
        .min(8)
        .max(20),
    }),
  }),

  resetPasswordEmployeeSchema: yup.object({
    body: yup.object({
      password: yup
        .string()
        .required('Mật khẩu mới: không bỏ trống')
        .test('password type', 'Mật khẩu mới: không hợp lệ', (value) => {
          const passwordRegex = REGEX.PASSWORD;
          return passwordRegex.test(value);
        })
        .min(8)
        .max(20),
    }),
  }),
};
