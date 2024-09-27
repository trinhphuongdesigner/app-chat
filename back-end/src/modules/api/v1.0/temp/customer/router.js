const express = require('express');
const { processFormData } = require('../../../../services/s3');

const router = express.Router();

const {
  createCustomer,
  allCustomers,
  listCustomers,
  getDetailCustomer,
  editProfileCustomer,
  editAvatarCustomer,
  changePassword,
  deleteCustomer,
  deleteCustomers,
} = require('./controllers');

const {
  createCustomerSchema,
  editProfileCustomerSchema,
  passwordCustomerSchema,
} = require('./validation');

const {
  validateSchema,
  checkIdSchema,
  checkArrayIdSchema,
  checkAvatarSchema,
} = require('../../../../helpers');

router
  .route('/create')
  .post(
    processFormData.single('avatar'),
    validateSchema(checkAvatarSchema),
    validateSchema(createCustomerSchema),
    createCustomer,
  );

router.get('/all', allCustomers);
router.get('/list', listCustomers);
router
  .route('/delete/')
  .patch(validateSchema(checkArrayIdSchema), deleteCustomers);
router
  .route('/detail/:id')
  .get(validateSchema(checkIdSchema), getDetailCustomer)
  .patch(validateSchema(checkIdSchema), deleteCustomer);
router
  .route('/edit-profile/:id')
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(editProfileCustomerSchema),
    editProfileCustomer,
  );
router
  .route('/edit-avatar/:id')
  .patch(
    validateSchema(checkIdSchema),
    processFormData.single('avatar'),
    validateSchema(checkAvatarSchema),
    editAvatarCustomer,
  );
router
  .route('/change-password/:id')
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(passwordCustomerSchema),
    changePassword,
  );

module.exports = router;
