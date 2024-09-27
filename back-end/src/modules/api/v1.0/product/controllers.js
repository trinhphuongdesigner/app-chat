const { Product } = require('../../../../models');
const {
  apiResponse,
  fuzzySearch,
  asyncForEach,
  apiErrors,
} = require('../../../../helpers');
const { processMedia } = require('../middleware');
const { deleteMedia } = require('../media/controller');

const { PAGINATION } = require('../../../../constants');

module.exports = {
  createProduct: async (req, res, next) => {
    let coverImageId;
    try {
      const {
        name,
        price,
        discount,
        stock,
        description,
        categoryId,
        supplierId,
      } = req.body;

      const coverImage = req.files && req.files.coverImage
        ? req.files.coverImage[0]
        : req.body.coverImage;
      const images = req.body.mergedImages;

      const existingProduct = await Product.findOne({ name });
      if (existingProduct) {
        return next({
          ...apiErrors.productAlreadyExists,
          payload: existingProduct,
        });
      }

      coverImageId = await processMedia(next, name, coverImage);

      // Xử lý mảng image
      const processedImageIds = [];
      if (Array.isArray(images)) {
        await asyncForEach(images, async (image) => {
          const processedImage = await processMedia(next, name, image);
          if (processedImage) {
            processedImageIds.push(processedImage);
          }
        });
      }

      const newProduct = new Product({
        name,
        price,
        discount,
        stock,
        description,
        categoryId,
        supplierId,
        coverImageId,
        imageIds: processedImageIds,
      });
      await newProduct.save();

      return next(
        apiResponse({
          message: 'Tạo sản phẩm mới thành công',
          payload: newProduct,
        }),
      );
    } catch (error) {
      // Nếu có lỗi xảy ra và media được tạo từ uploadAndCreateMedia, thì mới xóa media
      if (coverImageId && req.files.coverImage) {
        try {
          // Gọi hàm deleteMedia để xóa media
          await deleteMedia(coverImageId);
        } catch (deleteError) {
          // Nếu có lỗi xảy ra khi xóa media, log lỗi nhưng không làm gì hơn
          // eslint-disable-next-line no-console
          console.error('Lỗi khi xóa phương tiện', deleteError);
        }
      }
      next(error);
    }
  },

  createProductList: async (req, res, next) => {
    try {
      const { productList } = req.body;

      const productExist = [];
      const results = [];

      await asyncForEach(productList, async (product) => {
        const getProductExits = await Product.findOne({
          name: product.name,
          deleteAt: null,
        });

        if (getProductExits) {
          const newStock = getProductExits.stock + product.stock;
          getProductExits.stock = newStock;
          const payload = await getProductExits.save();
          productExist.push(payload._id);
          results.push(payload);
        } else {
          const newProduct = {
            name: product.name,
            price: product.price,
            discount: product.discount,
            stock: product.stock,
            description: product.description, // sửa lại description, ban đầu là product.stock
            categoryId: product.categoryId || null,
            supplierId: product.supplierId || null,
            imageIds: product.imageIds || null,
            coverImageId: product.coverImageId || null,
          };

          const addProduct = new Product(newProduct);
          const payloadProduct = await addProduct.save();
          results.push(payloadProduct);
        }
      });

      if (productExist.length > 0) {
        return res.status(200).json(
          apiResponse({
            message: 'Đã thêm số lượng cho danh sách các sản phẩm',
            listExists: productExist,
            payload: results,
          }),
        );
      }
      return res.json(
        apiResponse({
          message: 'Thêm danh sách sản phẩm thành công',
          payload: results,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  allProduct: async (req, res, next) => {
    try {
      const payload = await Product.find({ deletedAt: null })
        .populate('category')
        .populate('supplier')
        .populate('coverImage')
        .sort({ createdAt: -1 });

      const totalProduct = payload.length;

      return res.json(apiResponse({ payload, total: totalProduct }));
    } catch (error) {
      next(error);
    }
  },

  detailProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      const payload = await Product.findOne({
        _id: id,
        deletedAt: null,
      })
        .populate('category')
        .populate('supplier')
        .populate('coverImage')
        .populate('image')
        .lean();

      if (!payload) {
        return next();
      }

      return res.status(200).json(
        apiResponse({
          message: 'Lấy thông tin chi tiết sản phẩm thành công',
          payload,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  searchProduct: async (req, res, next) => {
    try {
      const {
        keyword,
        page,
        pageSize,
        categoryId,
        supplierId,
        discountStart,
        discountEnd,
        priceStart,
        priceEnd,
        increasePrice,
        decreasePrice,
      } = req.query;

      const limit = pageSize || PAGINATION.LIMIT;
      const skip = limit * (page - 1) || PAGINATION.SKIP;

      const conditionFind = { deletedAt: null };

      if (keyword) {
        conditionFind.name = { $regex: fuzzySearch(keyword) };
      }

      if (categoryId) {
        conditionFind.categoryId = categoryId;
      }

      if (supplierId) {
        conditionFind.supplierId = supplierId;
      }

      if (priceStart && priceEnd) {
        const comparePriceStart = { $lte: ['$price', priceEnd] };
        const comparePriceEnd = { $gte: ['$price', priceStart] };
        conditionFind.$expr = { $and: [comparePriceStart, comparePriceEnd] };
      } else if (priceStart) {
        conditionFind.price = { $gte: parseFloat(priceStart) };
      } else if (priceEnd) {
        conditionFind.price = { $lte: parseFloat(priceEnd) };
      }

      if (discountStart && discountEnd) {
        const compareDiscountStart = { $lte: ['$discount', discountEnd] };
        const compareDiscountEnd = { $gte: ['$discount', discountStart] };
        conditionFind.$expr = {
          $and: [compareDiscountStart, compareDiscountEnd],
        };
      } else if (discountStart) {
        conditionFind.discount = { $gte: parseFloat(discountStart) };
      } else if (discountEnd) {
        conditionFind.discount = { $lte: parseFloat(discountEnd) };
      }

      const arrange = { createdAt: -1 };

      if (increasePrice && !decreasePrice) {
        arrange.price = 1;
      }
      if (decreasePrice && !increasePrice) {
        arrange.price = -1;
      }

      const payload = await Product.find(conditionFind)
        .populate('category')
        .populate('supplier')
        .populate('coverImage')
        .skip(skip)
        .limit(limit)
        .sort(arrange);

      const totalProduct = await Product.countDocuments(conditionFind);
      const totalProductList = payload.length;

      if (payload) {
        return res.status(200).json(
          apiResponse({
            message: 'Tìm kiếm nhân viên thành công',
            total: totalProduct,
            count: totalProductList,
            payload,
          }),
        );
      }

      return next();
    } catch (error) {
      next(error);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const {
        name,
        price,
        discount,
        stock,
        description,
        categoryId,
        supplierId,
      } = req.body;

      const { id } = req.params;

      const existingProduct = await Product.findOne({
        _id: id,
        deletedAt: null,
      });

      if (!existingProduct) {
        return next(apiErrors.productNotFound);
      }

      const coverImage = req.files && req.files.coverImage
        ? req.files.coverImage[0]
        : req.body.coverImage;
      const images = req.body.mergedImages;

      const exitUpdate = await Product.findOne({ name });
      if (exitUpdate && exitUpdate.id !== id) {
        return next({
          ...apiErrors.productAlreadyExists,
          payload: exitUpdate,
        });
      }

      // Nếu có ảnh bìa mới thì xử lý
      let updateCoverImageId;
      if (coverImage) {
        updateCoverImageId = await processMedia(next, name, coverImage);
      }

      // Xử lý mảng imageIds
      const processedImageIds = [];
      if (Array.isArray(images)) {
        await asyncForEach(images, async (image) => {
          const processedImage = await processMedia(next, name, image);
          if (processedImage) {
            processedImageIds.push(processedImage._id);
          }
        });
      }

      const updateFields = {
        name,
        price,
        discount,
        stock,
        description,
        categoryId,
        supplierId,
      };

      // Cập nhật ảnh bìa nếu có
      if (coverImage) {
        updateFields.coverImageId = updateCoverImageId;
      }

      // Cập nhật mảng ảnh nếu có
      if (processedImageIds.length) {
        updateFields.imageIds = processedImageIds;
      }

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: id, deletedAt: null },
        updateFields,
        { new: true },
      );

      if (!updatedProduct) {
        return next(apiErrors.badRequest);
      }

      return next(
        apiResponse({
          message: 'Cập nhật thông tin sản phẩm thành công',
          payload: updatedProduct,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  restoreProduct: async (req, res, next) => {
    try {
      const { id } = req.params;

      const restoreProduct = await Product.findOneAndUpdate(
        { _id: id, deletedAt: { $ne: null } },
        { deletedAt: null },
        { new: true },
      );

      if (!restoreProduct) {
        return next();
      }

      return res.status(200).json(
        apiResponse({
          message: 'Khôi phục sản phẩm thành công',
          payload: restoreProduct,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  deleteSoftProduct: async (req, res, next) => {
    try {
      const { id } = req.params;

      const deleteProduct = await Product.findOneAndUpdate(
        { _id: id, deletedAt: null },
        { deletedAt: Date.now() },
        { new: true },
      );

      if (!deleteProduct) {
        return next();
      }

      return res.status(200).json(
        apiResponse({
          message: 'Xóa sản phẩm thành công',
          payload: deleteProduct,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  deleteSoftProductSelected: async (req, res, next) => {
    try {
      const { idSelected } = req.body;

      const errors = [];
      const results = [];

      await asyncForEach(idSelected, async (id) => {
        const deleteProduct = await Product.findOne({
          _id: id,
          deletedAt: null,
        });

        if (!deleteProduct) {
          errors.push(id);
        }
      });

      if (errors.length > 0) {
        return res.status(400).json({
          status: 400,
          message: 'Danh sách sản phẩm đã được xóa',
          error: errors,
        });
      }

      await asyncForEach(idSelected, async (id) => {
        const deleteProduct = await Product.findOneAndUpdate(
          { _id: id, deletedAt: null },
          { deletedAt: Date.now() },
          { new: true },
        );

        if (deleteProduct) {
          results.push(deleteProduct);
        }
      });

      return res.status(200).json(
        apiResponse({
          message: 'Xóa sản phẩm đã chọn thành công',
          payload: results,
        }),
      );
    } catch (error) {
      next(error);
    }
  },
};
