import apiClient from '../utils/apiClient';
import { getErrorMessage } from '../utils/errorHandler';

export const getDashboard = async () => {
  try {
    const response = await apiClient.get('/api/dashboard');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
