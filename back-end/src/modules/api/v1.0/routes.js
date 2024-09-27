const express = require('express');
const {
  checkAuth,
  // checkEmployeeAuth,
  // checkOrganizationDeleted,
  // checkPermission,
} = require('./middleware');

const router = express.Router();

const mediaRoutes = require('./media/router');
const authRoutes = require('./auth/routes');
const userRoutes = require('./user/routes');

const roleRoutes = require('./role/routes');
const customerRoutes = require('./customer/router');
const categoryRoutes = require('./category/router');
const supplierRoutes = require('./supplier/router');

const employeeAuthRoutes = require('./employeeAuth/routes');
const employeeRouter = require('./employee/router');
const productRouter = require('./product/router');
const orderRouter = require('./order/router');

router.use('/auth', authRoutes);
router.use('/employee-auth', employeeAuthRoutes);

// require user auth
router.use('/users', checkAuth, userRoutes);

// require employee auth
router.use('/employees', employeeRouter);
router.use('/products', productRouter);
router.use('/orders', orderRouter);
// router.use(
//   '/employees',
//   checkEmployeeAuth,
//   checkOrganizationDeleted,
//   employeeRoutes,
// );
// router.use('/roles', checkEmployeeAuth, checkOrganizationDeleted, roleRoutes);
router.use('/roles', roleRoutes);
router.use('/customers', customerRoutes);
router.use('/categories', categoryRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/medias', mediaRoutes);

module.exports = router;
