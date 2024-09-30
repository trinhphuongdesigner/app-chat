/* eslint-disable no-useless-escape */
/* eslint-disable no-template-curly-in-string */
const yup = require('yup');
const { REGEX } = require('../../../../constants');

module.exports = {
  registerSchema: yup.object({
    body: yup.object({
      firstName: yup.string().required().max(50, 'Họ được vượt quá 50 ký tự'),

      lastName: yup.string().required().max(50, 'Tên được vượt quá 50 ký tự'),

      email: yup.string()
        .required()
        .email()
        .test('email type', '${path} Không phải email hợp lệ', (value) => {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

          return emailRegex.test(value);
        }),

      phoneNumber: yup.string()
        .required()
        .test('phoneNumber type', '${path} Không phải số điện thoại hợp lệ', (value) => {
          const phoneRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;

          return phoneRegex.test(value);
        }),

      // birthday: yup
      //   .date()
      //   .test(
      //     'birthDay type',
      //     'Người dùng chưa ra đời',
      //     (value) => {
      //       if (value) {
      //         const today = new Date();
      //         const selectedDate = new Date(value);
      //         return selectedDate <= today;
      //       }
      //       return true;
      //     },
      //   ),

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

  loginSchema: yup.object({
    body: yup.object({
      email: yup.string()
        .required()
        .email()
        .test('email type', '${path} Không phải email hợp lệ', (value) => {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

          return emailRegex.test(value);
        }),

      password: yup.string()
        .required()
        .min(8, 'Không được ít hơn 8 ký tự')
        .max(20, 'Không được vượt quá 20 ký tự'),
    }),
  }),
};
