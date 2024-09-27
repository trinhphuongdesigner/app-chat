const { Role } = require('../../../../models');
const { permissionGroups } = require('../../../../helpers/permission');
const {
  apiErrors,
  apiResponse,
  fuzzySearch,
  isMongoId,
  asyncForEach,
} = require('../../../../helpers/index');
const { PAGINATION } = require('../../../../constants');

module.exports = {
  createRole: async (req, res, next) => {
    try {
      const { name, description, permissions } = req.body;
      const roleData = {
        name,
        description,
        permissions,
      };

      const role = new Role(roleData);
      await role.save();

      return res.json(
        apiResponse({
          payload: role,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  getAllRoles: async (req, res, next) => {
    try {
      const conditionFind = {
        isRoot: false,
        deletedAt: null,
      };

      const roles = await Role.find(conditionFind).sort({ createdAt: 1 });
      const totalRoles = roles.length;

      return res.json(apiResponse({ payload: roles, total: totalRoles }));
    } catch (error) {
      next(error);
    }
  },

  listRoles: async (req, res, next) => {
    try {
      const { page, pageSize, keyword } = req.query;
      const limit = pageSize || PAGINATION.LIMIT;
      const skip = limit * (page - 1) || PAGINATION.SKIP;

      const conditionFind = { isRoot: false, deletedAt: null };

      if (keyword) {
        conditionFind.name = { $regex: fuzzySearch(keyword) };
      }
      const listRoles = await Role.find(conditionFind)
        .sort({ deletedAt: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalRoles = await Role.countDocuments(conditionFind);
      const totalRolesPerPage = listRoles.length;

      return res.json(
        apiResponse({
          payload: listRoles,
          total: totalRoles,
          totalPerPage: totalRolesPerPage,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  getDetailRole: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!isMongoId(id)) return next();

      const role = await Role.findOne({ _id: id, deletedAt: null }).select(
        '-createdAt -isRoot -updatedAt',
      );

      if (!role) return next();

      return res.json(apiResponse({ payload: role }));
    } catch (error) {
      next(error);
    }
  },

  getPermissions: async (req, res, next) => {
    try {
      res.json(
        apiResponse({
          payload: permissionGroups,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  editRole: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description, permissions } = req.body;

      const role = await Role.findOne({ _id: id, deletedAt: null });

      if (!role) return next();

      if (role.isRoot) {
        return next(apiErrors.canNotEditRootRole);
      }

      role.name = name;
      role.description = description;
      role.permissions = permissions || [];
      role.isRoot = false;

      await role.save();
      return res.json(apiResponse({ payload: role }));
    } catch (error) {
      next(error);
    }
  },

  deleteRole: async (req, res, next) => {
    try {
      const { id } = req.params;

      const role = await Role.findById(id);

      if (!role) return next();

      if (role.isRoot) {
        return next(apiErrors.canNotEditRootRole);
      }

      role.deletedAt = Date.now();

      await role.save();

      return res.json(apiResponse({ payload: role }));
    } catch (error) {
      next(error);
    }
  },

  deleteRoles: async (req, res, next) => {
    try {
      const { ids } = req.body;

      const errors = [];
      const results = [];

      await asyncForEach(ids, async (id) => {
        const deleteRole = await Role.findOneAndUpdate(
          { _id: id, deletedAt: null },
          { deletedAt: Date.now() },
          { new: true },
        );

        if (!deleteRole || deleteRole.isRoot) {
          errors.push(`${deleteRole.name}`);
        } else {
          results.push(deleteRole);
        }
      });

      if (errors.length > 0) {
        return res.status(404).json({
          message: `Xóa vai trò ${errors} không thành công`,
          error: `${errors}`,
        });
      }

      return res.json(apiResponse({ payload: results }));
    } catch (error) {
      next(error);
    }
  },

  searchRoles: async (req, res, next) => {
    try {
      const { keyword } = req.query;
      const conditionFind = {
        isRoot: false,
        deletedAt: null,
        name: { $regex: fuzzySearch(keyword) },
      };

      const result = await Role.find(conditionFind).sort({
        deletedAt: 1,
        createdAt: -1,
      });
      const totalResult = result.length;

      return res.json(
        apiResponse({
          payload: result,
          total: totalResult,
        }),
      );
    } catch (error) {
      next(error);
    }
  },
};
