import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export function isTokenExpired(token) {
  const decoded = jwtDecode(token);
  const expiration = decoded.exp * 1000; // Convert expiration time to milliseconds
  return Date.now() >= expiration;
}

export async function refreshAccessToken(refreshToken) {
  // Send the refresh token to the backend to get a new access token
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BASE_URL_ADMIN}/auth/refresh-token`,
      { refreshToken },
    );

    const { token } = res.data;

    if (token) {
      localStorage.setItem('TOKEN', token);

      return token;
    }
    throw new Error('Token refresh failed');
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}
