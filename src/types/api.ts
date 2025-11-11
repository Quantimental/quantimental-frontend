/**
 * TypeScript type definitions for Quantimental API
 *
 * These mirror the Pydantic models from the backend.
 * Type safety across the full stack.
 */

export type SignalType = 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';
export type EmotionType = 'EXTREME_FEAR' | 'FEAR' | 'NEUTRAL' | 'GREED' | 'EXTREME_GREED' | 'FOMO' | 'FUD';

// Signal Feed
export interface SignalFeedItem {
  ticker: string;
  name: string;
  price: number;
  change_percent: number;
  signal: SignalType;
  case_type: string;
  confidence: number;
  emoji: string;
  reason_short: string;
  signal_age_hours: number;
  created_at: string;
}

export interface SignalFeedResponse {
  signals: SignalFeedItem[];
  total: number;
  page: number;
  page_size: number;
  filters_applied: {
    signal_type?: string;
    sector?: string;
    min_confidence: number;
  };
}

// Stock Detail
export interface HybridSignal {
  ticker: string;
  signal: SignalType;
  case_type: string;
  confidence: number;
  reason: string;
  reason_short: string;
  historical_accuracy: number;
  avg_gain_when_correct: number;
  created_at: string;
}

export interface QuantSignal {
  ticker: string;
  date: string;
  rsi: number | null;
  ma_50: number | null;
  ma_200: number | null;
  current_price: number;
  signal: string;
  trend_short: string;
  trend_long: string;
}

export interface PsychSignal {
  ticker: string;
  date: string;
  sentiment_score: number;
  emotion: EmotionType;
  hype_velocity: number;
  mention_count: number;
  mention_avg_30d: number;
  top_keywords: string[];
}

export interface StockDetail {
  ticker: string;
  name: string;
  sector: string | null;
  price: number;
  change_percent: number;
  hybrid_signal: HybridSignal;
  quant_data: QuantSignal;
  psych_data: PsychSignal;
  in_watchlist: boolean;
  has_active_alert: boolean;
}

// Price Chart
export interface PriceChartData {
  dates: string[];
  prices: number[];
  volumes: number[];
  signals: Array<{
    date: string;
    signal: SignalType;
    confidence: number;
    case_type: string;
  }>;
}

// Watchlist
export interface WatchlistItem {
  ticker: string;
  name: string;
  price: number;
  change_percent: number;
  signal: SignalType;
  confidence: number;
  signal_changed: boolean;
  added_at: string;
}

export interface WatchlistResponse {
  items: WatchlistItem[];
  total: number;
}

// Search
export interface StockSearchResult {
  ticker: string;
  name: string;
  sector: string | null;
  current_signal: SignalType | null;
  confidence: number | null;
}

export interface SearchResponse {
  results: StockSearchResult[];
  total: number;
  query: string;
}

// Trending
export interface TrendingStock {
  ticker: string;
  name: string;
  signal: SignalType;
  confidence: number;
  mention_spike: number;
  reason_short: string;
}

export interface TrendingResponse {
  trending: TrendingStock[];
  date: string;
}

// API Error
export interface APIError {
  error: string;
  detail?: string;
  timestamp: string;
}
