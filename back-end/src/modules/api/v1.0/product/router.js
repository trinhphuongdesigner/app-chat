const express = require('express');
const { processFormData } = require('../../../../services/s3');
const { mergeImages } = require('../middleware');

const router = express.Router();

const {
  createProduct,
  createProductList,
  allProduct,
  detailProduct,
  searchProduct,
  updateProduct,
  restoreProduct,
  deleteSoftProduct,
  deleteSoftProductSelected,
} = require('./controllers');

const {
  mediaProductSchema,
  productSchema,
  createProductListSchema,
  searchProductSchema,
} = require('./validation');

const {
  validateSchema,
  checkIdSchema,
  checkArrayIdSchema,
} = require('../../../../helpers');

router.route('/create').post(
  validateSchema(mediaProductSchema),
  processFormData.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'imageFiles', maxCount: 6 },
  ]),
  mergeImages,
  validateSchema(productSchema),
  createProduct,
);

router
  .route('/creates')
  .post(validateSchema(createProductListSchema), createProductList);

router.get('/all', validateSchema(searchProductSchema), allProduct);

router.get('/search', validateSchema(searchProductSchema), searchProduct);

router.patch(
  '/deleteSoftProductSelected',
  validateSchema(checkArrayIdSchema),
  deleteSoftProductSelected,
);

router
  .route('/:id')
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(mediaProductSchema),
    processFormData.fields([
      { name: 'coverImage', maxCount: 1 },
      { name: 'imageFiles', maxCount: 6 },
    ]),
    mergeImages,
    validateSchema(productSchema),
    updateProduct,
  )
  .get(validateSchema(checkIdSchema), detailProduct);

router.patch('/restore/:id', validateSchema(checkIdSchema), restoreProduct);

router.patch(
  '/deleteSoftProduct/:id',
  validateSchema(checkIdSchema),
  deleteSoftProduct,
);

module.exports = router;
