import apiClient from '../utils/apiClient';
import { getErrorMessage } from '../utils/errorHandler';

export const getAllGigs = async (search = '') => {
  try {
    const params = search ? { search } : {};
    const response = await apiClient.get('/api/gigs', { params });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createGig = async (title, description, budget) => {
  try {
    const response = await apiClient.post('/api/gigs', {
      title,
      description,
      budget,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getGigById = async (id) => {
  try {
    const response = await apiClient.get(`/api/gigs/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
