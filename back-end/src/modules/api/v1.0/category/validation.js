const yup = require('yup');

module.exports = {
  coverImageSchema: yup.object().shape({
    coverImage: yup.mixed(),
  }),

  categorySchema: yup.object({
    body: yup.object({
      name: yup
        .string()
        .required('Tên danh mục không được để trống')
        .max(100, 'Tên danh mục không được vượt quá 100 kí tự'),
      description: yup
        .string()
        .max(500, 'Mô tả danh mục không được vượt quá 500 kí tự'),
    }),
  }),
};
