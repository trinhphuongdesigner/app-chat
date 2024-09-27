const express = require('express');
const { processFormData } = require('../../../../../services/s3');

const router = express.Router();

const {
  createSupplier,
  allSuppliers,
  listSuppliers,
  getDetailSupplier,
  editProfileSupplier,
  editAvatarSupplier,
  deleteSupplier,
  deleteSuppliers,
} = require('./controllers');

const { supplierSchema } = require('./validation');

const {
  validateSchema,
  checkIdSchema,
  checkArrayIdSchema,
  checkAvatarSchema,
} = require('../../../../../helpers');

router
  .route('/create')
  .post(
    processFormData.single('avatar'),
    validateSchema(checkAvatarSchema),
    validateSchema(supplierSchema),
    createSupplier,
  );

router.get('/all', allSuppliers);
router.get('/list', listSuppliers);
router
  .route('/delete/')
  .patch(validateSchema(checkArrayIdSchema), deleteSuppliers);
router
  .route('/detail/:id')
  .get(validateSchema(checkIdSchema), getDetailSupplier)
  .patch(validateSchema(checkIdSchema), deleteSupplier);
router
  .route('/edit-profile/:id')
  .patch(validateSchema(checkIdSchema), editProfileSupplier);
router
  .route('/edit-avatar/:id')
  .patch(
    validateSchema(checkIdSchema),
    processFormData.single('avatar'),
    validateSchema(checkAvatarSchema),
    editAvatarSupplier,
  );

module.exports = router;
