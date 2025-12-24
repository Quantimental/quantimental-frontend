/**
 * API Client for Quantimental Backend
 *
 * Centralized HTTP client for all backend communication.
 * Features:
 * - Automatic base URL handling
 * - Request/response interceptors
 * - Error handling
 * - Type-safe responses
 */

const API_BASE_URL = process.env.API_URL || 'http://localhost:8000'
const API_VERSION = process.env.API_VERSION || 'v1'

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export interface APIResponse<T> {
  data: T
  error?: string
  status: number
}

/**
 * Core API client with error handling
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)

    // Get process time from headers (backend adds this)
    const processTime = response.headers.get('X-Process-Time')
    if (processTime && typeof window !== 'undefined') {
      console.log(`[API] ${endpoint} - ${processTime}`)
    }

    // Parse response
    const data = await response.json()

    if (!response.ok) {
      throw new APIError(
        data.detail || data.error || 'Request failed',
        response.status,
        data
      )
    }

    return data as T
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }

    // Network or parsing errors
    if (error instanceof Error) {
      throw new APIError(
        `Network error: ${error.message}`,
        0
      )
    }

    throw new APIError('Unknown error occurred', 0)
  }
}

/**
 * API Client Methods
 */
export const api = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  /**
   * POST request
   */
  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  /**
   * PUT request
   */
  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
}

/**
 * Typed API endpoints
 */
export const endpoints = {
  // Health & Info
  health: '/health',
  ping: '/api/ping',
  root: '/',

  // Ingestion
  ingestion: {
    analyze: `/api/${API_VERSION}/ingestion/analyze`,
    analyzeMultiple: `/api/${API_VERSION}/ingestion/analyze-multiple`,
    analyzeMultipleLight: `/api/${API_VERSION}/ingestion/analyze-multiple-light`,
    trendingArticles: `/api/${API_VERSION}/ingestion/trending-articles`,
    tickerNews: (ticker: string) => `/api/${API_VERSION}/ingestion/ticker-news/${ticker}`,
  },

  // News
  news: {
    getForTicker: (ticker: string, limit?: number, hours?: number) => 
      `/api/${API_VERSION}/news/ticker/${ticker}?limit=${limit || 3}&hours=${hours || 24}`,
    getArticle: (id: number) => `/api/${API_VERSION}/news/article/${id}`,
  },

  // Future endpoints (commented for reference)
  // signals: {
  //   list: `/api/${API_VERSION}/signals`,
  //   get: (id: string) => `/api/${API_VERSION}/signals/${id}`,
  // },
  // watchlist: {
  //   list: `/api/${API_VERSION}/watchlist`,
  //   add: `/api/${API_VERSION}/watchlist`,
  //   remove: (id: string) => `/api/${API_VERSION}/watchlist/${id}`,
  // },
}

/**
 * Helper to check if backend is reachable
 */
export async function checkBackendHealth(): Promise<{
  healthy: boolean
  message?: string
  details?: unknown
}> {
  try {
    const data = await api.get<{
      status: string
      service: string
      version: string
    }>(endpoints.health)

    return {
      healthy: data.status === 'healthy',
      message: `Backend is healthy - ${data.service} v${data.version}`,
      details: data,
    }
  } catch (error) {
    if (error instanceof APIError) {
      return {
        healthy: false,
        message: `Backend error: ${error.message}`,
        details: error.data,
      }
    }

    return {
      healthy: false,
      message: 'Cannot reach backend server',
    }
  }
}

/**
 * Helper to test connectivity
 */
export async function pingBackend(): Promise<boolean> {
  try {
    const data = await api.get<{ message: string }>(endpoints.ping)
    return data.message === 'pong'
  } catch {
    return false
  }
}
