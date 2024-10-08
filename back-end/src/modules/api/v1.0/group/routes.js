const express = require('express');

const router = express.Router();

const {
  getGroups,
  createGroup,
  updateGroupName,
  updateMember,
  deleteGroup,
} = require('./controllers');

const {
  checkCreateGroupSchema,
  checkUpdateGroupNameSchema,
  checkUpdateGroupUsersSchema,
  checkDeleteGroupSchema,
} = require('./validations');
const { validateSchema } = require('../../../../helpers');

router.route('/').get(getGroups);

router.route('/create').post(validateSchema(checkCreateGroupSchema), createGroup);

router.route('/update/name/:id').post(validateSchema(checkUpdateGroupNameSchema), updateGroupName);

router.route('/update/users/:id').post(validateSchema(checkUpdateGroupUsersSchema), updateMember);

router.route('/:id').delete(validateSchema(checkDeleteGroupSchema), deleteGroup);

module.exports = router;
