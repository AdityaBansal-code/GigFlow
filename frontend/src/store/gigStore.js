import { create } from 'zustand';
import {
  getAllGigs,
  getAllGigsWithFilters,
  createGig,
  getGigById,
  updateGig,
  deleteGig,
} from '../services/gigService';

const useGigStore = create((set) => ({
  gigs: [],
  currentGig: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  filters: {
    category: '',
    difficulty: '',
    sortBy: '',
  },

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

  fetchGigsFiltered: async ({ search = '', category = '', difficulty = '', sortBy = '' } = {}) => {
    set({
      isLoading: true,
      error: null,
      searchQuery: search,
      filters: { category, difficulty, sortBy },
    });
    try {
      const response = await getAllGigsWithFilters({ search, category, difficulty, sortBy });
      set({
        gigs: response.data || [],
        isLoading: false,
        error: null,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  fetchGigById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getGigById(id);
      const gigData = response.data;

      set((state) => {
        const gigExists = state.gigs.some(g => g._id === gigData._id);
        const updatedGigs = gigExists
          ? state.gigs.map(g => g._id === gigData._id ? gigData : g)
          : [...state.gigs, gigData];

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

  editGig: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateGig(id, payload);
      const updatedGig = response.data;
      set((state) => ({
        gigs: state.gigs.map((gig) => (gig._id === id ? updatedGig : gig)),
        currentGig: state.currentGig?._id === id ? updatedGig : state.currentGig,
        isLoading: false,
        error: null,
      }));
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  removeGig: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteGig(id);
      set((state) => ({
        gigs: state.gigs.filter((gig) => gig._id !== id),
        currentGig: state.currentGig?._id === id ? null : state.currentGig,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({ isLoading: false, error: error.message });
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

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useGigStore;
