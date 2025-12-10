'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { Header } from './header'
import { TickerBanner } from './ticker-banner'
import { StockCard } from './stock-card'
import { TrendingArticles } from './trending-articles'
import { WatchlistSection } from './watchlist-section'
import { MarketQuickGlance } from './market-quick-glance'
import { calculateHybridScore, generateRecommendation, calculateMarketMood, calculateSignalDistribution } from '@/lib/market-engine'
import { ingestionService } from '@/lib/api-services'

export type Stock = {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
  technicalRating: number
  sentimentRating: number
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
  // New fields
  hybridScore?: number
  hybridWeights?: { technical: number; sentiment: number }
  recommendation?: {
    action: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell'
    confidence: number
    reasons: string[]
  }
  signalAge?: number
  lastUpdated?: string
  priceHistory?: number[] // 7-day price history
}

// Enhanced mock data with all new fields
const initialWatchlist: Stock[] = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    price: 178.45,
    change: 2.34,
    changePercent: 1.33,
    technicalRating: 72,
    sentimentRating: 85,
    signal: 'bullish',
    tagline: 'Strong momentum with positive sentiment surge',
    technicalDetails: {
      rsi: 68,
      ma50: 175.2,
      ma200: 165.8,
    },
    sentimentDetails: {
      score: 0.85,
      mentions: 1243,
      velocity: 'rising',
    },
    signalAge: Date.now() - 1.5 * 60 * 60 * 1000, // 1.5 hours ago
    lastUpdated: '1.5h ago',
    priceHistory: [172.1, 173.8, 174.2, 175.9, 176.5, 177.8, 178.45], // 7-day uptrend
  },
  {
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    price: 242.15,
    change: -4.67,
    changePercent: -1.89,
    technicalRating: 45,
    sentimentRating: 38,
    signal: 'bearish',
    tagline: 'Oversold with fear sentiment - potential reversal',
    technicalDetails: {
      rsi: 28,
      ma50: 255.4,
      ma200: 248.9,
    },
    sentimentDetails: {
      score: 0.38,
      mentions: 2156,
      velocity: 'falling',
    },
    signalAge: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
    lastUpdated: '4h ago',
    priceHistory: [258.3, 255.2, 252.1, 248.9, 245.8, 243.5, 242.15], // 7-day downtrend
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 142.89,
    change: 0.45,
    changePercent: 0.32,
    technicalRating: 58,
    sentimentRating: 62,
    signal: 'neutral',
    tagline: 'Consolidating near support with steady sentiment',
    technicalDetails: {
      rsi: 52,
      ma50: 141.2,
      ma200: 138.7,
    },
    sentimentDetails: {
      score: 0.62,
      mentions: 892,
      velocity: 'steady',
    },
    signalAge: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
    lastUpdated: '6h ago',
    priceHistory: [141.5, 141.8, 142.1, 142.3, 142.6, 142.7, 142.89], // 7-day consolidation
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    price: 412.34,
    change: 5.89,
    changePercent: 1.45,
    technicalRating: 78,
    sentimentRating: 81,
    signal: 'bullish',
    tagline: 'Breakout confirmed with institutional buying',
    technicalDetails: {
      rsi: 71,
      ma50: 405.8,
      ma200: 392.1,
    },
    sentimentDetails: {
      score: 0.81,
      mentions: 1567,
      velocity: 'rising',
    },
    signalAge: Date.now() - 0.5 * 60 * 60 * 1000, // 30 min ago
    lastUpdated: '30m ago',
    priceHistory: [402.1, 404.5, 406.2, 408.1, 409.8, 411.2, 412.34], // 7-day strong uptrend
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 495.67,
    change: 8.23,
    changePercent: 1.69,
    technicalRating: 88,
    sentimentRating: 92,
    signal: 'bullish',
    tagline: 'AI hype driving massive momentum',
    technicalDetails: {
      rsi: 78,
      ma50: 475.3,
      ma200: 445.2,
    },
    sentimentDetails: {
      score: 0.92,
      mentions: 3421,
      velocity: 'rising',
    },
    signalAge: Date.now() - 0.25 * 60 * 60 * 1000, // 15 min ago
    lastUpdated: '15m ago',
    priceHistory: [467.1, 472.3, 478.9, 484.2, 489.5, 492.1, 495.67], // 7-day explosive uptrend
  },
]

// Enrich stocks with calculated fields
function enrichStocks(stocks: Stock[]): Stock[] {
  return stocks.map(stock => {
    const { score: hybridScore, weights } = calculateHybridScore(
      stock.technicalRating,
      stock.sentimentRating,
      0.45,
      0.55
    )

    const recommendation = generateRecommendation(
      hybridScore,
      stock.technicalRating,
      stock.sentimentRating,
      stock.signal,
      stock.technicalDetails.rsi,
      stock.sentimentDetails.mentions,
      stock.sentimentDetails.velocity as 'rising' | 'falling' | 'steady'
    )

    return {
      ...stock,
      hybridScore,
      hybridWeights: weights,
      recommendation
    }
  })
}

