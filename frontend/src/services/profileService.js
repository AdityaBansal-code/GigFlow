import apiClient from '../utils/apiClient';
import { getErrorMessage } from '../utils/errorHandler';

export const getProfile = async (userId) => {
  try {
    const response = await apiClient.get(`/api/profile/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getMyProfileStats = async () => {
  try {
    const response = await apiClient.get('/api/profile/me/stats');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateProfile = async (payload) => {
  try {
    const response = await apiClient.patch('/api/profile/me', payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
