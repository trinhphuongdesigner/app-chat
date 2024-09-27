const express = require('express');

const router = express.Router();

const {
  // getUsers,
  updateUserInfo,
  getUserInfo,
  changePassword,
  updateAvatar,
} = require('./controllers');

const {
  checkUpdateInfo,
  checkChangePassword,
} = require('./validations');

const { handleValidate } = require('../middleware');

router.route('/me')
  .get(getUserInfo)
  .put(checkUpdateInfo, handleValidate, updateUserInfo);

router.route('/me/password')
  .put(checkChangePassword, handleValidate, changePassword);

router.route('/me/avatar')
  .put(updateAvatar);

module.exports = router;
