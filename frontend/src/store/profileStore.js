import { create } from 'zustand';
import {
  getProfile as getProfileApi,
  updateProfile as updateProfileApi,
} from '../services/profileService';
import { getReviewsForUser } from '../services/reviewService';

const useProfileStore = create((set) => ({
  profile: null,
  reviews: [],
  isLoading: false,
  error: null,

  fetchProfile: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getProfileApi(userId);
      set({ profile: response.data, isLoading: false, error: null });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  fetchUserReviews: async (userId) => {
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

  updateMyProfile: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateProfileApi(payload);
      set({ profile: response.data, isLoading: false, error: null });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useProfileStore;
