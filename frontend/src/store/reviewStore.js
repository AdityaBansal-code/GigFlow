import { create } from 'zustand';
import {
  createReview,
  getReviewsForUser,
  getReviewsForGig,
} from '../services/reviewService';

const useReviewStore = create((set) => ({
  reviews: [],
  isLoading: false,
  error: null,

  submitReview: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createReview(payload);
      set((state) => ({
        reviews: [response.data, ...state.reviews],
        isLoading: false,
        error: null,
      }));
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  fetchReviewsForUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getReviewsForUser(userId);
      set({ reviews: response.data || [], isLoading: false, error: null });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  fetchReviewsForGig: async (gigId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getReviewsForGig(gigId);
      set({ reviews: response.data || [], isLoading: false, error: null });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useReviewStore;
