const express = require('express');

const router = express.Router();

const {
  getGroups,
  createGroup,
  // updateGroup,
  // deleteGroup,
} = require('./controllers');

const {
  checkCreateGroupSchema,
} = require('./validations');
const { validateSchema } = require('../../../../helpers');

router.route('/').get(getGroups);

router.route('/create').post(validateSchema(checkCreateGroupSchema), createGroup);

// router.route('/:id')
//   .put(updateGroup)
//   .delete(deleteGroup);

module.exports = router;
