const express = require('express');
const passport = require('passport');

const router = express.Router();

// const { validateSchema } = require('../../utils');
const {
  loginSchema,
} = require('./validations');
const {
  login,
  checkRefreshToken,
  getMe,
} = require('./controllers');
const { validateSchema } = require('../../../../helpers');

router.route('/login')
  .post(
    validateSchema(loginSchema), // Kiểm tra cơ bản
    passport.authenticate('local', { session: false }), // passportVerifyAccount => Kiểm tra tk và mk hợp lệ
    login,
  );

router.route('/refresh-token')
  .post(checkRefreshToken);

router.route('/profile')
  .get(
    passport.authenticate('jwt', { session: false }),
    getMe,
  );

module.exports = router;
