/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const messageSchema = new Schema(
  {
    message: {
      type: String,
      required: [true, 'Tin nhắn bắt buộc điền'],
      maxLength: [255, 'Tin nhắn không vượt quá 255 ký tự'],
      trim: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'Mã người dùng bắt buộc điền'],
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'groups',
      required: [true, 'Mã nhóm bắt buộc điền'],
    },
    parentMessageId: {
      type: Schema.Types.ObjectId,
      ref: 'messages',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Message = model('messages', messageSchema);
module.exports = Message;
