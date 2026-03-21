import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { register, login, logout } from '../services/authService';
import { getDashboard } from '../services/dashboardService';
import { getMyProfileStats } from '../services/profileService';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      dashboard: null,
      userStats: null,

      registerUser: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await register(name, email, password);
          const { user, token } = response.data;

          set({
            user: { ...user, token },
            isAuthenticated: true,
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

      loginUser: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await login(email, password);
          const { user, token } = response.data;

          set({
            user: { ...user, token },
            isAuthenticated: true,
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

      logoutUser: async () => {
        set({ isLoading: true });
        try {
          await logout();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            dashboard: null,
            userStats: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
          });
        }
      },

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      fetchDashboard: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await getDashboard();
          set({
            dashboard: response.data,
            isLoading: false,
            error: null,
          });
          return response;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      fetchUserStats: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await getMyProfileStats();
          set({
            userStats: response.data,
            isLoading: false,
            error: null,
          });
          return response;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
