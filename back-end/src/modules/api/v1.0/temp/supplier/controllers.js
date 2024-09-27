const { Supplier } = require('../../../../../models');
const {
  apiResponse,
  fuzzySearch,
  isMongoId,
  asyncForEach,
} = require('../../../../../helpers');
const { processMedia } = require('../../middleware');
const { deleteMedia } = require('../media/controller');
const { PAGINATION } = require('../../../../../constants');

module.exports = {
  createSupplier: async (req, res, next) => {
    let avatarId = null;
    try {
      const {
        name, email, phoneNumber, address,
      } = req.body;
      const avatar = req.file ? req.file : req.body.avatar;

      const getNameExits = Supplier.findOne({ name });
      const getEmailExits = Supplier.findOne({ email });
      const getPhoneExits = Supplier.findOne({ phoneNumber });

      const [foundName, foundEmail, foundPhoneNumber] = await Promise.all([
        getNameExits,
        getEmailExits,
        getPhoneExits,
      ]);

      const errors = [];
      if (foundName) errors.push('Tên nhà cung cấp đã tồn tại');
      if (foundEmail) errors.push('Email đã tồn tại');
      if (foundPhoneNumber) errors.push('Số điện thoại đã tồn tại');

      if (errors.length > 0) {
        return res.status(400).json({
          // message: 'Thông tin tạo nhà cung cấp không hợp lệ',
          message: errors.join(', '),
        });
      }

      if (avatar) {
        avatarId = await processMedia(next, email, avatar);
      }

      const newSupplier = {
        name,
        email,
        phoneNumber,
        address,
        avatarId,
      };

      const supplier = new Supplier(newSupplier);
      await supplier.save();

      return res.json(
        apiResponse({
          payload: supplier,
        }),
      );
    } catch (error) {
      if (avatarId && req.file) {
        try {
          await deleteMedia(avatarId);
        } catch (deleteError) {
          // eslint-disable-next-line no-console
          console.error('Lỗi khi xóa phương tiện', deleteError);
        }
      }
      next(error);
    }
  },

  allSuppliers: async (req, res, next) => {
    try {
      const suppliers = await Supplier.find({ deletedAt: null })
        .select('-createdAt -updatedAt ')
        .populate('avatar');

      const totalSuppliers = suppliers.length;

      return res.json(
        apiResponse({ payload: suppliers, total: totalSuppliers }),
      );
    } catch (error) {
      next(error);
    }
  },

  listSuppliers: async (req, res, next) => {
    try {
      const { page, pageSize, keyword } = req.query;
      const limit = pageSize || PAGINATION.LIMIT;
      const skip = limit * (page - 1) || PAGINATION.SKIP;

      const conditionFind = { deletedAt: null };

      if (keyword) {
        conditionFind.$or = [
          { name: { $regex: fuzzySearch(keyword) } },
          { email: { $regex: fuzzySearch(keyword) } },
          { phoneNumber: { $regex: fuzzySearch(keyword) } },
        ];
      }
      const listSuppliers = await Supplier.find(conditionFind)
        .select(' -createdAt -updatedAt')
        .sort({ createdAt: -1 })
        .populate('avatar')
        .skip(skip)
        .limit(limit);

      const totalSuppliers = await Supplier.countDocuments(conditionFind);
      const totalSuppliersPerPage = listSuppliers.length;

      return res.json(
        apiResponse({
          payload: listSuppliers,
          total: totalSuppliers,
          totalPerPage: totalSuppliersPerPage,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  getDetailSupplier: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!isMongoId(id)) return next();

      const supplier = await Supplier.findOne({
        _id: id,
        deletedAt: null,
      })
        .select('-createdAt -updatedAt ')
        .populate('avatar');

      if (!supplier) return next();
      return res.json(apiResponse({ payload: supplier }));
    } catch (error) {
      next(error);
    }
  },

  editProfileSupplier: async (req, res, next) => {
    try {
      const {
        name, email, phoneNumber, address,
      } = req.body;

      const { id } = req.params;

      const supplier = await Supplier.findOneAndUpdate(
        { _id: id, deletedAt: null },
        {
          name,
          email,
          phoneNumber,
          address,
        },
        { new: true },
      )
        .select('-createdAt -updatedAt')
        .populate('avatar');

      if (!supplier) return next();
      return res.json(apiResponse({ payload: supplier }));
    } catch (error) {
      next(error);
    }
  },

  editAvatarSupplier: async (req, res, next) => {
    let avatarId = null;
    try {
      const { id } = req.params;
      const { email } = req.body;
      const avatar = req.file ? req.file : req.body.avatar;

      avatarId = await processMedia(next, email, avatar);

      const supplier = await Supplier.findOneAndUpdate(
        { _id: id, deletedAt: null },
        {
          avatarId,
        },
        { new: true },
      )
        .select('-createdAt -updatedAt')
        .populate('avatar');

      if (!supplier) return next();
      return res.json(apiResponse({ payload: supplier }));
    } catch (error) {
      next(error);
    }
  },

  deleteSupplier: async (req, res, next) => {
    try {
      const { id } = req.params;

      const supplier = await Supplier.findOneAndUpdate(
        { _id: id, deletedAt: null },
        { deletedAt: Date.now() },
        { new: true },
      ).select('-createdAt -updatedAt');

      if (!supplier) return next();

      return res.json(apiResponse({ payload: supplier }));
    } catch (error) {
      next(error);
    }
  },

  deleteSuppliers: async (req, res, next) => {
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
        const deleteSuppliers = await Supplier.findOneAndUpdate(
          { _id: id, deletedAt: null },
          { deletedAt: Date.now() },
          { new: true },
        );

        if (!deleteSuppliers) {
          errors.push(`${deleteSuppliers.fullName}`);
        } else {
          results.push(deleteSuppliers);
        }
      });

      if (errors.length > 0) {
        return res.status(404).json({
          message: `Xóa nhà cung cấp ${errors} không thành công`,
          error: `${errors}`,
        });
      }

      return res.json(apiResponse({ payload: results }));
    } catch (error) {
      next(error);
    }
  },
};
