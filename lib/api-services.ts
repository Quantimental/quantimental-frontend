/**
 * API Service Functions
 *
 * High-level service functions that wrap the API client
 * and provide type-safe interfaces for all backend operations.
 */

import { api, endpoints } from './api-client'

/**
 * Types for API responses
 */

// Ingestion Types
export interface PsychSignal {
  ticker: string
  company_name: string
  signal: 'bullish' | 'bearish' | 'neutral'
  confidence: number
  technical_rating: number
  sentiment_rating: number
  hybrid_score: number
  recommendation: {
    action: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell'
    confidence: number
    reasons: string[]
  }
  technical_analysis: {
    trend: string
    rsi: number
    price: number
    volume: number
    volatility: string
    macd: number
    macd_signal: number
    macd_histogram: number
    stochastic_k: number
    adx: number
    bollinger_upper: number
    bollinger_lower: number
    sma_20: number
    sma_50: number
    sma_200?: number
    price_change_10d?: number
  }
  sentiment_analysis: {
    mentions: number
    mention_velocity: 'rising' | 'falling' | 'steady'
    sentiment_score: number
    reddit_buzz: number
    twitter_buzz: number
  }
  metadata: {
    analyzed_at: string
    data_sources: string[]
    market_regime: string
  }
}

export interface AnalyzeStockRequest {
  ticker: string
}

export interface AnalyzeStockResponse {
  signal: PsychSignal
  success: boolean
  processing_time_ms: number
}

export interface AnalyzeMultipleRequest {
  tickers: string[]
}

export interface AnalyzeMultipleResponse {
  signals: PsychSignal[]
  success: boolean
  total_processed: number
  failed: string[]
  processing_time_ms: number
}

export interface NewsArticle {
  id: number
  ticker: string | null
  title: string
  description?: string
  summary?: string
  url: string
  source: string
  published_at: string
  image_url?: string
  author?: string
  is_market_news?: boolean
  sentiment?: 'bullish' | 'bearish' | 'neutral'
  impact?: 'high' | 'medium' | 'low'
  tickers?: string[]
}

export interface TrendingArticlesResponse {
  articles: NewsArticle[]
  success: boolean
  total_articles: number
  processing_time_ms: number
}

export interface TickerNewsResponse {
  articles: NewsArticle[]
  success: boolean
  total_articles: number
  processing_time_ms: number
}

export interface RedditPost {
  title: string
  url: string
  selftext: string
  score: number
  num_comments: number
  author: string
  subreddit: string
  created_utc: number
  permalink: string
  ticker?: string
  source: string
  sentiment_score?: number
}

export interface RedditPostsResponse {
  ticker: string
  posts: RedditPost[]
  total: number
  is_cached: boolean
  success: boolean
}

export interface TrendingRedditResponse {
  subreddit: string
  posts: RedditPost[]
  total: number
  success: boolean
}

/**
 * Ingestion Service
 */
export const ingestionService = {
  /**
   * Analyze a single stock ticker
   */
  async analyzeStock(ticker: string): Promise<AnalyzeStockResponse> {
    return api.post<AnalyzeStockResponse>(
      endpoints.ingestion.analyze,
      { ticker: ticker.toUpperCase() }
    )
  },

  /**
   * Analyze multiple stock tickers (full pipeline)
   */
  async analyzeMultiple(tickers: string[]): Promise<AnalyzeMultipleResponse> {
    return api.post<AnalyzeMultipleResponse>(
      endpoints.ingestion.analyzeMultiple,
      { tickers: tickers.map(t => t.toUpperCase()) }
    )
  },

  /**
   * Analyze multiple stock tickers (lightweight, for dashboards)
   */
  async analyzeMultipleLight(tickers: string[]): Promise<AnalyzeMultipleResponse> {
    return api.post<AnalyzeMultipleResponse>(
      endpoints.ingestion.analyzeMultipleLight,
      { tickers: tickers.map(t => t.toUpperCase()) }
    )
  },

  /**
   * Get trending market-wide articles (top 4)
   * Returns general market news (Fed decisions, economic reports, Wall Street trends)
   * NOT ticker-specific product news
   */
  async getTrendingArticles(): Promise<TrendingArticlesResponse> {
    return api.post<TrendingArticlesResponse>(
      endpoints.ingestion.trendingArticles,
      {}
    )
  },

  /**
   * Get news articles for a specific ticker
   * Returns up to 3 most recent articles for display on stock cards
   */
  async getTickerNews(ticker: string, limit: number = 3): Promise<TickerNewsResponse> {
    return api.post<TickerNewsResponse>(
      endpoints.ingestion.tickerNews(ticker.toUpperCase()),
      { limit }
    )
  },

  /**
   * Get Reddit posts for a specific ticker
   * Uses 6-hour caching to minimize API calls
   */
  async getRedditPosts(
    ticker: string,
    limit: number = 10,
    timeframe: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all' = 'week'
  ): Promise<RedditPostsResponse> {
    return api.get<RedditPostsResponse>(
      `/api/v1/ingestion/reddit/ticker/${ticker.toUpperCase()}?limit=${limit}&timeframe=${timeframe}`
    )
  },

  /**
   * Get trending posts from a specific subreddit
   * Returns top posts without ticker filtering
   */
  async getTrendingRedditPosts(
    subreddit: string = 'wallstreetbets',
    limit: number = 25,
    timeframe: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all' = 'day'
  ): Promise<TrendingRedditResponse> {
    return api.get<TrendingRedditResponse>(
      `/api/v1/ingestion/reddit/trending?subreddit=${subreddit}&limit=${limit}&timeframe=${timeframe}`
    )
  },
}

/**
 * Health Service
 */
export const healthService = {
  /**
   * Check backend health status
   */
  async check(): Promise<{
    status: string
    service: string
    version: string
    environment: string
  }> {
    return api.get(endpoints.health)
  },

  /**
   * Ping backend for connectivity test
   */
  async ping(): Promise<{ message: string }> {
    return api.get(endpoints.ping)
  },
}

/**
 * Export all services
 */
export const apiServices = {
  ingestion: ingestionService,
  health: healthService,
}

export default apiServices
