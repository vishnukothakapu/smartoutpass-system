import api from './index';

/**
 * Email + Password login (Warden / Security) — returns { token, user }
 */
export const loginApi = async (role, email, password) => {
  const { data } = await api.post('/auth/login', { role, email, password });
  return data;
};

/**
 * Google OAuth login (Students only) — returns { token, user }
 * @param {string} credential — Google ID token returned by @react-oauth/google
 */
export const googleLoginApi = async (credential) => {
  const { data } = await api.post('/auth/google', { credential });
  return data;
};
