/**
 * API Client for Quantimental Backend
 *
 * Centralized HTTP client using axios.
 * All backend communication flows through here.
 */

import axios from 'axios';
import type {
  SignalFeedResponse,
  StockDetail,
  PriceChartData,
  WatchlistResponse,
  SearchResponse,
  TrendingResponse,
} from '@/types/api';

// Base URL — will be proxied by Vite in development
const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Axios instance with default config
const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — add auth token
client.interceptors.request.use(
  (config) => {
    // TODO: Add JWT token when auth is implemented
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized — redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// Signal Endpoints
// ============================================================================

export const signalsAPI = {
  /**
   * Get signal feed (home screen)
   */
  getFeed: async (params?: {
    page?: number;
    page_size?: number;
    signal_type?: string;
    sector?: string;
    min_confidence?: number;
  }): Promise<SignalFeedResponse> => {
    const { data } = await client.get<SignalFeedResponse>('/feed', { params });
    return data;
  },

  /**
   * Get stock detail
   */
  getStockDetail: async (ticker: string): Promise<StockDetail> => {
    const { data } = await client.get<StockDetail>(`/stocks/${ticker}`);
    return data;
  },

  /**
   * Get price chart data
   */
  getPriceChart: async (ticker: string, days: number = 30): Promise<PriceChartData> => {
    const { data } = await client.get<PriceChartData>(`/stocks/${ticker}/chart`, {
      params: { days },
    });
    return data;
  },

  /**
   * Search stocks
   */
  search: async (query: string): Promise<SearchResponse> => {
    const { data } = await client.get<SearchResponse>('/search', {
      params: { q: query },
    });
    return data;
  },

  /**
   * Get trending stocks
   */
  getTrending: async (): Promise<TrendingResponse> => {
    const { data } = await client.get<TrendingResponse>('/trending');
    return data;
  },
};

// ============================================================================
// Watchlist Endpoints
// ============================================================================

export const watchlistAPI = {
  /**
   * Get user's watchlist
   */
  get: async (): Promise<WatchlistResponse> => {
    const { data } = await client.get<WatchlistResponse>('/watchlist');
    return data;
  },

  /**
   * Add stock to watchlist
   */
  add: async (ticker: string): Promise<void> => {
    await client.post('/watchlist', { ticker });
  },

  /**
   * Remove stock from watchlist
   */
  remove: async (ticker: string): Promise<void> => {
    await client.delete(`/watchlist/${ticker}`);
  },

  /**
   * Reorder watchlist
   */
  reorder: async (tickers: string[]): Promise<void> => {
    await client.put('/watchlist/reorder', tickers);
  },
};

// ============================================================================
// Health Check
// ============================================================================

export const healthCheck = async (): Promise<{ status: string }> => {
  const { data } = await client.get('/health');
  return data;
};

// Export axios instance for custom requests
export default client;
