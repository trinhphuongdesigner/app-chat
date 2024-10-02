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
      const { q, page, limit } = req.query;
      const currentPage = Math.ceil((!page || page <= 0) ? 1 : +page);

      const conditionFind = {
        _id: { $nin: [req.user.id] },
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
        });
        // .unwind('customer');
        // .find(conditionFind)
        // .select('firstName lastName avatar birthday')
        // .sort({ firstName: 1, lastName: 1 })
        // .skip(limit * (currentPage - 1))
        // .limit(limit)
        // .lean();

      res.json(apiResponse({ payload: groups }));
    } catch (error) {
      next(error);
    }
  },

  createGroup: async (req, res, next) => {
    try {
      const { name, users } = req.body;

      const checkGroup = await name.findOne({ name: groupSearch(name) });

      if (checkGroup) return next(apiErrors.groupNameAlreadyExists);

      const userErrors = [];
      asyncForEach(users, async (user) => {
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
      asyncForEach(users, async (user) => {
        const userGroup = await UserGroup.create({
          userId: user,
          groupId: group._id,
        });

        userGroups.push(userGroup);
      });

      return res.json(apiResponse({ payload: xxx }));
    } catch (error) {
      next(error);
    }
  },

  updateMyInfo: async (req, res, next) => {
    try {
      const {
        firstName, middleName, lastName, phoneNumber,
      } = req.body;
      const { id: userId } = req.user;

      const user = await User
        .findByIdAndUpdate(userId, {
          firstName, middleName, lastName, phoneNumber,
        }, { new: true })
        .select('-password -refreshToken -resetPasswordToken')
        .lean();

      res.json(apiResponse({ payload: user }));
    } catch (error) {
      next(error);
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const { password, newPassword } = req.body;
      const user = await User.findById(req.user.id).select('email firstName middleName lastName password');

      if (!user.comparePassword(password)) {
        return next(apiErrors.getBadRequestError('Mật khẩu không chính xác', apiErrors.INVALID_PASSWORD));
      }
      user.password = newPassword;
      await user.save();

      res.json(apiResponse({
        message: 'Đổi mật khẩu thành công',
      }));
    } catch (error) {
      next(error);
    }
  },

  updateAvatar: async (req, res, next) => {
    s3Service.upload.single('file')(req, res, async (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(apiErrors.fileTooLarge);
        }
        return next(err);
      }
      try {
        const currentUser = req.user;
        const avatar = req.file.transforms[0].location;
        await User.update({ _id: currentUser.id }, { avatar });

        currentUser.avatar = avatar;

        res.json(apiResponse({
          payload: avatar,
        }));
      } catch (error) {
        next(error);
      }
    });
  },
};
