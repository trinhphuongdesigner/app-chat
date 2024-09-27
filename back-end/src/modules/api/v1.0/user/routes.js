const express = require('express');

const router = express.Router();

const {
  updateUserInfo,
  getUserInfo,
  changePassword,
  updateAvatar,
} = require('./controllers');

const {
  checkUpdateInfo,
  checkChangePassword,
} = require('./validations');

router.route('/me')
  .get(getUserInfo)
  .put(checkUpdateInfo, updateUserInfo);

router.route('/me/password')
  .put(checkChangePassword, changePassword);

router.route('/me/avatar')
  .put(updateAvatar);

module.exports = router;
