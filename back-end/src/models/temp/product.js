const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// Xác định bảng sản phẩm với các trường khác nhau và quy tắc xác thực của chúng.
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên sản phẩm bắt buộc điền'],
      maxLength: [100, 'Tên sản phẩm không vượt quá 100 ký tự'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Giá sản phẩm bắt buộc điền'],
      min: [0, 'Giá sản phẩm không dưới 0'],
      default: 0,
    },
    discount: {
      type: Number,
      min: [0, 'Giảm giá không dưới 0%'],
      max: [100, 'Giảm giá không quá 100%'],
      default: 0,
    },
    stock: { type: Number, min: 0 },
    description: {
      type: String,
      maxLength: [500, 'Mô tả sản phẩm không vượt quá 500 ký tự'],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'categories', // tham chiếu đến bảng "categories"
      required: [true, 'Id danh mục bắt buộc điền'],
    },
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: 'suppliers', // tham chiếu đến bảng "suppliers"
      required: [true, 'Id nhà cung bắt buộc điền'],
    },
    imageIds: [{
      type: Schema.Types.ObjectId,
      ref: 'medias',
    }],
    coverImageId: {
      type: Schema.Types.ObjectId,
      ref: 'medias',
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

// Tạo trường ảo "media" để tham chiếu đến array hình ảnh sản phẩm
productSchema.virtual('image', {
  ref: 'medias', // Tên model data tham chiếu
  localField: 'imageIds', // Field trong data hiện tại đem đi tham chiếu
  foreignField: '_id', // Field tham chiếu trong data tham chiếu
  justOne: false, // Mỗi sản phẩm chỉ thuộc về một danh mục
});

// Tạo trường ảo "media" để tham chiếu đến ảnh bìa sản phẩm
productSchema.virtual('coverImage', {
  ref: 'medias', // Tên model data tham chiếu
  localField: 'coverImageId', // Field trong data hiện tại đem đi tham chiếu
  foreignField: '_id', // Field tham chiếu trong data tham chiếu
  justOne: true, // Mỗi sản phẩm chỉ thuộc về một danh mục
});

// Tạo trường ảo "category" để tham chiếu đến danh mục sản phẩm
productSchema.virtual('category', {
  ref: 'categories', // Tên model data tham chiếu
  localField: 'categoryId', // Field trong data hiện tại đem đi tham chiếu
  foreignField: '_id', // Field tham chiếu trong data tham chiếu
  justOne: true, // Mỗi sản phẩm chỉ thuộc về một danh mục
});

// Tạo trường ảo "supplier" để tham chiếu đến nhà cung cấp sản phẩm
productSchema.virtual('supplier', {
  ref: 'suppliers', // Tên model data tham chiếu
  localField: 'supplierId', // Field trong data hiện tại đem đi tham chiếu
  foreignField: '_id', // Field tham chiếu trong data tham chiếu
  justOne: true, // Mỗi sản phẩm chỉ thuộc về một nhà cung cấp
});

// Cấu hình trường ảo được bao gồm trong kết quả JSON và đối tượng JavaScript thông thường
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Sử dụng plugin "mongoose-lean-virtuals" để hỗ trợ trường ảo trong truy vấn .lean()
// productSchema.plugin(mongooseLeanVirtuals);

// Tạo bảng sản phẩm dựa trên lược đồ đã khai báo
const Product = model('products', productSchema);

module.exports = Product;
