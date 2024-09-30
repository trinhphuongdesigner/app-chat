import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import InputValidation from 'components/Validation/Input';
import axiosClient from 'utils/axiosClient';
import { API, LOCATION } from 'utils/constants';
import yup from 'utils/yupGlobal';

import './index.scss';

const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('Không được bỏ trống')
    .max(50, 'Họ được vượt quá 50 ký tự'),

  lastName: yup
    .string()
    .required('Không được bỏ trống')
    .max(50, 'Tên được vượt quá 50 ký tự'),

  email: yup
    .string()
    .required('Không được bỏ trống')
    .email('Email không hợp lệ'),

  phoneNumber: yup
    .string()
    .required('Không được bỏ trống')
    .email('Số điện thoại không hợp lệ'),

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

      const response = await axiosClient.post(API.REGISTER, {
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
      });

      console.log('🔥🔥🔥««««« response »»»»»🚀🚀🚀', response);

      navigate(LOCATION.LOGIN);
    } catch (error) {
      console.log('««««« error »»»»»', error);
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
            <span>Bạn đã đăng ký?</span>
            <Link to={LOCATION.REGISTER}>Đăng nhập</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
