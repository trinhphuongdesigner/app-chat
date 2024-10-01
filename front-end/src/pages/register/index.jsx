import React from 'react';
import InputValidation from 'components/Validation/Input';
import axiosClient from 'utils/axiosClient';
import yup from 'utils/yupGlobal';
import { API, LOCATION } from 'utils/constants';
import { Link, useNavigate } from 'react-router-dom';
import { handleErrorResponse } from 'utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import './index.scss';

const registerSchema = yup.object().shape({
  firstName: yup.string().isValidName('Họ'),

  lastName: yup.string().isValidName('Tên'),

  email: yup.string().isValidEmail(),

  phoneNumber: yup.string().isValidVNPhoneNumber(),

  password: yup.string().isValidPassword(),

  rePassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp'),
});

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(registerSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const { firstName, lastName, email, password, phoneNumber } = data;

      await axiosClient.post(API.REGISTER, {
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
      });

      navigate(LOCATION.LOGIN);
    } catch (error) {
      handleErrorResponse(error, 'Đăng ký không thành công');
    }
  };

  return (
    <div className="register-page">
      <div className="form">
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          <InputValidation
            name="firstName"
            placeholder="Họ"
            register={register}
            errors={errors}
          />

          <InputValidation
            name="lastName"
            placeholder="Tên"
            register={register}
            errors={errors}
          />

          <InputValidation
            name="phoneNumber"
            placeholder="Số điện thoại"
            register={register}
            errors={errors}
          />

          <InputValidation
            name="email"
            placeholder="Email"
            register={register}
            errors={errors}
          />

          <InputValidation
            type="password"
            name="password"
            placeholder="Mật khẩu"
            register={register}
            errors={errors}
          />

          <InputValidation
            type="password"
            name="rePassword"
            placeholder="Nhập lại mật khẩu"
            register={register}
            errors={errors}
          />

          <button type="submit">Đăng ký</button>

          <div className="link-action">
            <span>Bạn đã có tài khoản?</span>
            <Link to={LOCATION.LOGIN}>Đăng nhập</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
