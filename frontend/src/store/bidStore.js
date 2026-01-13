import { create } from 'zustand';
import { createBid, getBidsByGig, hireFreelancer } from '../services/bidService';

const useBidStore = create((set) => ({
  bids: [],
  isLoading: false,
  error: null,

  fetchBidsByGig: async (gigId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getBidsByGig(gigId);
      set({
        bids: response.data || [],
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

  createBid: async (gigId, message, price) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createBid(gigId, message, price);
      set((state) => ({
        bids: [response.data, ...state.bids],
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

  hireFreelancer: async (bidId, gigId, updateGigStatusCallback) => {
    set({ isLoading: true, error: null });
    try {
      const response = await hireFreelancer(bidId);
      
      set((state) => ({
        bids: state.bids.map((bid) =>
          bid._id === bidId
            ? { ...bid, status: 'hired' }
            : bid.status === 'pending'
            ? { ...bid, status: 'rejected' }
            : bid
        ),
        isLoading: false,
        error: null,
      }));
      
      if (gigId && updateGigStatusCallback) {
        updateGigStatusCallback(gigId, 'assigned');
      }
      
      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  clearBids: () => {
    set({ bids: [], error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useBidStore;
