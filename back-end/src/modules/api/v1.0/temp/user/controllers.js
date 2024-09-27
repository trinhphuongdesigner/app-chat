const { User } = require('../../../../models');
const {
  apiErrors, apiResponse,
} = require('../../../../helpers');

const s3Service = require('../../../../services/s3');

// const perPage = 20;

module.exports = {
  // getUsers: async (req, res, next) => {
  //   try {
  //     const { q, page } = req.query;
  //     const currentPage = Math.ceil((!page || page <= 0) ? 1 : +page);

  //     const conditionFind = {
  //       _id: { $nin: [req.user.id] },
  //       // isBlocked: false,
  //     };

  //     if (q) {
  //       const search = fuzzySearch(q);

  //       conditionFind.$or = [
  //         { firstName: search },
  //         { lastName: search },
  //       ];
  //     }

  //     const users = await User
  //       .find(conditionFind)
  //       .select('firstName lastName avatar birthday')
  //       .sort({ firstName: 1, lastName: 1 })
  //       .skip(perPage * (currentPage - 1))
  //       .limit(perPage)
  //       .lean();

  //     res.json(apiResponse({ users }));
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  getUserInfo: async (req, res, next) => {
    try {
      const user = await User
        .findById(req.user.id)
        .select('-password -resetPasswordToken -resetPasswordExpires')
        .lean();

      user.accountType = 'USER';
      return res.json(apiResponse({ payload: user }));
    } catch (error) {
      next(error);
    }
  },

  updateUserInfo: async (req, res, next) => {
    try {
      const {
        firstName, middleName, lastName,
      } = req.body;
      const { id: userId } = req.user;

      const user = await User
        .findByIdAndUpdate(userId, {
          firstName, middleName, lastName,
        }, { new: true })
        .select('-password -resetPasswordToken -resetPasswordExpires')
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
