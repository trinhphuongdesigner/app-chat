const { processMedia } = require('../middleware');
const { deleteMedia } = require('../media/controller');
const { Category } = require('../../../../models');
const {
  fuzzySearch,
  apiResponse,
  isMongoId,
  asyncForEach,
  apiErrors,
} = require('../../../../helpers');
const { PAGINATION } = require('../../../../constants');

module.exports = {
  createCategory: async (req, res, next) => {
    let coverImageId;
    try {
      const { name, description } = req.body;
      const coverImage = req.file ? req.file : req.body.coverImage;

      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return next({
          ...apiErrors.categoryAlreadyExists,
          payload: existingCategory,
        });
      }

      coverImageId = await processMedia(next, name, coverImage);
      // Tạo category với coverImageId từ media._id
      const newCategory = new Category({
        name,
        description,
        coverImageId,
      });
      await newCategory.save();

      return next(
        apiResponse({
          message: 'Tạo danh mục sản phẩm mới thành công',
          payload: newCategory,
        }),
      );
    } catch (error) {
      // Nếu có lỗi xảy ra và media được tạo từ uploadAndCreateMedia, thì mới xóa media
      if (coverImageId && req.file) {
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

  allCategories: async (req, res, next) => {
    try {
      const categories = await Category.find({ deletedAt: null })
        .select('-createdAt -updatedAt ')
        .populate('coverImage');

      const totalCategories = categories.length;

      return res.json(
        apiResponse({ payload: categories, total: totalCategories }),
      );
    } catch (error) {
      next(error);
    }
  },

  listCategories: async (req, res, next) => {
    try {
      const { page, pageSize, keyword } = req.query;
      const limit = pageSize || PAGINATION.LIMIT;
      const skip = limit * (page - 1) || PAGINATION.SKIP;

      const conditionFind = { deletedAt: null };

      if (keyword) {
        conditionFind.name = { $regex: fuzzySearch(keyword) };
      }
      const listCategories = await Category.find(conditionFind)
        .select('-createdAt -updatedAt')
        .populate('coverImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalCategories = await Category.countDocuments(conditionFind);
      const totalCategoriesPerPage = listCategories.length;

      return res.json(
        apiResponse({
          payload: listCategories,
          total: totalCategories,
          totalPerPage: totalCategoriesPerPage,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  getDetailCategory: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!isMongoId(id)) return next();

      const category = await Category.findOne({
        _id: id,
        deletedAt: null,
      })
        .select('-createdAt -updatedAt ')
        .populate('coverImage');

      if (!category) return next();
      return res.json(apiResponse({ payload: category }));
    } catch (error) {
      next(error);
    }
  },

  editCategory: async (req, res, next) => {
    let coverImageId;
    try {
      const { name, description } = req.body;
      const { id } = req.params;
      const coverImage = req.file ? req.file : req.body.coverImage;

      if (coverImage) {
        coverImageId = await processMedia(next, name, coverImage);
      }

      const updateFields = {
        name,
        description,
      };

      if (coverImageId) {
        updateFields.coverImageId = coverImageId;
      }

      const category = await Category.findOneAndUpdate(
        { _id: id, deletedAt: null },
        updateFields,
        { new: true },
      ).select('-createdAt -updatedAt');

      if (!category) {
        if (coverImageId && req.file) {
          try {
            await deleteMedia(coverImageId);
          } catch (deleteError) {
            // eslint-disable-next-line no-console
            console.error('Lỗi khi xóa phương tiện', deleteError);
          }
        }
        return next(apiErrors.categoryNotFound);
      }

      return next(
        apiResponse({
          message: 'Cập nhật danh mục sản phẩm thành công',
          payload: category,
        }),
      );
    } catch (error) {
      if (coverImageId && req.file) {
        try {
          await deleteMedia(coverImageId);
        } catch (deleteError) {
          // eslint-disable-next-line no-console
          console.error('Lỗi khi xóa phương tiện', deleteError);
        }
      }
      next(error);
    }
  },

  deleteCategory: async (req, res, next) => {
    try {
      const { id } = req.params;

      const category = await Category.findOneAndUpdate(
        { _id: id, deletedAt: null },
        { deletedAt: Date.now() },
        { new: true },
      ).select('-createdAt -updatedAt');

      if (!category) return next();

      return res.json(apiResponse({ payload: category }));
    } catch (error) {
      next(error);
    }
  },

  deleteCategories: async (req, res, next) => {
    try {
      const { ids } = req.body;

      // Kiểm tra xem ids có phải là một mảng và tất cả các phần tử trong mảng có phải là id không
      const areAllIdsValid = Array.isArray(ids) && ids.every(id => isMongoId(id));
      if (!areAllIdsValid) {
        return res.status(400).json({
          message: 'Ids phải là một mảng các id hợp lệ',
          error: 'Ids không hợp lệ',
        });
      }

      const errors = [];
      const results = [];
      await asyncForEach(ids, async (id) => {
        const deleteCategories = await Category.findOneAndUpdate(
          { _id: id, deletedAt: null },
          { deletedAt: Date.now() },
          { new: true },
        );

        if (!deleteCategories) {
          errors.push(`${deleteCategories.name}`);
        } else {
          results.push(deleteCategories);
        }
      });

      if (errors.length > 0) {
        return res.status(404).json({
          message: `Xóa danh mục ${errors} không thành công`,
          error: `${errors}`,
        });
      }

      return res.json(apiResponse({ payload: results }));
    } catch (error) {
      next(error);
    }
  },
};
