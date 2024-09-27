const yup = require('yup');
const { ObjectId } = require('mongodb');
const { PAYMENT_TYPE, STATUS } = require('../../../../../constants');

const {
  CANCEL, REJECTED, FAILED, RESTOCKED, ...CREATE_STATUS
} = STATUS.VALUE;

module.exports = {
  createOrderSchema: yup.object({
    body: yup.object({
      shippedDate: yup
        .date()
        .test(
          'check date',
          'shippedDate: không thấp hơn ngày tạo và ngày hiện tại',
          (value) => {
            if (!value) return true;
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            const selectedDate = new Date(value);
            // selectedDate.setSeconds(0, 0); // Đặt giá trị giờ phút giây thành 0
            return selectedDate.getTime() >= currentDate.getTime();
          },
        ),
      paymentType: yup
        .string()
        .required('Phương thức thanh toán: không được để trống')
        .oneOf(Object.values(PAYMENT_TYPE), 'paymentType: is not valid')
        .default(PAYMENT_TYPE.CASH),
      status: yup
        .string()
        .required('Trạng thái: không được để trống')
        .oneOf(Object.values(CREATE_STATUS), 'status: không hợp lệ'),
      orderDiscount: yup.number().min(0, 'Giảm giá hóa đơn: không thấp hơn 0'),
      isDelivery: yup.boolean(),
      totalFee: yup.number(),
      address: yup.string().max(500, 'Địa chỉ: không vượt quá 500 ký tự'),
      customerId: yup
        .string()
        .test(
          'Validate ObjectID',
          'customerId: is not valid ObjectID',
          (value) => {
            if (!value) return true;
            return ObjectId.isValid(value);
          },
        ),
      employeeId: yup
        .string()
        .required('Nhân viên: không được để trống')
        .test(
          'Validate ObjectID',
          'employeeId: not valid ObjectID',
          (value) => {
            if (!value) return true;
            return ObjectId.isValid(value);
          },
        ),
      orderDetail: yup.array().of(
        yup.object().shape({
          productId: yup
            .string()
            .test(
              'Validate ObjectID',
              'productId: not valid ObjectID',
              (value) => {
                if (!value) return true;
                return ObjectId.isValid(value);
              },
            ),
          quantity: yup
            .number()
            .required('Số lượng sản phẩm: bắt buộc điền')
            .min(1, 'Số lượng sản phẩm: không thấp hơn 1'),
          name: yup.string().max(100, 'Tên sản phẩm: không vượt quá 100 ký tự'),
          price: yup.number().min(0, 'Giá sản phẩm: không thấp hơn 0'),
          discount: yup.number(),
          address: yup.string().max(500, 'Địa chỉ: không vượt quá 500 ký tự'),
          coverImageId: yup
            .string()
            .test(
              'Validate ObjectID',
              'coverImageId: not valid ObjectID',
              (value) => {
                if (!value) return true;
                return ObjectId.isValid(value);
              },
            ),
        }),
      ),
    }),
  }),

  getOrderSchema: yup.object({
    status: yup
      .string()
      .oneOf(Object.values(STATUS.VALUE), 'status: không hợp lệ'),
  }),

  searchOrderSchema: yup.object({
    query: yup.object({
      page: yup.number(),
      pageSize: yup.number(),
      keyword: yup.string(),
      productName: yup.string(),
      status: yup
        .string()
        .oneOf(Object.values(STATUS.VALUE), 'status: không hợp lệ'),
      customerId: yup
        .string()
        .test(
          'Validate ObjectID',
          'customerId: is not valid ObjectID',
          (value) => {
            if (!value) return true;
            return ObjectId.isValid(value);
          },
        ),
      employeeId: yup
        .string()
        .test(
          'Validate ObjectID',
          'employeeId: not valid ObjectID',
          (value) => {
            if (!value) return true;
            return ObjectId.isValid(value);
          },
        ),
      startDate: yup.date(),
      endDate: yup.date(),
      orderDiscount: yup.number().min(0, 'Giảm giá hóa đơn: không thấp hơn 0'),
      address: yup.string().max(500, 'Địa chỉ không vượt quá 500 ký tự'),
      isDelivery: yup.boolean(),
    }),
  }),

  updateOrderSchema: yup.object({
    body: yup.object({
      status: yup
        .string()
        .oneOf(Object.values(STATUS.VALUE), 'status: không hợp lệ'),
      employeeId: yup
        .string()
        .test(
          'Validate ObjectID',
          'employeeId: not valid ObjectID',
          (value) => {
            if (!value) return true;
            return ObjectId.isValid(value);
          },
        ),
      shippedDate: yup
        .date()
        .test(
          'check date',
          'shippedDateUpdate: không thấp hơn ngày hiện tại',
          (value) => {
            if (!value) return true;
            const currentDate = new Date();
            // currentDate.setSeconds(0, 0); // Đặt giá trị giờ phút giây thành 0
            const selectedDate = new Date(value);
            // selectedDate.setSeconds(0, 0); // Đặt giá trị giờ phút giây thành 0
            return selectedDate >= currentDate;
          },
        ),
      address: yup.string().max(500, 'Địa chỉ không vượt quá 500 ký tự'),
    }),
  }),
};
