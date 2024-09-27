const mongoose = require('mongoose');

const { Schema, model } = mongoose;
// const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const mediaSchema = new Schema(
  {
    name: { type: String, default: null },
    location: {
      type: String,
      require: [true, 'location hình ảnh không bỏ trống'],
    },
    size: {
      type: String,
      require: [true, 'kích thước số của hình ảnh không bỏ trống'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

// Đảm bảo trường ảo được bao gồm trong kết quả JSON và đối tượng JavaScript thông thường
mediaSchema.set('toJSON', { virtuals: true });
mediaSchema.set('toObject', { virtuals: true });

// Tạo bảng sản phẩm dựa trên lược đồ đã khai báo

const Media = model('medias', mediaSchema);
module.exports = Media;