export function Dashboard() {
  // Local state for watchlist management.
  // Start with enriched mock data so the dashboard renders immediately,
  // then replace with real backend data when it arrives.
  const [watchlist, setWatchlist] = useState<Stock[]>(() => enrichStocks(initialWatchlist))
  const [loading, setLoading] = useState(false)

  // Fetch real LIVE data for all watchlist stocks
  const fetchWatchlistData = useCallback(async (tickers: string[]) => {
    if (tickers.length === 0) return
    
    try {
      setLoading(true)
      const data = await ingestionService.analyzeMultipleLight(tickers)

        const mapped: Stock[] = data.signals.map(signal => {
          // Convert sentiment_score (-1 to +1) to sentimentRating (0-100)
          // If backend already provides sentiment_rating, use it; otherwise calculate from score
          const sentimentScore = signal.sentiment_analysis.sentiment_score // -1 to +1
          const sentimentRating = signal.sentiment_rating !== undefined 
            ? signal.sentiment_rating 
            : Math.round((sentimentScore + 1) * 50) // Convert -1..+1 to 0..100
          
          // Enrich with hybrid score and recommendation if not provided
          const hybridScore = signal.hybrid_score || calculateHybridScore(
            signal.technical_rating,
            sentimentRating,
            0.45,
            0.55
          ).score
          
          const recommendation = signal.recommendation || generateRecommendation(
            hybridScore,
            signal.technical_rating,
            sentimentRating,
            signal.signal,
            signal.technical_analysis.rsi,
            signal.sentiment_analysis.mentions,
            signal.sentiment_analysis.mention_velocity as 'rising' | 'falling' | 'steady'
          )
          
          return {
            ticker: signal.ticker,
            name: signal.company_name,
            price: signal.technical_analysis.price,
            change: 0,
            changePercent: signal.technical_analysis.price_change_10d || 0,
            technicalRating: signal.technical_rating,
            sentimentRating: sentimentRating,
            signal: signal.signal,
            tagline: recommendation.reasons[0] || 'Market analysis available',
            technicalDetails: {
              rsi: signal.technical_analysis.rsi,
              ma50: signal.technical_analysis.sma_50,
              ma200: signal.technical_analysis.sma_200 || signal.technical_analysis.sma_50,
            },
            sentimentDetails: {
              score: sentimentScore,
              mentions: signal.sentiment_analysis.mentions,
              velocity: signal.sentiment_analysis.mention_velocity,
            },
            hybridScore: hybridScore,
            hybridWeights: { technical: 0.45, sentiment: 0.55 },
            recommendation: recommendation,
            signalAge: Date.now(),
            lastUpdated: 'Just now',
            priceHistory: [],
          }
        })

        console.log('Dashboard watchlist data', mapped)
        setWatchlist(mapped)
      } catch (err) {
        console.warn('Failed to fetch dashboard watchlist', err)
      } finally {
        setLoading(false)
      }
  }, [])

  // Initial fetch for default watchlist - all 15 tickers
  useEffect(() => {
    const defaultTickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'JPM', 'V', 'JNJ', 'WMT', 'PG', 'DIS', 'NFLX', 'COIN']
    fetchWatchlistData(defaultTickers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Refresh watchlist data periodically (every 2 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTickers = watchlist.map(s => s.ticker)
      if (currentTickers.length > 0) {
        fetchWatchlistData(currentTickers)
      }
    }, 2 * 60 * 1000) // 2 minutes

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchlist])

  // Calculate market stats (MUST be called before any conditional returns to maintain hook order)
  const marketStats = useMemo(() => {
    // Return default values if no data yet
    if (watchlist.length === 0) {
      return {
        distribution: { strongBuy: 0, buy: 0, hold: 0, sell: 0, strongSell: 0 },
        moodData: { mood: 'neutral' as const, sentiment: 50, hypyVelocity: 0, fearGreedTilt: 0, vixLevel: 16 },
        medianRsi: 50,
        avgSentiment: 50,
        vixLevel: 16
      }
    }

    const avgSentiment = watchlist.reduce((sum, s) => sum + s.sentimentRating, 0) / watchlist.length
    const bullishCount = watchlist.filter(s => s.signal === 'bullish').length
    const rsiValues = watchlist.map(s => s.technicalDetails.rsi).sort((a, b) => a - b)
    const medianRsi = rsiValues[Math.floor(rsiValues.length / 2)]

    // Calculate avg velocity
    const velocityMap = { rising: 1, steady: 0, falling: -1 }
    const avgVelocity = watchlist.reduce((sum, s) => sum + velocityMap[s.sentimentDetails.velocity as 'rising' | 'falling' | 'steady'], 0) / watchlist.length
    const hypyVelocity = avgVelocity * 33.33 // scale to -100 to 100

    // Mock VIX
    const vixLevel = 16.2

    const distribution = calculateSignalDistribution(
      watchlist.map(s => ({
        signal: s.signal,
        hybridScore: s.hybridScore || 50
      }))
    )

    const moodData = calculateMarketMood(
      avgSentiment,
      bullishCount,
      watchlist.length,
      hypyVelocity,
      vixLevel
    )

    return {
      distribution,
      moodData,
      medianRsi,
      avgSentiment,
      vixLevel
    }
  }, [watchlist])

  // Show loading state (AFTER all hooks are called)
  // Because we initialize with mock data, this is effectively a safeguard
  // if the watchlist were ever empty while loading.
  if (loading && watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading market data...</p>
        </div>
      </div>
    )
  }

  const handleRemoveFromWatchlist = (ticker: string) => {
    setWatchlist(watchlist.filter((stock) => stock.ticker !== ticker))
  }

  const handleAddToWatchlist = async (stock: Stock) => {
    // Don't add if already in watchlist
    if (watchlist.find(s => s.ticker === stock.ticker)) {
      return
    }

    try {
      // Fetch live data for the newly added stock
      setLoading(true)
      const data = await ingestionService.analyzeMultipleLight([stock.ticker])
      
      if (data.signals && data.signals.length > 0) {
        const signal = data.signals[0]
        const sentimentScore = signal.sentiment_analysis.sentiment_score
        const sentimentRating = signal.sentiment_rating !== undefined 
          ? signal.sentiment_rating 
          : Math.round((sentimentScore + 1) * 50)
        
        const hybridScore = signal.hybrid_score || calculateHybridScore(
          signal.technical_rating,
          sentimentRating,
          0.45,
          0.55
        ).score
        
        const recommendation = signal.recommendation || generateRecommendation(
          hybridScore,
          signal.technical_rating,
          sentimentRating,
          signal.signal,
          signal.technical_analysis.rsi,
          signal.sentiment_analysis.mentions,
          signal.sentiment_analysis.mention_velocity as 'rising' | 'falling' | 'steady'
        )
        
        const newStock: Stock = {
          ticker: signal.ticker,
          name: signal.company_name,
          price: signal.technical_analysis.price,
          change: 0,
          changePercent: signal.technical_analysis.price_change_10d || 0,
          technicalRating: signal.technical_rating,
          sentimentRating: sentimentRating,
          signal: signal.signal,
          tagline: recommendation.reasons[0] || 'Market analysis available',
          technicalDetails: {
            rsi: signal.technical_analysis.rsi,
            ma50: signal.technical_analysis.sma_50,
            ma200: signal.technical_analysis.sma_200 || signal.technical_analysis.sma_50,
          },
          sentimentDetails: {
            score: sentimentScore,
            mentions: signal.sentiment_analysis.mentions,
            velocity: signal.sentiment_analysis.mention_velocity,
          },
          hybridScore: hybridScore,
          hybridWeights: { technical: 0.45, sentiment: 0.55 },
          recommendation: recommendation,
          signalAge: Date.now(),
          lastUpdated: 'Just now',
          priceHistory: [],
        }
        
        setWatchlist([...watchlist, newStock])
        console.log(`Fetched live data for ${stock.ticker}:`, newStock)
      } else {
        // Fallback to enriched mock if API fails
        const enrichedStock = enrichStocks([stock])[0]
        setWatchlist([...watchlist, enrichedStock])
      }
    } catch (err) {
      console.warn(`Failed to fetch live data for ${stock.ticker}:`, err)
      // Fallback to enriched mock if API fails
      const enrichedStock = enrichStocks([stock])[0]
      setWatchlist([...watchlist, enrichedStock])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Market Quick Glance - Compact bar at top */}
      <MarketQuickGlance
        strongBuy={marketStats.distribution.strongBuy}
        buy={marketStats.distribution.buy}
        hold={marketStats.distribution.hold}
        sell={marketStats.distribution.sell}
        strongSell={marketStats.distribution.strongSell}
        marketMood={marketStats.moodData.mood}
        sentiment={marketStats.moodData.sentiment}
        hypyVelocity={marketStats.moodData.hypyVelocity}
        fearGreedTilt={marketStats.moodData.fearGreedTilt}
        vixLevel={marketStats.moodData.vixLevel}
      />
      
      <TickerBanner />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-balance">
            Quantimental Analysis Dashboard
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Fusing quantitative indicators with psychological sentiment to generate superior trading signals
          </p>
        </div>

        {/* Trending Articles */}
        <TrendingArticles />

        {/* Watchlist */}
        <WatchlistSection 
          stocks={watchlist} 
          onRemoveStock={handleRemoveFromWatchlist}
          onAddStock={handleAddToWatchlist}
        />
      </main>
    </div>
  )
}
