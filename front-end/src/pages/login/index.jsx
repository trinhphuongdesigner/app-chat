import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import InputValidation from 'components/Validation/Input';
import { handleErrorResponse, showSuccess } from 'utils';
import axiosClient from 'utils/axiosClient';
import { API, LOCATION, REFRESH_TOKEN, TOKEN } from 'utils/constants';
import yup from 'utils/yupGlobal';

import './index.scss';

const loginSchema = yup.object().shape({
  email: yup.string().isValidEmail(),

  password: yup.string().isValidPassword(),
});

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(loginSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;

      const response = await axiosClient.post(API.LOGIN, {
        email,
        password,
      });

      const { refreshToken, token } = response.data;

      localStorage.setItem(TOKEN, token);
      localStorage.setItem(REFRESH_TOKEN, refreshToken);

      showSuccess('Đăng nhập thành công');

      navigate(LOCATION.HOME);
    } catch (error) {
      handleErrorResponse(error, 'Đăng nhập không thành công');
    }
  };

  return (
    <div className="login-page">
      <div className="form">
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <InputValidation
            name="email"
            placeholder="Email"
            register={register}
            errors={errors}
          />

          <InputValidation
            type="password"
            name="password"
            placeholder="Password"
            register={register}
            errors={errors}
          />

          <button type="submit">Đăng nhập</button>

          <div className="link-action">
            <span>Chưa có tài khoản?</span>
            <Link to={LOCATION.REGISTER}>Tạo tài khoản</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
