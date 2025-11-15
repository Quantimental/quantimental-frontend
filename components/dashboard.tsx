'use client'

import { useState } from 'react'
import { Header } from './header'
import { TickerBanner } from './ticker-banner'
import { StockCard } from './stock-card'
import { TrendingArticles } from './trending-articles'
import { WatchlistSection } from './watchlist-section'

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
    velocity: string
  }
}

// Mock data for demonstration
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
  },
]

export function Dashboard() {
  const [watchlist, setWatchlist] = useState<Stock[]>(initialWatchlist)

  const handleRemoveFromWatchlist = (ticker: string) => {
    setWatchlist(watchlist.filter((stock) => stock.ticker !== ticker))
  }

  const handleAddToWatchlist = (stock: Stock) => {
    if (!watchlist.find(s => s.ticker === stock.ticker)) {
      setWatchlist([...watchlist, stock])
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
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
