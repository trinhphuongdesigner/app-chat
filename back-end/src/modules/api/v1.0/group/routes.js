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
const { checkUpdate } = require('./middleware');

router.route('/').get(getGroups);

router.route('/create').post(validateSchema(checkCreateGroupSchema), createGroup);

router.route('/update/name/:id').post(validateSchema(checkUpdateGroupNameSchema), checkUpdate, updateGroupName);

router.route('/update/users/:id').post(validateSchema(checkUpdateGroupUsersSchema), checkUpdate, updateMember);

router.route('/delete/:id').delete(validateSchema(checkDeleteGroupSchema), checkUpdate, deleteGroup);

module.exports = router;
