const express = require('express');
const { processFormData } = require('../../../../services/s3');
const {
  validateSchema,
  checkIdSchema,
  checkArrayIdSchema,
} = require('../../../../helpers');
const {
  uploadSingleMedia,
  uploadMultipleMedias,
  allMedias,
  listMedias,
  detailMedia,
  deleteMedia,
  deleteMedias,
} = require('./controller');
const { mediaSchema, imageSchema, imagesSchema } = require('./validation');

const router = express.Router();

router
  .route('/create-single')
  .post(
    processFormData.single('image'),
    validateSchema(imageSchema),
    validateSchema(mediaSchema),
    uploadSingleMedia,
  );

router
  .route('/create-multiple')
  .post(
    processFormData.array('images', 8),
    validateSchema(imagesSchema),
    validateSchema(mediaSchema),
    uploadMultipleMedias,
  );
router.get('/all', allMedias);
router.get('/list', listMedias);
router
  .route('/delete')
  .delete(validateSchema(checkArrayIdSchema), deleteMedias);

router
  .route('/detail/:id')
  .get(validateSchema(checkIdSchema), detailMedia)
  .delete(validateSchema(checkIdSchema), deleteMedia);

module.exports = router;
