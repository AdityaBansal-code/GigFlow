import apiClient from '../utils/apiClient';
import { getErrorMessage } from '../utils/errorHandler';

export const register = async (name, email, password) => {
  try {
    const response = await apiClient.post('/api/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const logout = async () => {
  try {
    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
