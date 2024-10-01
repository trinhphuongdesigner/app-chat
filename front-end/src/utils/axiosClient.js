/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import axios from 'axios';
import { LOCATION, REFRESH_TOKEN, TOKEN } from 'utils/constants';
import { isTokenExpired, refreshAccessToken } from 'utils/token';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem(TOKEN);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    if (refreshToken && isTokenExpired(refreshToken)) {
      localStorage.removeItem(TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);

      window.location.href = LOCATION.FORM_LOGIN;

      return;
    }

    if (token && isTokenExpired(token)) {
      const { token, refreshToken } = await refreshAccessToken(refreshToken);

      if (token) {
        localStorage.setItem(TOKEN, token);
        localStorage.setItem(REFRESH_TOKEN, refreshToken);
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosClient;
