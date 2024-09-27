const express = require('express');

const router = express.Router();

const authRoutes = require('./auth/routes');
// const employeeAuthRoutes = require('./employeeAuth/routes');

router.use('/auth', authRoutes);
// router.route('/profile')
//   .get(
//     passport.authenticate('jwt', { session: false }),
//     getMe,
//   );

module.exports = router;
