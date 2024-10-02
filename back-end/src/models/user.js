/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const bcrypt = require('bcryptjs');
const { REGEX } = require('../constants');

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Tên bắt buộc điền'],
      maxLength: [50, 'Tên không vượt quá 50 ký tự'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Họ bắt buộc điền'],
      maxLength: [50, 'Họ không vượt quá 50 ký tự'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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
          // xác thực địa chỉ email.
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
      validate: {
        validator(value) {
          // Xác thực số điện thoại
          const phoneRegex = REGEX.PHONE;
          return phoneRegex.test(value);
        },
        message: 'Số điện thoại không hợp lệ',
      },
      unique: [true, 'Số điện thoại là duy nhất'],
    },
    refreshToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

userSchema.virtual('fullName').get(function () {
  return `${this.lastName} ${this.firstName}`;
});

async function hashPassword(value) {
  if (value) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(value, salt);
    return hashedPassword;
  }
}

userSchema.pre('save', async function (next) {
  this.password = await hashPassword(this.password);
  next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
  if (this._update.password) {
    this._update.password = await hashPassword(this._update.password);
  }
  next();
});

userSchema.methods.isValidPass = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = model('users', userSchema);
module.exports = User;
