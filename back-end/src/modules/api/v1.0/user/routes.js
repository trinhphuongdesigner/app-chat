const express = require('express');

const router = express.Router();

const {
  updateMyInfo,
  getMyInfo,
  changePassword,
  updateAvatar,
} = require('./controllers');

const {
  updateUserSchema,
  updatePasswordSchema,
} = require('./validations');

router.route('/me')
  .get(getMyInfo)
  .put(updateUserSchema, updateMyInfo);

router.route('/me/password')
  .put(updatePasswordSchema, changePassword);

router.route('/me/avatar')
  .put(updateAvatar);

module.exports = router;
