/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const bcrypt = require('bcryptjs'); // Thêm thư viện hỗ trợ mã hóa password
const { REGEX } = require('../../constants');

// Xác định bảng khách hàng với các trường khác nhau và quy tắc xác thực của chúng.
const customerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Tên khách hàng bắt buộc điền'],
      maxLength: [50, 'Tên khách hàng không vượt quá 50 ký tự'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Họ khách hàng bắt buộc điền'],
      maxLength: [50, 'Họ khách hàng không vượt quá 50 ký tự'],
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
      maxLength: [50, 'Email không vượt quá 50 ký tự'],
      unique: [true, 'Email là duy nhất'],
    },
    password: {
      type: String,
      validate: {
        validator(value) {
          // xác thực password
          const passwordRegex = REGEX.PASSWORD;
          return passwordRegex.test(value);
        },
        message: 'Mật khẩu không hợp lệ',
      },
      required: true,
      minLength: [8, 'Mật khẩu ít nhất 8 ký tự'],
      maxLength: [20, 'Mật khẩu không vượt quá 20 ký tự'],
    },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          // Xác thực số điện thoại
          const phoneRegex = REGEX.PHONE;
          return phoneRegex.test(value);
        },
        message: 'Số điện thoại không hợp lệ',
      },
    },
    birthday: {
      type: Date,
    },
    address: {
      type: String,
      require: true,
    },
    avatarId: {
      type: Schema.Types.ObjectId,
      ref: 'medias',
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
customerSchema.virtual('avatar', {
  ref: 'medias',
  localField: 'avatarId',
  foreignField: '_id',
  justOne: true,
});
// Virtual with Populate
customerSchema.virtual('cart', {
  ref: 'carts',
  localField: '_id',
  foreignField: 'customerId',
  justOne: true,
});
// Virtual with Populate
customerSchema.virtual('order', {
  ref: 'orders',
  localField: '_id',
  foreignField: 'customerId',
  justOne: false, // cho phép lấy thông tin nhiều đơn hàng
});

// Tạo trường ảo fullName
customerSchema.virtual('fullName').get(function () {
  return `${this.lastName} ${this.firstName}`;
});

// Build mã hóa field
// hash mật khẩu trước khi lưu vào cơ sở dữ liệu.
async function hashPassword(value) {
  if (value) {
    const salt = await bcrypt.genSalt(10); // 10 kí tự: ABCDEFGHIK + 123456
    const hashedPassword = await bcrypt.hash(value, salt);

    return hashedPassword;
  }
}
customerSchema.pre('save', async function (next) {
  // Lưu hashPass thay cho việc lưu password
  this.password = await hashPassword(this.password);
  next();
});

customerSchema.pre('findOneAndUpdate', async function (next) {
  // Lưu hashPass thay cho việc lưu password
  if (this._update.password) {
    this._update.password = await hashPassword(this._update.password);
  }
  next();
});
// End mã hóa field

// Kiểm tra mật khẩu có hợp lệ hay không - giải mã password
customerSchema.methods.isValidPass = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

// đảm bảo trường ảo được bao gồm trong kết quả JSON và đối tượng JavaScript thông thường
customerSchema.set('toJSON', { virtuals: true });
customerSchema.set('toObject', { virtuals: true });

// hỗ trợ trường ảo trong truy vấn .lean() và hỗ trợ cho việc định nghĩa field sử dụng method liền.
customerSchema.plugin(mongooseLeanVirtuals);

// Tạo bảng khách hàng dựa trên lược đồ đã khai báo
const Customer = model('customers', customerSchema);
module.exports = Customer;
