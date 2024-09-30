import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import InputValidation from 'components/Validation/Input';
import axiosClient from 'utils/axiosClient';
import { API, LOCATION, REFRESH_TOKEN, TOKEN } from 'utils/constants';
import yup from 'utils/yupGlobal';

import './index.scss';

const loginSchema = yup.object().shape({
  email: yup.string().required('Required').email('Email không hợp lệ'),

  pass: yup.string().required('Required'),
});

function Login() {
  const {
    register,
    handleSubmit,
    // setValue,
    // getValues,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(loginSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const { email, pass } = data;
      const response = await axiosClient.post(API.LOGIN, {
        email,
        password: pass,
      });

      const { refreshToken, token } = response.data;

      localStorage.setItem(TOKEN, token);
      localStorage.setItem(REFRESH_TOKEN, refreshToken);
      navigate(LOCATION.HOME);
    } catch (error) {
      console.log('««««« error »»»»»', error);
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
            name="pass"
            placeholder="Password"
            register={register}
            errors={errors}
          />

          <button type="submit" id="submit">
            LOGIN
          </button>

          <div className="link-action">
            <span>Not registered? </span>
            <Link to={LOCATION.REGISTER}>Create an account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
