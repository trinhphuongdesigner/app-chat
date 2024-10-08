/* eslint-disable no-template-curly-in-string */
const yup = require('yup');
const { ObjectId } = require('mongodb');

module.exports = {
  checkCreateGroupSchema: yup.object({
    body: yup.object({
      name: yup.string().required().max(50, 'Tên nhóm vượt quá 50 ký tự'),

      users: yup.array().of(
        yup.string()
          .test('validationUserID', 'ID sai định dạng', value => ObjectId.isValid(value)),
      ),

    }),
  }),
};
