const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const { REGEX } = require('../../constants');

// Xác định bảng nhà cung cấp với các trường khác nhau và quy tắc xác thực của chúng.
const supplierSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên nhà cung cấp bắt buộc điền'],
      maxLength: [100, 'Tên nhà cung cấp không vượt quá 100 ký tự'],
      trim: true,
    },
    email: {
      type: String,
      validate: {
        validator(value) {
          // xác thực địa chỉ email.
          const emailRegex = REGEX.MAIL;
          return emailRegex.test(value);
        },
        message: 'Email không hợp lệ',
      },
      required: [true, 'Email bắt buộc điền'],
      unique: [true, ' Email là duy nhất'],
    },
    phoneNumber: {
      type: String,
      validate: {
        validator(value) {
          // Xác thực số điện thoại
          const phoneRegex = REGEX.PHONE;
          return phoneRegex.test(value);
        },
        message: 'Số điện thoại không hợp lệ',
      },
      unique: [true, ' Số điện thoại là duy nhất'],
    },
    avatarId: {
      type: Schema.Types.ObjectId,
      ref: 'medias',
      default: null,
    },
    address: {
      type: String,
      maxLength: [500, 'Địa chỉ không vượt 500 ký tự'],
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false, // Tắt trường "__v" dùng để theo dõi phiên bản
    timestamps: true, // Tự động thêm trường createdAt và updatedAt
  },
);
// Virtual with Populate
supplierSchema.virtual('avatar', {
  ref: 'medias',
  localField: 'avatarId',
  foreignField: '_id',
  justOne: true,
});
// Virtuals in console.log()
supplierSchema.set('toObject', { virtuals: true });
// Virtuals in JSON
supplierSchema.set('toJSON', { virtuals: true });

// Tạo bảng nhà cung cấp dựa trên lược đồ đã khai báo
const Supplier = model('suppliers', supplierSchema);
module.exports = Supplier;
