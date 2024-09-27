const yup = require('yup');

module.exports = {
  imageSchema: yup.object().shape({
    image: yup.mixed(),
  }),

  imagesSchema: yup.object().shape({
    images: yup
      .array()
      .of(yup.mixed())
      .min(1, 'Ít nhất phải có một hình ảnh')
      .max(8, 'Tối đa chỉ được phép tải lên 8 hình ảnh'),
  }),

  mediaSchema: yup.object({
    body: yup.object({
      name: yup
        .string()
        .required('Tên danh mục không được để trống')
        .max(100, 'Tên danh mục không được vượt quá 100 kí tự'),
    }),
  }),
};
