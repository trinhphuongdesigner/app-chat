const express = require('express');

const router = express.Router();

const {
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
} = require('./controllers');

const {
  updateUserSchema,
  updatePasswordSchema,
} = require('./validations');

router.route('/').get(getGroups);

router.route('/create').post(createGroup);

router.route('/:id')
  .put(updateGroup)
  .delete(deleteGroup);

module.exports = router;
