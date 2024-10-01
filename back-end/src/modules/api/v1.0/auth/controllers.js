const JWT = require('jsonwebtoken');
const jwtSettings = require('../../../../constants/jwtSetting');
const { User } = require('../../../../models');
const { generateUserToken, generateUserRefreshToken } = require('../../../../services/jwt');

module.exports = {
  register: async (req, res) => {
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
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  login: async (req, res) => {
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

      return res.status(200).json({
        token,
        refreshToken,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  checkRefreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      JWT.verify(refreshToken, jwtSettings.JWT_SECRET, async (err, payload) => {
        if (err) {
          return res.status(401).json({
            message: 'refreshToken is invalid',
          });
        }
        const { id } = payload;

        const user = await User.findOne({
          _id: id,
          isActive: true,
        }).select('-password').lean();

        if (user) {
          const {
            _id,
            firstName,
            lastName,
            phoneNumber,
            email,
          } = user;

          const token = generateUserToken({
            _id,
            firstName,
            lastName,
            phoneNumber,
            email,
          });

          return res.status(200).json({ token });
        }
        return res.status(401).json({
          message: 'refreshToken is invalid',
        });
      });
    } catch (err) {
      res.status(400).json({
        statusCode: 400,
        message: err,
      });
    }
  },

  getMe: async (req, res) => {
    console.log('🔥🔥🔥««««« helooooooooooooo »»»»»🚀🚀🚀');
    try {
      res.status(200).json({
        message: 'Lấy thông tin người dùng thành công',
        payload: req.user,
      });
    } catch (err) {
      console.log('🔥🔥🔥««««« err »»»»»🚀🚀🚀', err);
      res.sendStatus(500);
    }
  },
};
