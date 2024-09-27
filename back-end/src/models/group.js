/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên bắt buộc điền'],
      maxLength: [50, 'Tên không vượt quá 50 ký tự'],
      trim: true,
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

const Group = model('groups', groupSchema);
module.exports = Group;
