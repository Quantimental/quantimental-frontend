/**
 * News API functions for fetching stock-related news articles
 */
import { api, endpoints } from './api-client'

export interface NewsArticle {
  id: number
  url: string
  title: string
  content?: string
  source: string
  published_at?: string
  image_url?: string
  sentiment: {
    score: number
    label: string
    confidence: number
  }
  impact: {
    sentiment: 'bullish' | 'bearish' | 'neutral'
    impact: 'high' | 'medium' | 'low'
    score: number
  }
  has_content: boolean
}

export interface NewsResponse {
  ticker: string
  articles: NewsArticle[]
  count: number
}

export interface ArticleDetails extends NewsArticle {
  summary?: string
  author?: string
}

/**
 * Fetch recent news articles for a ticker
 */
export async function getNewsForTicker(
  ticker: string,
  limit: number = 3,
  hours: number = 24
): Promise<NewsResponse> {
  return api.get<NewsResponse>(endpoints.news.getForTicker(ticker, limit, hours))
}

/**
 * Fetch full article details by ID
 */
export async function getArticleDetails(id: number): Promise<ArticleDetails> {
  return api.get<ArticleDetails>(endpoints.news.getArticle(id))
}


