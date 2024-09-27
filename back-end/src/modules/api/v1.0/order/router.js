const express = require('express');

const router = express.Router();

const {
  createOrder,
  getAllOrder,
  getDetailOrder,
  searchOrder,
  updateOrder,
  rejectOrder,
} = require('./controllers');

const {
  createOrderSchema,
  getOrderSchema,
  searchOrderSchema,
  updateOrderSchema,
} = require('./validation');

const { validateSchema, checkIdSchema } = require('../../../../helpers');

router.post('/create',
  validateSchema(createOrderSchema),
  createOrder);

router.get('/all', validateSchema(getOrderSchema), getAllOrder);

router.get('/search', validateSchema(searchOrderSchema), searchOrder);

router
  .route('/:id')
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(updateOrderSchema),
    updateOrder,
  )
  .get(validateSchema(checkIdSchema), getDetailOrder);

router.patch(
  '/rejectOrder/:id',
  validateSchema(checkIdSchema),
  rejectOrder,
);

module.exports = router;
