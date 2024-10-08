import axios from 'axios';
import { LOCATION, REFRESH_TOKEN, TOKEN } from 'utils/constants';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export function isTokenExpired(token) {
  const decoded = jwtDecode(token);
  const expiration = decoded.exp * 1000; // Convert expiration time to milliseconds
  return Date.now() >= expiration;
}

export async function refreshAccessToken(refreshT) {
  // Send the refresh token to the backend to get a new access token
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/auth/refresh-token`,
      { refreshToken: refreshT },
    );

    const { token, refreshToken } = res.data;

    if (token && refreshToken) {
      return { token, refreshToken };
    }

    localStorage.removeItem(TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    Navigate(LOCATION.LOGIN);

    throw new Error('Token refresh failed');
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}
