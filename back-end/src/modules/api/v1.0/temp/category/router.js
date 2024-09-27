const express = require('express');
const { processFormData } = require('../../../../services/s3');
const {
  validateSchema,
  checkIdSchema,
  checkArrayIdSchema,
} = require('../../../../helpers');
const {
  createCategory,
  allCategories,
  listCategories,
  getDetailCategory,
  editCategory,
  deleteCategory,
  deleteCategories,
} = require('./controllers');
const { coverImageSchema, categorySchema } = require('./validation');

const router = express.Router();

router
  .route('/create')
  .post(
    validateSchema(coverImageSchema),
    processFormData.single('coverImage'),
    validateSchema(categorySchema),
    createCategory,
  );

router.get('/all', allCategories);
router.get('/list', listCategories);
router
  .route('/delete/')
  .patch(validateSchema(checkArrayIdSchema), deleteCategories);
router
  .route('/detail/:id')
  .get(validateSchema(checkIdSchema), getDetailCategory)
  .patch(validateSchema(checkIdSchema), deleteCategory);
router
  .route('/edit/:id')
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(coverImageSchema),
    processFormData.single('coverImage'),
    validateSchema(categorySchema),
    editCategory,
  );

module.exports = router;
