const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const { ACTIONS } = require('../../constants');

const orderHistorySchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'employees',
      required: [true, 'Id nhân viên bắt buộc điền'],
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'customers',
      required: [true, 'Id khách hàng bắt buộc điền'],
    },
    action: {
      type: String,
      require: [true, 'Hành động không thể bỏ trống'],
      enum: Object.values(ACTIONS),
    },
    oldContent: {
      type: String,
      require: [true, 'Nội dung cũ không thể bỏ trống'],
      maxLength: [500, 'Nội dung cũ không thể vượt quá 500 ký tự'],
    },
    newContent: {
      type: String,
      require: [true, 'Nội dung cập nhật không thể bỏ trống'],
      maxLength: [500, 'Nội dung cập nhật không vượt quá 500 ký tự'],
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'orders',
      require: [true, 'Id đặt hàng bắt buộc điền'],
    },
  },
  {
    versionKey: false, // Tắt trường '__v' dùng để theo dõi phiên bản
    timestamps: true, // Tự động thêm trường createdAt và updatedAt
  },
);

// Tạo trường ảo 'employee' để tham chiếu đến nhân viên
orderHistorySchema.virtual('employee', {
  ref: 'employees',
  localField: 'employeeId',
  foreignField: '_id',
  justOne: true,
});
// Tạo trường ảo 'customer' để tham chiếu đến khách hàng
orderHistorySchema.virtual('customer', {
  ref: 'customers',
  localField: 'customerId',
  foreignField: '_id',
  justOne: true,
});

orderHistorySchema.virtual('order', {
  ref: 'orders',
  localField: 'orderId',
  foreignField: '_id',
  justOne: true,
});

orderHistorySchema.set('toObject', { virtuals: true });
orderHistorySchema.set('toJSON', { virtuals: true });

const OrderHistory = model('order_histories', orderHistorySchema);
module.exports = OrderHistory;
