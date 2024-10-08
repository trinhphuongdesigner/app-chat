/* eslint-disable no-unused-vars */
const { Group, UserGroup, User } = require('../../../../models');
const {
  apiErrors, apiResponse,
  fuzzySearch,
  groupSearch,
  asyncForEach,
} = require('../../../../helpers');

const s3Service = require('../../../../services/s3');

module.exports = {
  getGroups: async (req, res, next) => {
    try {
      const { q, page, limit = 10 } = req.query;
      const currentPage = Math.ceil((!page || page <= 0) ? 1 : +page);

      const conditionFind = {
        isActive: true,
      };

      if (q) {
        const search = fuzzySearch(q);
        conditionFind.name = search;
      }

      const groups = await Group.aggregate()
        .lookup({
          from: 'user_groups',
          localField: '_id',
          foreignField: 'groupId',
          as: 'userGroups',
        })
        .match(conditionFind)
        .sort({ updatedAt: -1, name: 1 })
        .skip(limit * (currentPage - 1))
        .limit(limit)
        .project({
          isActive: 0,
          createdAt: 0,
          userGroups: {
            groupId: 0,
            isActive: 0,
            createdAt: 0,
          },
        });

      const total = await Group.countDocuments(conditionFind);

      res.json(apiResponse({
        payload: {
          groups,
          total,
        },
      }));
    } catch (error) {
      next(error);
    }
  },

  createGroup: async (req, res, next) => {
    try {
      const { name, users } = req.body;

      const checkGroup = await Group.findOne({ name: groupSearch(name) });

      if (checkGroup) return next(apiErrors.groupNameAlreadyExists);

      const userErrors = [];
      await asyncForEach(users, async (user) => {
        const checkUser = await User.findOne({
          _id: user,
          isActive: true,
        });

        if (!checkUser) {
          userErrors.push(`${user} is not exits`);
        }
      });

      if (userErrors.length > 0) {
        return res.json(apiResponse({
          status: 404,
          code: 404,
          message: userErrors,
        }));
      }

      // const checkMember = await UserGroup.aggregate({ name: groupSearch(name) });
      // const groups = await Group.aggregate()
      //   .lookup({
      //     from: 'user_groups',
      //     localField: '_id',
      //     foreignField: 'groupId',
      //     as: 'userGroups',
      //   });

      // Method 1
      // const group = new Group({ name });
      // await group.save();

      // Method 2
      const group = await Group.create({ name });

      const userGroups = [];
      await asyncForEach(users, async (user) => {
        const userGroup = await UserGroup.create({
          userId: user,
          groupId: group._id,
        });

        userGroups.push(userGroup);
      });

      return res.json(apiResponse({
        payload: {
          _id: group._id,
          name: group.name,
          users: userGroups,
        },
      }));
    } catch (error) {
      console.log('🔥🔥🔥««««« error »»»»»🚀🚀🚀', error);
      next(error);
    }
  },

  updateGroupName: async (req, res, next) => {
    try {
      const { id: groupId } = req.params;
      const { id: userId } = req.user;
      const { name } = req.body;

      const checkGroup = await Group.findOne({ _id: groupId, isActive: true });
      if (!checkGroup) {
        res.json(apiResponse({ message: 'Nhóm không tồn tại' }));
      }

      const checkUserGroup = await UserGroup
        .findOne({
          userId,
          groupId,
        })
        .lean();

      if (!checkUserGroup) {
        res.json(apiResponse({ message: 'Người dùng không thuộc nhóm này' }));
      }

      const checkGroupName = await Group
        .findOne({
          name: groupSearch(name),
          _id: { $ne: groupId },
        })
        .lean();

      if (!checkGroupName) {
        res.json(apiResponse({ message: 'Tên nhóm đã tồn tại' }));
      }

      const group = Group.findByIdAndUpdate(groupId, { name }, { new: true });

      res.json(apiResponse({ payload: group }));
    } catch (error) {
      next(error);
    }
  },

  updateMember: async (req, res, next) => {
    try {
      const { id: groupId } = req.params;
      const { id: userId } = req.user;
      const { users } = req.body;

      const checkGroup = await Group.findOne({ _id: groupId, isActive: true });
      if (!checkGroup) {
        res.json(apiResponse({ message: 'Nhóm không tồn tại' }));
      }

      const checkUserGroup = await UserGroup
        .findOne({
          userId,
          groupId,
        })
        .lean();

      if (!checkUserGroup) {
        res.json(apiResponse({ message: 'Người dùng không thuộc nhóm này' }));
      }

      const newUsers = [];
      const userErrors = [];

      await asyncForEach(users, async (user) => {
        const checkUserInGroup = await UserGroup
          .findOne({
            userId: user,
            groupId,
          })
          .lean();

        if (!checkUserInGroup) {
          const checkUser = await User.findOne({
            _id: user,
            isActive: true,
          });

          if (!checkUser) {
            userErrors.push(`${user} is not exits`);
          } else {
            newUsers.push(user);
          }
        }
      });

      if (userErrors.length > 0) {
        return res.json(apiResponse({
          status: 404,
          code: 404,
          message: userErrors,
        }));
      }

      const userGroups = [];
      await asyncForEach(newUsers, async (user) => {
        const userGroup = await UserGroup.create({
          userId: user,
          groupId,
        });

        userGroups.push(userGroup);
      });

      res.json(apiResponse({
        payload: {
          _id: checkGroup._id,
          name: checkGroup.name,
          users: userGroups,
        },
      }));
    } catch (error) {
      next(error);
    }
  },

  deleteGroup: async (req, res, next) => {
    try {
      const { id: groupId } = req.params;
      const { id: userId } = req.user;

      const checkGroup = await Group.findOne({ _id: groupId, isActive: true });
      if (!checkGroup) {
        res.json(apiResponse({ message: 'Nhóm không tồn tại' }));
      }

      const checkUserGroup = await UserGroup
        .findOne({
          userId,
          groupId,
        })
        .lean();

      if (!checkUserGroup) {
        res.json(apiResponse({ message: 'Người dùng không thuộc nhóm này' }));
      }

      await Group.deleteOne({ _id: groupId });
      await UserGroup.deleteMany({ groupId });

      res.json(apiResponse({
        message: 'Xóa thành công nhóm',
      }));
    } catch (error) {
      next(error);
    }
  },
};
