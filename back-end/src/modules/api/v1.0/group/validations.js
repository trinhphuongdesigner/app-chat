/* eslint-disable no-template-curly-in-string */
const yup = require('yup');
const { REGEX } = require('../../../../constants');


module.exports = {
  updateUserSchema: yup.object({
    body: yup.object({
      firstName: yup.string().required().max(50, 'Họ được vượt quá 50 ký tự'),

      lastName: yup.string().required().max(50, 'Tên được vượt quá 50 ký tự'),

      email: yup.string()
        .required()
        .email()
        .test('email type', '${path} Không phải email hợp lệ', value => REGEX.MAIL.test(value)),

      phoneNumber: yup.string()
        .required()
        .test('phoneNumber type', '${path} Không phải số điện thoại hợp lệ', value => REGEX.PHONE.test(value)),

      password: yup
        .string()
        .required('Mật khẩu mới: không được để trống')
        .test('password type', 'Mật khẩu mới: không hợp lệ', (value) => {
          const passwordRegex = REGEX.PASSWORD;

          return passwordRegex.test(value);
        })
        .min(8)
        .max(20),
    }),
  }),

  updatePasswordSchema: yup.object({
    body: yup.object({
      password: yup
        .string()
        .required('Mật khẩu mới: không được để trống')
        .test('password type', 'Mật khẩu mới: không hợp lệ', value => REGEX.PASSWORD.test(value))
        .min(8)
        .max(20),

      newPassword: yup
        .string()
        .required('Mật khẩu mới: không được để trống')
        .test('password type', 'Mật khẩu mới: không hợp lệ', value => REGEX.PASSWORD.test(value))
        .min(8)
        .max(20),
    }),
  }),
};
