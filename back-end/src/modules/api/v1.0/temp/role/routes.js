const express = require('express');

const router = express.Router();

const {
  createRole,
  getAllRoles,
  getPermissions,
  listRoles,
  getDetailRole,
  editRole,
  deleteRole,
  deleteRoles,
} = require('./controllers');
const { validateSchema, checkIdSchema } = require('../../../../../helpers');

const { roleSchema, checkArrayIdSchema } = require('./validations');

router.route('/permissions').get(getPermissions);
router
  .route('/create')
  .post(validateSchema(roleSchema), createRole);

router.get('/list', listRoles);
router.get('/all', getAllRoles);

router
  .route('/detail/:id')
  .get(validateSchema(checkIdSchema), getDetailRole)
  .patch(validateSchema(checkIdSchema), deleteRole);

router.route('/delete').patch(validateSchema(checkArrayIdSchema), deleteRoles);

router
  .route('/edit/:id')
  .patch(validateSchema(checkIdSchema), editRole);
module.exports = router;
