const yup = require('yup');

module.exports = {

  supplierSchema: yup.object({
    body: yup.object({
      name: yup
        .string()
        .required('Tên nhà cung cấp không được để trống')
        .max(100, 'Tên nhà cung cấp không vượt quá 100 ký tự'),
      email: yup
        .string()
        .required('Email không được để trống')
        .test('email type', 'Email không hợp lệ', (value) => {
          // eslint-disable-next-line no-useless-escape
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        }),
      phoneNumber: yup
        .string()
        .required('Số điện thoại bắt buộc điền')
        .test('phoneNumber type', 'Số điện thoại không hợp lệ', (value) => {
          const phoneRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
          return phoneRegex.test(value);
        }),

      address: yup
        .string()
        .max(500, 'Địa chỉ không được vượt quá 500 ký tự'),
    }),
  }),
};
