const JWT = require('jsonwebtoken');

// const { Customer, Order } = require('../../models');
const jwtSettings = require('../../../../constants/jwtSetting');
const { generateUserToken, generateUserRefreshToken } = require('../../../../services/jwt');

module.exports = {
  login: async (req, res) => {
    try {
      const {
        _id,
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        birthday,
        updatedAt,
      } = req.user;

      const token = generateUserToken({
        _id,
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        birthday,
        updatedAt,
      });
      const refreshToken = generateUserRefreshToken(_id);

      return res.status(200).json({
        token,
        refreshToken,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  checkRefreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      JWT.verify(refreshToken, jwtSettings.SECRET, async (err, payload) => {
        if (err) {
          return res.status(401).json({
            message: 'refreshToken is invalid',
          });
        }
        const { id } = payload;

        const customer = await Customer.findOne({
          _id: id,
          isDeleted: false,
        }).select('-password').lean();

        if (customer) {
          const {
            _id,
            firstName,
            lastName,
            phoneNumber,
            address,
            email,
            birthday,
            updatedAt,
          } = customer;

          const token = generateUserToken({
            _id,
            firstName,
            lastName,
            phoneNumber,
            address,
            email,
            birthday,
            updatedAt,
          });

          return res.status(200).json({ token });
        }
        return res.sendStatus(401);
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      res.status(400).json({
        statusCode: 400,
        message: 'Lỗi',
      });
    }
  },

  basicLogin: async (req, res) => {
    try {
      const token = generateUserToken(req.user);
      const refreshToken = generateUserRefreshToken(req.user._id);

      res.json({
        token,
        refreshToken,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      res.sendStatus(400);
    }
  },

  getMe: async (req, res) => {
    try {
      res.status(200).json({
        message: 'Lấy thông tin người dùng thành công',
        payload: req.user,
      });
    } catch (err) {
      res.sendStatus(500);
    }
  },

  getMyOrder: async (req, res) => {
    try {
      const orders = await Order.find({ employeeId: req.user._id });

      return res.status(200).json({
        message: 'Lấy thông tin người dùng thành công',
        payload: orders,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      res.sendStatus(500);
    }
  },
};
