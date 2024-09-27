const { Customer } = require('../../../../models');
const {
  apiResponse,
  fuzzySearch,
  isMongoId,
  asyncForEach,
} = require('../../../../helpers');
const { processMedia } = require('../middleware');
const { deleteMedia } = require('../media/controller');

const { PAGINATION } = require('../../../../constants');

module.exports = {
  createCustomer: async (req, res, next) => {
    let avatarId = null;
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        birthday,
        address,
      } = req.body;
      const avatar = req.file ? req.file : req.body.avatar;

      const getEmailExits = Customer.findOne({ email });
      const getPhoneExits = Customer.findOne({ phoneNumber });

      const [foundEmail, foundPhoneNumber] = await Promise.all([
        getEmailExits,
        getPhoneExits,
      ]);

      const errors = [];

      if (foundEmail) errors.push('Email đã tồn tại');
      if (foundPhoneNumber) errors.push('Số điện thoại đã tồn tại');

      if (errors.length > 0) {
        return res.status(400).json({
          // message: 'Thông tin tạo khách hàng không hợp lệ',
          message: errors.join(', '),
        });
      }

      if (avatar) {
        avatarId = await processMedia(next, email, avatar);
      }

      const newCustomer = {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        birthday,
        avatarId,
        address,
      };

      const customer = new Customer(newCustomer);
      await customer.save();

      return res.json(
        apiResponse({
          payload: customer,
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

  allCustomers: async (req, res, next) => {
    try {
      const customers = await Customer.find({ deletedAt: null }).select(
        '-password -createdAt -updatedAt ',
      ).populate('avatar');

      const totalCustomers = customers.length;

      return res.json(
        apiResponse({ payload: customers, total: totalCustomers }),
      );
    } catch (error) {
      next(error);
    }
  },

  listCustomers: async (req, res, next) => {
    try {
      const { page, pageSize, keyword } = req.query;
      const limit = pageSize || PAGINATION.LIMIT;
      const skip = limit * (page - 1) || PAGINATION.SKIP;

      const conditionFind = { deletedAt: null };

      if (keyword) {
        conditionFind.$or = [
          { firstName: { $regex: fuzzySearch(keyword) } },
          { lastName: { $regex: fuzzySearch(keyword) } },
          { email: { $regex: fuzzySearch(keyword) } },
          { phoneNumber: { $regex: fuzzySearch(keyword) } },
        ];
      }
      const listCustomers = await Customer.find(conditionFind)
        .select('-password -createdAt -updatedAt')
        .sort({ createdAt: -1 })
        .populate('avatar')
        .skip(skip)
        .limit(limit);

      const totalCustomers = await Customer.countDocuments(conditionFind);
      const totalCustomersPerPage = listCustomers.length;

      return res.json(
        apiResponse({
          payload: listCustomers,
          total: totalCustomers,
          totalPerPage: totalCustomersPerPage,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  getDetailCustomer: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!isMongoId(id)) return next();

      const customer = await Customer.findOne({
        _id: id,
        deletedAt: null,
      })
        .select('-password -createdAt -updatedAt ')
        .populate('avatar');

      if (!customer) return next();
      return res.json(apiResponse({ payload: customer }));
    } catch (error) {
      next(error);
    }
  },

  editProfileCustomer: async (req, res, next) => {
    try {
      const {
        firstName, lastName, email, phoneNumber, birthday, address,
      } = req.body;

      const { id } = req.params;

      const customer = await Customer.findOneAndUpdate(
        { _id: id, deletedAt: null },
        {
          firstName,
          lastName,
          email,
          birthday,
          phoneNumber,
          address,
        },
        { new: true },
      ).select('-password -createdAt -updatedAt');

      if (!customer) return next();
      return res.json(apiResponse({ payload: customer }));
    } catch (error) {
      next(error);
    }
  },

  editAvatarCustomer: async (req, res, next) => {
    let avatarId = null;
    try {
      const { id } = req.params;
      const { email } = req.body;
      const avatar = req.file ? req.file : req.body.avatar;

      avatarId = await processMedia(next, email, avatar);

      const customer = await Customer.findOneAndUpdate(
        { _id: id, deletedAt: null },
        {
          avatarId,
        },
        { new: true },
      )
        .select('-createdAt -updatedAt')
        .populate('avatar');

      if (!customer) return next();
      return res.json(apiResponse({ payload: customer }));
    } catch (error) {
      next(error);
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword, confirmPassword } = req.body;

      const find = await Customer.findOne({
        _id: id,
        deletedAt: null,
      });

      const errors = [];

      const isCorrectPassOld = await find.isValidPass(oldPassword);
      const isCorrectPassNew = await find.isValidPass(newPassword);

      if (!isCorrectPassOld) {
        errors.push('Mật khẩu cũ không đúng');
      }

      if (isCorrectPassNew) {
        errors.push('Mật khẩu mới không được trùng với mật khẩu cũ');
      }

      if (newPassword !== confirmPassword) {
        errors.push('Xác thực mật khẩu mới không khớp');
      }

      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Thay đổi mật khẩu thất bại',
          error: `${errors}`,
        });
      }

      const customer = await Customer.findOneAndUpdate(
        { _id: id },
        { password: newPassword },
        { new: true },
      ).select('-password -createdAt -updatedAt');

      return res.json(apiResponse({ payload: customer }));
    } catch (error) {
      next(error);
    }
  },

  deleteCustomer: async (req, res, next) => {
    try {
      const { id } = req.params;

      const customer = await Customer.findOneAndUpdate(
        { _id: id, deletedAt: null },
        { deletedAt: Date.now() },
        { new: true },
      ).select('-password -createdAt -updatedAt');

      if (!customer) return next();

      return res.json(apiResponse({ payload: customer }));
    } catch (error) {
      next(error);
    }
  },

  deleteCustomers: async (req, res, next) => {
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
        const deleteCustomer = await Customer.findOneAndUpdate(
          { _id: id, deletedAt: null },
          { deletedAt: Date.now() },
          { new: true },
        );

        if (!deleteCustomer) {
          errors.push(`${deleteCustomer.fullName}`);
        } else {
          results.push(deleteCustomer);
        }
      });

      if (errors.length > 0) {
        return res.status(404).json({
          message: `Xóa khách hàng ${errors} không thành công`,
          error: `${errors}`,
        });
      }

      return res.json(apiResponse({ payload: results }));
    } catch (error) {
      next(error);
    }
  },
};
