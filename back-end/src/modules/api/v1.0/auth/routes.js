const express = require('express');
const passport = require('passport');

const router = express.Router();
const {
  registerSchema,
  loginSchema,
} = require('./validations');
const {
  register,
  login,
  checkRefreshToken,
} = require('./controllers');
const { validateSchema } = require('../../../../helpers');

router.route('/register')
  .post(
    validateSchema(registerSchema), // Kiểm tra cơ bản
    register,
  );

router.route('/login')
  .post(
    validateSchema(loginSchema), // Kiểm tra cơ bản
    passport.authenticate('local', { session: false }), // passportVerifyAccount => Kiểm tra tk và mk hợp lệ
    login,
  );

router.route('/refresh-token')
  .post(checkRefreshToken);

module.exports = router;
