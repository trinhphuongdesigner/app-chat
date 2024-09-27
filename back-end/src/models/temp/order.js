const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const { PAYMENT_TYPE, STATUS } = require('../../constants');

// Xác định lược đồ cho các mục sản phẩm trong một đơn hàng.
const orderDetailSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'products',
      required: [true, 'Mã sản phẩm bắt buộc điền'],
    },
    quantity: {
      type: Number,
      required: [true, 'Số lượng bắt buộc điền'],
      min: 1,
      default: 1,
    },
    name: { type: String },
    price: { type: Number },
    discount: { type: Number },
    coverImageId: {
      type: Schema.Types.ObjectId,
      ref: 'medias',
      require: [true, 'Ảnh sản phẩm bắt buộc điền'],
    },
  },
  {
    versionKey: false,
  },
);

// Tạo trường ảo "product" để tham chiếu đến sản phẩm
orderDetailSchema.virtual('product', {
  ref: 'products',
  localField: 'productId',
  foreignField: '_id',
  justOne: true,
});

orderDetailSchema.virtual('coverImage', {
  ref: 'medias',
  localField: 'coverImageId',
  foreignField: '_id',
  justOne: true,
});

// Cấu hình để đảm bảo trường ảo được bao gồm trong kết quả JSON
// và đối tượng JavaScript thông thường
orderDetailSchema.set('toObject', { virtuals: true });
orderDetailSchema.set('toJSON', { virtuals: true });

// -----------------------------------------------------------------------------------------------

// Xác định lược đồ cho các đơn hàng.
const orderSchema = new Schema(
  {
    shippedDate: {
      type: Date,
      validate: {
        validator(value) {
          // Kiểm tra ngày vận chuyển
          if (!value) return true;
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);
          const selectedDate = new Date(value);
          return selectedDate.getTime() >= currentDate.getTime();
        },
        message: 'Ngày dự kiến giao hàng không thấp hơn ngày hiện tại',
      },
    },

    paymentType: {
      type: String,
      required: [true, 'Phương thức thành toán bắt buộc'],
      default: PAYMENT_TYPE.CASH,
      enum: Object.values(PAYMENT_TYPE),
    },

    status: {
      type: String,
      required: [true, 'Trạng thái đơn hàng bắt buộc điền'],
      enum: Object.values(STATUS.VALUE),
    },
    orderDiscount: {
      type: Number,
      default: 0,
    },
    isDelivery: {
      type: Boolean,
      require: [true, 'kiểu giao hàng bắt buộc điền'],
      default: false,
    },
    totalFee: {
      type: Number,
    },
    address: {
      type: String,
      maxLength: [500, 'Địa chỉ không vượt quá 500 ký tự'],
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'customers',
      required: [true, 'Id khách hàng bắt buộc điền'],
    },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'employees',
      required: [true, 'Id nhân viên bắt buộc điền'],
    },
    orderDetail: [orderDetailSchema], // danh sách sản phẩm
  },

  {
    versionKey: false, // Tắt trường "__v" dùng để theo dõi phiên bản
    timestamps: true, // Tự động thêm trường createdAt và updatedAt
  },
);

// Tạo trường ảo "customer" để tham chiếu đến khách hàng
orderSchema.virtual('customer', {
  ref: 'customers',
  localField: 'customerId',
  foreignField: '_id',
  justOne: true,
});

// Tạo trường ảo "employee" để tham chiếu đến nhân viên
orderSchema.virtual('employee', {
  ref: 'employees',
  localField: 'employeeId',
  foreignField: '_id',
  justOne: true,
});

// Cấu hình để đảm bảo trường ảo được bao gồm trong kết quả JSON
// và đối tượng JavaScript thông thường
orderSchema.set('toObject', { virtuals: true });
orderSchema.set('toJSON', { virtuals: true });

// Tạo bảng orders dựa trên lược đồ đã khai báo
const Order = model('orders', orderSchema);
module.exports = Order;
