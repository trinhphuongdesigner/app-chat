const express = require('express');

const router = express.Router();

const {
  createEmployee,
  getAllEmployee,
  getDetailEmployee,
  searchEmployee,
  updateEmployeeProfile,
  changePassword,
  resetPassword,
  restoreEmployee,
  deleteSoftEmployee,
  deleteSoftEmployeeSelected,
} = require('./controllers');

const {
  createEmployeeSchema,
  searchEmployeeSchema,
  updateEmployeeProfileSchema,
  changePasswordEmployeeSchema,
  resetPasswordEmployeeSchema,
} = require('./validation');

const {
  validateSchema,
  checkIdSchema,
  checkArrayIdSchema,
} = require('../../../../helpers');

router.post(
  '/create',
  validateSchema(createEmployeeSchema),
  createEmployee,
);

router.get('/all', getAllEmployee);

router.get('/search', validateSchema(searchEmployeeSchema), searchEmployee);

router.patch(
  '/deleteSoftEmployeeSelected',
  validateSchema(checkArrayIdSchema),
  deleteSoftEmployeeSelected,
);

router
  .route('/:id')
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(updateEmployeeProfileSchema),
    updateEmployeeProfile,
  )
  .get(validateSchema(checkIdSchema), getDetailEmployee);

router.patch(
  '/changePassword/:id',
  validateSchema(checkIdSchema),
  validateSchema(changePasswordEmployeeSchema),
  changePassword,
);

router.patch(
  '/resetPassword/:id',
  validateSchema(checkIdSchema),
  validateSchema(resetPasswordEmployeeSchema),
  resetPassword,
);

router.patch('/restore/:id', validateSchema(checkIdSchema), restoreEmployee);

router.patch(
  '/deleteSoftEmployee/:id',
  validateSchema(checkIdSchema),
  deleteSoftEmployee,
);

module.exports = router;
