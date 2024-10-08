/* eslint-disable no-template-curly-in-string */
const yup = require('yup');
const { ObjectId } = require('mongodb');

module.exports = {
  checkGroupIdSchema: yup.object({
    params: yup.object({
      groupId: yup.string().required().test('validationUserID', 'ID sai định dạng', value => ObjectId.isValid(value)),
    }),
  }),

  checkCreateSchema: yup.object({
    params: yup.object({
      groupId: yup.string().required().test('validationUserID', 'ID sai định dạng', value => ObjectId.isValid(value)),
    }),

    body: yup.object({
      message: yup.string().required().max(50, 'Tin nhắn vượt quá 255 ký tự'),
    }),
  }),
};
