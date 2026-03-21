import apiClient from '../utils/apiClient';
import { getErrorMessage } from '../utils/errorHandler';

export const createReview = async (payload) => {
  try {
    const response = await apiClient.post('/api/reviews', payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getReviewsForUser = async (userId) => {
  try {
    const response = await apiClient.get(`/api/reviews/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getReviewsForGig = async (gigId) => {
  try {
    const response = await apiClient.get(`/api/reviews/gig/${gigId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
