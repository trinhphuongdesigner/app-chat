const yup = require('yup');
const { ObjectId } = require('mongodb');

module.exports = {
  mediaProductSchema: yup.object().shape({
    coverImage: yup.mixed(),
    imageIds: yup
      .array()
      .of(
        yup
          .string()
          .test('inValid', 'ID sai định dạng', value => ObjectId.isValid(value)),
      ),
    imageFiles: yup.array().of(yup.mixed()),
  }),

  productSchema: yup.object({
    body: yup.object({
      name: yup
        .string()
        .required('Tên sản phẩm: không được để trống')
        .max(100, 'Tên sản phẩm: không vượt quá 100 ký tự'),
      price: yup
        .number()
        .required('Giá sản phẩm: bắt buộc điền')
        .min(0, 'Giá sản phẩm: không thấp hơn 0'),
      discount: yup
        .number()
        .min(0, 'Giảm giá sản phẩm: không thấp hơn 0')
        .max(100, 'Giảm giá sản phẩm: không vượt quá 100%'),
      stock: yup.number().min(0, 'Tồn kho: không thấp hơn 0'),
      description: yup
        .string()
        .max(500, 'Mô tả sản phẩm: không vượt quá 00 ký tự'),
      categoryId: yup
        .string()
        .test('Validate ObjectID', 'categoryId: không hợp lệ', (value) => {
          if (!value) return true;
          return ObjectId.isValid(value);
        }),
      supplierId: yup
        .string()
        .test('Validate ObjectID', 'supplierId: không hợp lệ', (value) => {
          if (!value) return true;
          return ObjectId.isValid(value);
        }),
    }),
  }),

  createProductListSchema: yup.object({
    body: yup.object({
      productList: yup.array().of(
        yup.object().shape({
          name: yup
            .string()
            .required('Tên sản phẩm: không được để trống')
            .max(100, 'Tên sản phẩm: không vượt quá 100 ký tự'),
          price: yup
            .number()
            .required('Giá sản phẩm: bắt buộc điền')
            .min(0, 'Giá sản phẩm: không thấp hơn 0'),
          discount: yup
            .number()
            .min(0, 'Giảm giá sản phẩm: không thấp hơn 0')
            .max(100, 'Giảm giá sản phẩm: không vượt quá 100%'),
          stock: yup.number().min(0, 'Tồn kho: không thấp hơn 0'),
          description: yup
            .string()
            .max(500, 'Mô tả sản phẩm: không vượt quá 00 ký tự'),
          categoryId: yup
            .string()
            .test('Validate ObjectID', 'categoryId: không hợp lệ', (value) => {
              if (!value) return true;
              return ObjectId.isValid(value);
            }),
          supplierId: yup
            .string()
            .test('Validate ObjectID', 'supplierId: không hợp lệ', (value) => {
              if (!value) return true;
              return ObjectId.isValid(value);
            }),
          imageIds: yup.array().of(
            yup
              .string()
              .test('Validate ObjectID', 'imageIds: không hợp lệ', (value) => {
                if (!value) return true;
                return ObjectId.isValid(value);
              }),
          ),
          coverImageId: yup
            .string()
            .test(
              'Validate ObjectID',
              'coverImageId: không hợp lệ',
              (value) => {
                if (!value) return true;
                return ObjectId.isValid(value);
              },
            ),
        }),
      ),
    }),
  }),

  searchProductSchema: yup.object({
    query: yup.object({
      page: yup.number(),
      pageSize: yup.number(),
      keyword: yup.string(),
      discountStart: yup
        .number()
        .min(0)
        .max(100)
        .test('discountStart: không hợp lệ', (value, context) => {
          if (!value || !context.parent.discountEnd) return true; // Không điền giá kết thúc

          if (context.parent.discountEnd) {
            return value < context.parent.discountEnd;
            // Giá kết thúc phải lớn hơn giá bắt đầu (nếu có)
          }
        }),
      discountEnd: yup
        .number()
        .min(0)
        .max(100)
        .test('discountEnd: is not valid', (value, context) => {
          if (!value || !context.parent.discountStart) return true; // Không điền giá kết thúc

          if (context.parent.discountStart) {
            return value > context.parent.discountStart;
            // Giá kết thúc phải lớn hơn giá bắt đầu (nếu có)
          }
        }),
      priceStart: yup
        .number()
        .min(0)
        .test('priceStart: không hợp lệ', (value, context) => {
          if (!value || !context.parent.priceEnd) return true; // Không điền giá bắt đầu

          if (context.parent.priceEnd) {
            return value < context.parent.priceEnd;
            // Giá kết thúc phải lớn hơn giá bắt đầu (nếu có)
          }
        }),
      priceEnd: yup
        .number()
        .min(0)
        .test('priceEnd: không hợp lệ', (value, context) => {
          if (!value || !context.parent.priceStart) return true; // Không điền giá kết thúc

          if (context.parent.priceStart) {
            return value > context.parent.priceStart;
            // Giá kết thúc phải lớn hơn giá bắt đầu (nếu có)
          }
        }),
      categoryId: yup
        .string()
        .test('Validate ObjectID', 'categoryId: không hợp lệ', (value) => {
          if (!value) return true;
          return ObjectId.isValid(value);
        }),
      supplierId: yup
        .string()
        .test('Validate ObjectID', 'supplierId: không hợp lệ', (value) => {
          if (!value) return true;
          return ObjectId.isValid(value);
        }),
    }),
  }),
};
