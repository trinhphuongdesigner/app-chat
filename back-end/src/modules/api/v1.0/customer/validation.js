const yup = require('yup');
const { ObjectId } = require('mongodb');

module.exports = {
  createCustomerSchema: yup.object({
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
        .required('Email không được để trống')
        .test('email type', 'Email không hợp lệ', (value) => {
          // eslint-disable-next-line no-useless-escape
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        }),
      password: yup
        .string()
        .required('Mật khẩu không được để trống')
        .test('password type', 'Mật khẩu không hợp lệ', (value) => {
          const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

          return passwordRegex.test(value);
        })
        .min(8)
        .max(20),
      confirmPassword: yup
        .string()
        .required('Xác nhận mật khẩu không được để trống')
        .test(
          'confirmPassword type',
          'Xác nhận mật khẩu: giá trị không hợp lệ',
          (value) => {
            const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

            return passwordRegex.test(value);
          },
        )
        .min(8)
        .max(20),
      birthday: yup.date(),
      phoneNumber: yup
        .string()
        .required('Số điện thoại bắt buộc điền')
        .test('phoneNumber type', 'Số điện thoại không hợp lệ', (value) => {
          const phoneRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
          return phoneRegex.test(value);
        }),
      avatarId: yup
        .string()
        .test('inValid', 'avatarId sai định dạng', (value) => {
          if (value) {
            return ObjectId.isValid(value);
          }
          return true;
        }),
      address: yup
        .string()
        .required('Địa chỉ bắt buộc điền')
        .max(500, 'Địa chỉ không được vượt quá 500 ký tự'),
    }),
  }),

  editProfileCustomerSchema: yup.object({
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
        .required('Email bắt buộc điền')
        .test('email type', 'Email không hợp lệ', (value) => {
          // eslint-disable-next-line no-useless-escape
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        }),
      birthday: yup.date(),
      phoneNumber: yup
        .string()
        .required('Số điện thoại bắt buộc điền')
        .test('phoneNumber type', 'Số điện thoại không hợp lệ', (value) => {
          const phoneRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
          return phoneRegex.test(value);
        }),
      address: yup.string().max(500, 'Địa chỉ không được vượt quá 500 ký tự'),
    }),
  }),

  passwordCustomerSchema: yup.object({
    body: yup.object({
      oldPassword: yup
        .string()
        .required('Mật khẩu hiện tại không được để trống')
        .test('password type', 'Mật khẩu không hợp lệ', (value) => {
          const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

          return passwordRegex.test(value);
        })
        .min(8)
        .max(20),
      newPassword: yup
        .string()
        .required('Mật khẩu mới không được để trống')
        .test('password type', 'Mật khẩu không hợp lệ', (value) => {
          const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

          return passwordRegex.test(value);
        })
        .min(8)
        .max(20),
      confirmPassword: yup
        .string()
        .required('Xác nhận mật khẩu không được để trống')
        .test('password type', 'Mật khẩu xác nhận không hợp lệ', (value) => {
          const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

          return passwordRegex.test(value);
        })
        .min(8)
        .max(20),
    }),
  }),
};
