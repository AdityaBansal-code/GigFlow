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

export const getAllGigsWithFilters = async ({
  search = '',
  category = '',
  difficulty = '',
  sortBy = '',
} = {}) => {
  try {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (difficulty) params.difficulty = difficulty;
    if (sortBy) params.sortBy = sortBy;

    const response = await apiClient.get('/api/gigs', { params });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createGig = async (title, description, budget, extraFields = {}) => {
  try {
    const response = await apiClient.post('/api/gigs', {
      title,
      description,
      budget,
      ...extraFields,
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

export const updateGig = async (id, payload) => {
  try {
    const response = await apiClient.patch(`/api/gigs/${id}`, payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteGig = async (id) => {
  try {
    const response = await apiClient.delete(`/api/gigs/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
