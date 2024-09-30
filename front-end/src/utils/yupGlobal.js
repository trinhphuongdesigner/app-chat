/* eslint-disable no-useless-escape */
import * as yup from 'yup';
// import yup from 'yup';

const REGEX_EMAIL = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
const REGEX_PASSWORD = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
const REGEX_VN_PHONE_NUMBER =
  /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
const REGEX_ONLY_NUMBER = /^\d+$/;
const MESS_REQUIRED = 'Không được bỏ trống';
const MESS_INVALID = 'Không hợp lệ';

function isValidPassword() {
  return this.min(8, 'Mật khẩu quá ngắn')
    .max(20, 'Mật khẩu quá dài')
    .matches(REGEX_PASSWORD, {
      message: MESS_INVALID,
      excludeEmptyStrings: true,
    })
    .required(MESS_REQUIRED);
}

yup.addMethod(yup.string, 'email', function (message) {
  return this.matches(REGEX_EMAIL, {
    message,
    excludeEmptyString: true,
  });
});

yup.addMethod(yup.string, 'isValidPassword', isValidPassword);

yup.addMethod(yup.string, 'phoneNumber', function (message) {
  return this.matches(REGEX_VN_PHONE_NUMBER, {
    message,
    excludeEmptyString: true,
  });
});

yup.addMethod(yup.string, 'onlyNumber', function (message) {
  return this.matches(REGEX_ONLY_NUMBER, {
    message,
    excludeEmptyString: true,
  });
});

export default yup;
