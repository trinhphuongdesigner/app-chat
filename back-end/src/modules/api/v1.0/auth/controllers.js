const JWT = require('jsonwebtoken');
const jwtSettings = require('../../../../constants/jwtSetting');
const { User } = require('../../../../models');
const { generateUserToken, generateUserRefreshToken } = require('../../../../services/jwt');

module.exports = {
  register: async (req, res, next) => {
    try {
      const {
        email,
        firstName,
        lastName,
        password,
        phoneNumber,
      } = req.body;

      const existUser = await User.findOne({
        email,
      }).select('-password');

      if (existUser) {
        return res.send(409, {
          message: 'Tài khoản đã tồn tại',
        });
      }

      const newUser = new User({
        email,
        firstName,
        lastName,
        password,
        phoneNumber,
      });

      const payload = await newUser.save();

      return res.send(200, {
        payload,
        message: 'Đăng kí thành công',
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const {
        _id,
        firstName,
        lastName,
        phoneNumber,
        email,
      } = req.user;

      const token = generateUserToken({
        _id,
        firstName,
        lastName,
        phoneNumber,
        email,
      });
      const refreshToken = generateUserRefreshToken(_id);

      await User.findByIdAndUpdate(_id, { refreshToken }, { new: true });

      return res.status(200).json({
        token,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  },

  checkRefreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      JWT.verify(refreshToken, jwtSettings.JWT_SECRET, async (error, payload) => {
        if (error) {
          return res.status(401).json({
            message: 'refreshToken is invalid',
          });
        }

        const { id } = payload;

        const user = await User.findOne({
          _id: id,
          isActive: true,
          refreshToken,
        }).select('-password').lean();

        if (user) {
          const {
            _id,
            firstName,
            lastName,
            phoneNumber,
            email,
          } = user;

          const newToken = generateUserToken({
            _id,
            firstName,
            lastName,
            phoneNumber,
            email,
          });

          const newRefreshToken = generateUserRefreshToken(_id);

          await User.findByIdAndUpdate(_id, { newRefreshToken }, { new: true });

          return res.status(200).json({ token: newToken, refreshToken: newRefreshToken });
        }

        return res.status(401).json({
          message: 'refreshToken is invalid',
        });
      });
    } catch (error) {
      next(error);
    }
  },
};
