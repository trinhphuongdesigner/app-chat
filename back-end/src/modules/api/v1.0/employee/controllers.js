const { Employee } = require('../../../../models');
const { apiResponse } = require('../../../../helpers');
const { fuzzySearch, asyncForEach } = require('../../../../helpers');
const { PAGINATION } = require('../../../../constants');

module.exports = {
  createEmployee: async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        birthday,
        phoneNumber,
        // avatarId,
        address,
        roleId,
      } = req.body;

      const getEmailExits = Employee.findOne({ email });
      const getPhoneExits = Employee.findOne({ phoneNumber });

      const [foundEmail, foundPhoneNumber] = await Promise.all([
        getEmailExits,
        getPhoneExits,
      ]);

      const errors = [];

      if (foundEmail) errors.push('email đã tồn tại');
      if (foundPhoneNumber) errors.push('Số điện thoại đã tồn tại');

      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Thông tin tạo nhân viên chưa đúng',
          error: `${errors}`,
        });
      }

      const newEmployee = {
        firstName,
        lastName,
        email,
        password,
        birthday,
        phoneNumber,
        // avatarId: avatarId || null,
        address,
        roleId,
      };

      const addEmployee = new Employee(newEmployee);
      const payload = await addEmployee.save();

      return res.json(
        apiResponse({
          message: 'Thêm nhân viên thành công',
          payload,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  getAllEmployee: async (req, res, next) => {
    try {
      const payload = await Employee.find({ deleteAt: null })
        .select('-password')
        .populate('role');

      const totalEmployee = payload.length;
      return res.json(
        apiResponse({
          message: 'Lấy thông tin tất cả nhân viên thành công',
          total: totalEmployee,
          payload,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  getDetailEmployee: async (req, res, next) => {
    try {
      const { id } = req.params;
      const payload = await Employee.findOne({
        _id: id,
        deleteAt: null,
      }).select('-password')
        .populate('role');

      if (!payload) {
        return next();
      }

      return res.json(
        apiResponse({
          message: 'Lấy thông tin chi tiết nhân viên thành công',
          payload,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  searchEmployee: async (req, res, next) => {
    try {
      const { keyword, page, pageSize } = req.query;
      const limit = pageSize || PAGINATION.LIMIT;
      const skip = limit * (page - 1) || PAGINATION.SKIP;

      const conditionFind = { deleteAt: null };

      if (keyword) {
        conditionFind.$or = [
          { firstName: { $regex: fuzzySearch(keyword) } },
          { lastName: { $regex: fuzzySearch(keyword) } },
          { email: { $regex: fuzzySearch(keyword) } },
          { phoneNumber: { $regex: fuzzySearch(keyword) } },
        ];
      }

      const payload = await Employee.find(conditionFind)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ lastName: 1 })
        .populate('role');

      const totalEmployee = await Employee.countDocuments(conditionFind);
      const totalEmployeeList = payload.length;

      if (!payload) {
        return next();
      }

      return res.json(
        apiResponse({
          message: 'Tìm kiếm nhân viên thành công',
          total: totalEmployee,
          count: totalEmployeeList,
          payload,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  updateEmployeeProfile: async (req, res, next) => {
    try {
      const {
        firstName, lastName, email, birthday, phoneNumber, address, roleId,
      } = req.body;

      const { id } = req.params;

      const findEmployee = Employee.findOne({
        _id: id,
        deleteAt: null,
      }).select('-password');

      if (!findEmployee) {
        return next();
      }

      const uploadEmployee = await Employee.findOneAndUpdate(
        { _id: id, deleteAt: null },
        {
          firstName,
          lastName,
          email,
          birthday,
          phoneNumber,
          address,
          roleId,
        },
        { new: true },
      );

      if (!uploadEmployee) {
        return next();
      }

      return res.json(
        apiResponse({
          message: 'Cập nhật thông tin nhân viên thành công',
          payload: uploadEmployee,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword, confirmPassword } = req.body;

      const employee = await Employee.findOne({
        _id: id,
        deleteAt: null,
      });

      const errors = [];

      const isCorrectPassOld = await employee.isValidPass(oldPassword);
      const isCorrectPassNew = await employee.isValidPass(newPassword);

      if (!isCorrectPassOld) {
        errors.push('Mật khẩu cũ không khớp');
      }

      if (isCorrectPassNew) {
        errors.push('Mật khẩu mới không được trùng với mật khẩu cũ');
      }

      if (newPassword !== confirmPassword) {
        errors.push('Mật khẩu mới và xác nhận mật khẩu không khớp');
      }

      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Thay đổi mật khẩu không hợp lệ',
          error: `${errors}`,
        });
      }

      const changePassword = await Employee.findOneAndUpdate(
        { _id: id },
        { password: newPassword },
        { new: true },
      );

      if (!changePassword) {
        return next();
      }

      return res.json(
        apiResponse({
          message: 'Đổi mật khẩu nhân viên thành công',
          payload: changePassword,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { password } = req.body;

      const resetPassword = await Employee.findOneAndUpdate(
        { _id: id, deleteAt: null },
        { password },
        { new: true },
      );

      if (!resetPassword) {
        return next();
      }

      return res.json(
        apiResponse({
          message: 'Cấp lại mật khẩu thành công',
          payload: resetPassword,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  restoreEmployee: async (req, res, next) => {
    try {
      const { id } = req.params;

      const restoreEmployee = await Employee.findOneAndUpdate(
        { _id: id, deleteAt: { $ne: null } },
        { deleteAt: null },
        { new: true },
      );

      if (!restoreEmployee) {
        return next();
      }

      return res.json(
        apiResponse({
          message: 'Khôi phục viên thành công',
          payload: restoreEmployee,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  deleteSoftEmployee: async (req, res, next) => {
    try {
      const { id } = req.params;

      const deleteEmployee = await Employee.findOneAndUpdate(
        { _id: id, deleteAt: null },
        { deleteAt: Date.now() },
        { new: true },
      );

      if (!deleteEmployee) {
        return next();
      }

      return res.json(
        apiResponse({
          message: 'Xóa nhân viên thành công',
          payload: deleteEmployee,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  deleteSoftEmployeeSelected: async (req, res, next) => {
    try {
      const { idSelected } = req.body;

      const errors = [];
      const results = [];
      await asyncForEach(idSelected, async (id) => {
        const getEmployee = await Employee.findOne({ _id: id, deleteAt: null });

        if (!getEmployee) {
          errors.push(id);
        }
      });

      if (errors.length > 0) {
        return res.json({
          status: 400,
          message: 'Danh sách nhân viên đã được xóa',
          error: errors,
        });
      }

      await asyncForEach(idSelected, async (id) => {
        const deleteEmployee = await Employee.findOneAndUpdate(
          { _id: id, deleteAt: null },
          { deleteAt: Date.now() },
          { new: true },
        );

        if (deleteEmployee) {
          results.push(deleteEmployee);
        }
      });

      return res.json(
        apiResponse({
          message: 'Xóa nhân viên đã chọn thành công',
          payload: results,
        }),
      );
    } catch (error) {
      next(error);
    }
  },
};
