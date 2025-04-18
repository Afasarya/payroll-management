import { Module } from 'vuex';
import { authService } from '@/services/api';

export interface AuthState {
  token: string | null;
  user: any | null;
  loading: boolean;
  error: string | null;
}

export const authModule: Module<AuthState, any> = {
  namespaced: true,
  
  state: () => ({
    token: localStorage.getItem('token'),
    user: null,
    loading: false,
    error: null
  }),
  
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },
    SET_USER(state, user) {
      state.user = user;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  
  actions: {
    async login({ commit }, credentials) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await authService.login(credentials.email, credentials.password);
        
        commit('SET_TOKEN', response.token);
        commit('SET_USER', response.user);
        
        return response;
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to login');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async logout({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        await authService.logout();
        
        commit('SET_TOKEN', null);
        commit('SET_USER', null);
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to logout');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },
  
  getters: {
    isAuthenticated(state) {
      return !!state.token;
    },
    currentUser(state) {
      return state.user;
    },
    isLoading(state) {
      return state.loading;
    },
    error(state) {
      return state.error;
    }
  }
};