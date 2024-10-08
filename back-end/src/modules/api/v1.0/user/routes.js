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
const { validateSchema } = require('../../../../helpers');

router.route('/me')
  .get(getMyInfo)
  .put(validateSchema(updateUserSchema), updateMyInfo);

router.route('/me/password')
  .put(validateSchema(updatePasswordSchema), changePassword);

router.route('/me/avatar')
  .put(updateAvatar);

module.exports = router;
