import apiClient from '../utils/apiClient';
import { getErrorMessage } from '../utils/errorHandler';

export const createBid = async (gigId, message, price) => {
  try {
    const response = await apiClient.post('/api/bids', {
      gigId,
      message,
      price,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getBidsByGig = async (gigId) => {
  try {
    const response = await apiClient.get(`/api/bids/${gigId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const hireFreelancer = async (bidId) => {
  try {
    const response = await apiClient.patch(`/api/bids/${bidId}/hire`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
