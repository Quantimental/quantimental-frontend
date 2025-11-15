'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { Stock } from './dashboard'

// Mock data - all available stocks
const allStocks: Stock[] = [
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
    technicalDetails: { rsi: 68, ma50: 175.2, ma200: 165.8 },
    sentimentDetails: { score: 0.85, mentions: 1243, velocity: 'rising' },
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
    technicalDetails: { rsi: 28, ma50: 255.4, ma200: 248.9 },
    sentimentDetails: { score: 0.38, mentions: 2156, velocity: 'falling' },
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
    technicalDetails: { rsi: 52, ma50: 141.2, ma200: 138.7 },
    sentimentDetails: { score: 0.62, mentions: 892, velocity: 'steady' },
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
    technicalDetails: { rsi: 71, ma50: 405.8, ma200: 392.1 },
    sentimentDetails: { score: 0.81, mentions: 1567, velocity: 'rising' },
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
    technicalDetails: { rsi: 78, ma50: 475.3, ma200: 445.2 },
    sentimentDetails: { score: 0.92, mentions: 3421, velocity: 'rising' },
  },
  {
    ticker: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 168.92,
    change: -1.23,
    changePercent: -0.72,
    technicalRating: 62,
    sentimentRating: 55,
    signal: 'neutral',
    tagline: 'Range-bound trading with mixed signals',
    technicalDetails: { rsi: 48, ma50: 170.5, ma200: 165.4 },
    sentimentDetails: { score: 0.55, mentions: 1098, velocity: 'steady' },
  },
  {
    ticker: 'META',
    name: 'Meta Platforms, Inc.',
    price: 512.88,
    change: 12.45,
    changePercent: 2.49,
    technicalRating: 82,
    sentimentRating: 76,
    signal: 'bullish',
    tagline: 'Strong earnings beat driving bullish sentiment',
    technicalDetails: { rsi: 74, ma50: 495.2, ma200: 478.9 },
    sentimentDetails: { score: 0.76, mentions: 1876, velocity: 'rising' },
  },
  {
    ticker: 'JPM',
    name: 'JPMorgan Chase & Co.',
    price: 189.23,
    change: -2.34,
    changePercent: -1.22,
    technicalRating: 38,
    sentimentRating: 42,
    signal: 'bearish',
    tagline: 'Banking sector weakness with negative sentiment',
    technicalDetails: { rsi: 32, ma50: 195.7, ma200: 192.3 },
    sentimentDetails: { score: 0.42, mentions: 654, velocity: 'falling' },
  },
]

type StockSearchProps = {
  onAddStock: (stock: Stock) => void
  watchlistTickers: string[]
}

export function StockSearch({ onAddStock, watchlistTickers }: StockSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length > 0) {
      const filtered = allStocks.filter(
        (stock) =>
          !watchlistTickers.includes(stock.ticker) &&
          (stock.ticker.toLowerCase().includes(query.toLowerCase()) ||
            stock.name.toLowerCase().includes(query.toLowerCase()))
      )
      setFilteredStocks(filtered)
      setIsOpen(true)
    } else {
      setFilteredStocks([])
      setIsOpen(false)
    }
  }, [query, watchlistTickers])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectStock = (stock: Stock) => {
    onAddStock(stock)
    setQuery('')
    setIsOpen(false)
  }

  const getSignalIcon = (signal: 'bullish' | 'bearish' | 'neutral') => {
    if (signal === 'bullish') return <TrendingUp className="w-4 h-4 text-green-500" />
    if (signal === 'bearish') return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-muted-foreground" />
  }

  const getSpectrumGradient = (technicalRating: number, sentimentRating: number) => {
    const avgScore = (technicalRating + sentimentRating) / 2
    if (avgScore >= 70) return 'from-green-500 to-emerald-400'
    if (avgScore >= 50) return 'from-yellow-500 to-amber-400'
    return 'from-red-500 to-rose-400'
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search stocks by ticker or name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className="pl-10 h-12"
        />
      </div>

      {isOpen && filteredStocks.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {filteredStocks.map((stock) => {
            const avgScore = (stock.technicalRating + stock.sentimentRating) / 2
            const spectrumGradient = getSpectrumGradient(stock.technicalRating, stock.sentimentRating)

            return (
              <button
                key={stock.ticker}
                onClick={() => handleSelectStock(stock)}
                className="w-full px-4 py-3 hover:bg-accent/50 border-b border-border last:border-b-0 transition-colors flex items-center gap-4"
              >
                {/* Stock Info */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-foreground">{stock.ticker}</span>
                    <span className="text-sm text-muted-foreground">{stock.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">${stock.price.toFixed(2)}</div>
                </div>

                {/* Mini Ratings */}
                <div className="flex items-center gap-3">
                  {/* Technical Score */}
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Tech</div>
                    <div className="text-sm font-semibold text-foreground">{stock.technicalRating}</div>
                  </div>

                  {/* Sentiment Score */}
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Sent</div>
                    <div className="text-sm font-semibold text-foreground">{stock.sentimentRating}</div>
                  </div>

                  {/* Mini Spectrum */}
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-20 h-2 rounded-full bg-gradient-to-r ${spectrumGradient}`} />
                    <div className="flex items-center gap-1">
                      {getSignalIcon(stock.signal)}
                      <span className="text-xs font-medium capitalize text-foreground">
                        {avgScore.toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {isOpen && filteredStocks.length === 0 && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-4 z-50">
          <p className="text-sm text-muted-foreground text-center">
            No stocks found matching "{query}"
          </p>
        </div>
      )}
    </div>
  )
}
