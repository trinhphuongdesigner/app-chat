/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userGroupSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'Mã người dùng bắt buộc điền'],
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'user_groups',
      required: [true, 'Mã nhóm bắt buộc điền'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

userGroupSchema.virtual('user', {
  ref: 'users',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

userGroupSchema.virtual('groups', {
  ref: 'groups',
  localField: 'groupId',
  foreignField: '_id',
  justOne: true,
});

const UserGroup = model('user_groups', userGroupSchema);
module.exports = UserGroup;
