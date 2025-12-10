/**
 * Watchlist Hook
 *
 * Fetches and manages watchlist stocks with real-time data from backend
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { ingestionService } from '../api-services'
import type { AnalyzeStockResponse, AnalyzeMultipleResponse } from '../api-services'

export interface WatchlistStock {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
  technicalRating: number
  sentimentRating: number
  hybridScore: number
  signal: 'bullish' | 'bearish' | 'neutral'
  tagline: string
  technicalDetails: {
    rsi: number
    ma50: number
    ma200: number
  }
  sentimentDetails: {
    score: number
    mentions: number
    velocity: 'rising' | 'falling' | 'steady'
  }
  recommendation: {
    action: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell'
    confidence: number
    reasons: string[]
  }
  hybridWeights?: { technical: number; sentiment: number }
  signalAge?: number
  lastUpdated: string
  priceHistory?: number[]
}

export function useWatchlist(initialTickers: string[] = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'JPM', 'V', 'JNJ', 'WMT', 'PG', 'DIS', 'NFLX', 'COIN']) {
  const [stocks, setStocks] = useState<WatchlistStock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStocks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Use lightweight batch endpoint to analyze all tickers in one request
      const data: AnalyzeMultipleResponse = await ingestionService.analyzeMultipleLight(initialTickers)
      const stockData: WatchlistStock[] = []

      data.signals.forEach((signal) => {
        // Map backend response to watchlist format
        stockData.push({
            ticker: signal.ticker,
            name: signal.company_name,
            price: signal.technical_analysis.price,
            change: 0, // Will calculate from price history
            changePercent: signal.technical_analysis.price_change_10d || 0,
            technicalRating: signal.technical_rating,
            sentimentRating: signal.sentiment_rating,
            hybridScore: signal.hybrid_score,
            signal: signal.signal as 'bullish' | 'bearish' | 'neutral',
            tagline: signal.recommendation.reasons[0] || 'Market analysis available',
            technicalDetails: {
              rsi: signal.technical_analysis.rsi,
              ma50: signal.technical_analysis.sma_50,
              ma200: signal.technical_analysis.sma_50, // Backend doesn't have 200-day yet, use 50-day
            },
            sentimentDetails: {
              score: signal.sentiment_analysis.sentiment_score,
              mentions: signal.sentiment_analysis.mentions,
              velocity: signal.sentiment_analysis.mention_velocity as 'rising' | 'falling' | 'steady',
            },
            recommendation: {
              action: signal.recommendation.action as 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell',
              confidence: signal.recommendation.confidence,
              reasons: signal.recommendation.reasons,
            },
            hybridWeights: { technical: 0.45, sentiment: 0.55 },
            signalAge: Date.now(),
            lastUpdated: 'Just now',
            priceHistory: [], // Will be populated from historical data if needed
          })
      })

      console.log('Watchlist backend data', stockData)
      setStocks(stockData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch watchlist')
      console.warn('Watchlist fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [initialTickers])

  // Initial fetch
  useEffect(() => {
    fetchStocks()
  }, [fetchStocks])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStocks()
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [fetchStocks])

  return {
    stocks,
    loading,
    error,
    refetch: fetchStocks,
  }
}
