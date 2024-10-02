const express = require('express');
const passport = require('passport');

const router = express.Router();

const authRoutes = require('./auth/routes');
const userRoutes = require('./user/routes');
const groupRoutes = require('./group/routes');

router.use('/auth', authRoutes);
router.use('/user', passport.authenticate('jwt', { session: false }), userRoutes);
router.use('/group', passport.authenticate('jwt', { session: false }), groupRoutes);

module.exports = router;
