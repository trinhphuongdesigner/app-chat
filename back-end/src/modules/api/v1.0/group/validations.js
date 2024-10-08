/* eslint-disable no-template-curly-in-string */
const yup = require('yup');
const { ObjectId } = require('mongodb');

module.exports = {
  checkCreateGroupSchema: yup.object({
    body: yup.object({
      name: yup.string().required().max(50, 'Tên nhóm vượt quá 50 ký tự'),

      users: yup.array().of(
        yup.string().required()
          .test('validationUserID', 'ID sai định dạng', value => ObjectId.isValid(value)),
      ),

    }),
  }),

  checkUpdateGroupNameSchema: yup.object({
    params: yup.object({
      id: yup.string().required().test('validationUserID', 'ID sai định dạng', value => ObjectId.isValid(value)),
    }),

    body: yup.object({
      name: yup.string().required().max(50, 'Tên nhóm vượt quá 50 ký tự'),
    }),
  }),

  checkUpdateGroupUsersSchema: yup.object({
    params: yup.object({
      id: yup.string().required().test('validationUserID', 'ID sai định dạng', value => ObjectId.isValid(value)),
    }),

    body: yup.object({
      users: yup.array().of(
        yup.string().required()
          .test('validationUserID', 'ID sai định dạng', value => ObjectId.isValid(value)),
      ),
    }),
  }),

  checkDeleteGroupSchema: yup.object({
    params: yup.object({
      id: yup.string().required().test('validationUserID', 'ID sai định dạng', value => ObjectId.isValid(value)),
    }),
  }),
};
