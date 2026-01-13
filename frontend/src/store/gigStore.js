import { create } from 'zustand';
import { getAllGigs, createGig, getGigById } from '../services/gigService';

const useGigStore = create((set) => ({
  gigs: [],
  currentGig: null,
  isLoading: false,
  error: null,
  searchQuery: '',

  fetchGigs: async (search = '') => {
    set({ isLoading: true, error: null, searchQuery: search });
    try {
      const response = await getAllGigs(search);
      set({
        gigs: response.data || [],
        isLoading: false,
        error: null,
      });
      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  fetchGigById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getGigById(id);
      const gigData = response.data;

      set((state) => {
        // Update list if gig exists, or add it
        const gigExists = state.gigs.some(g => g._id === gigData._id);
        let updatedGigs = state.gigs;

        if (gigExists) {
          updatedGigs = state.gigs.map(g => g._id === gigData._id ? gigData : g);
        } else {
          // careful not to mess up order too much, usually prepend or append
          // but since details view mostly cares about 'finding' it, appending is fine.
          updatedGigs = [...state.gigs, gigData];
        }

        return {
          currentGig: gigData,
          gigs: updatedGigs,
          isLoading: false,
          error: null,
        };
      });
      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  createGig: async (title, description, budget) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createGig(title, description, budget);
      set((state) => ({
        gigs: [response.data, ...state.gigs],
        isLoading: false,
        error: null,
      }));
      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  updateGigStatus: (gigId, status) => {
    set((state) => ({
      gigs: state.gigs.map((gig) =>
        gig._id === gigId ? { ...gig, status } : gig
      ),
      currentGig:
        state.currentGig?._id === gigId
          ? { ...state.currentGig, status }
          : state.currentGig,
    }));
  },

  setCurrentGig: (gig) => {
    set({ currentGig: gig });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useGigStore;
