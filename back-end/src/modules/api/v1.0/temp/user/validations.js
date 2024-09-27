const { check } = require('express-validator');

module.exports = {
  checkUpdateInfo: [
    check('firstName')
      .trim().not().isEmpty()
      .withMessage('Tên không được để trống')
      .isLength({ max: 150 })
      .withMessage('Tên chỉ được nhập tối đa 150 kí tự')
      .custom((value) => {
        if (!value || /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹý ]+$/.test(value)) {
          return true;
        }
        throw new Error('Tên không thể chứa kí tự đặc biệt');
      }),
    check('lastName').trim().isLength({ max: 150 }).withMessage('Tên chỉ được nhập tối đa 150 kí tự')
      .custom((value) => {
        if (!value || /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹý ]+$/.test(value)) {
          return true;
        }
        throw new Error('Tên không thể chứa kí tự đặc biệt');
      }),
    check('middleName').trim().isLength({ max: 150 }).withMessage('Tên chỉ được nhập tối đa 150 kí tự')
      .custom((value) => {
        if (!value || /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹý ]+$/.test(value)) {
          return true;
        }
        throw new Error('Tên không thể chứa kí tự đặc biệt');
      }),
  ],
  checkChangePassword: [
    check('password').not().isEmpty().withMessage('Mật khẩu không được để trống')
      .isString()
      .withMessage('Mật khẩu không hợp lệ')
      .custom((value) => {
        if (!/\s/g.test(value)) {
          return true;
        }
        throw new Error('Mật khẩu không được chứa kí tự trống');
      }),
    check('newPassword').not().isEmpty().withMessage('Mật khẩu mới không được để trống')
      .isString()
      .withMessage('Mật khẩu mới không hợp lệ')
      .isLength({ min: 6 })
      .withMessage('Mật khẩu phải có tối thiểu 6 kí tự')
      .custom((value) => {
        if (!/\s/g.test(value)) {
          return true;
        }
        throw new Error('Mật khẩu mới không được chứa kí tự trống');
      }),
    check('confirmPassword', 'Mật khẩu xác thực không khớp').custom((value, { req }) => (req.body.newPassword === value)),
  ],
};
