const express = require('express');

const router = express.Router();

const {
  getMessages,
  createMessage,
} = require('./controllers');

const {
  checkGroupIdSchema,
  checkCreateSchema,
} = require('./validations');
const { validateSchema } = require('../../../../helpers');
const { validationUserGroup } = require('./middleware');

router.route('/:groupId').get(validateSchema(checkGroupIdSchema), validationUserGroup, getMessages);

router.route('/:groupId/create').post(validateSchema(checkCreateSchema), createMessage);

module.exports = router;
