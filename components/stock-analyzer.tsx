/**
 * Stock Analyzer Component
 *
 * Demonstrates backend API integration for stock analysis
 */

'use client'

import { useState } from 'react'
import { useStockAnalysis } from '@/lib/hooks/use-stock-analysis'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Loader2, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react'

export function StockAnalyzer() {
  const [ticker, setTicker] = useState('')
  const {
    analyzeStock,
    singleLoading,
    singleError,
    singleData,
    resetSingle,
  } = useStockAnalysis()

  const handleAnalyze = async () => {
    if (!ticker.trim()) return

    try {
      await analyzeStock(ticker.toUpperCase())
    } catch (error) {
      // Error is already handled by the hook
      console.error('Analysis failed:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze()
    }
  }

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'bullish':
        return 'text-green-500 bg-green-500/10 border-green-500/50'
      case 'bearish':
        return 'text-red-500 bg-red-500/10 border-red-500/50'
      default:
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/50'
    }
  }

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'bullish':
        return <TrendingUp className="w-4 h-4" />
      case 'bearish':
        return <TrendingDown className="w-4 h-4" />
      default:
        return <Minus className="w-4 h-4" />
    }
  }

  const getRecommendationColor = (action: string) => {
    switch (action) {
      case 'strong_buy':
      case 'buy':
        return 'bg-green-500/20 text-green-500 border-green-500/50'
      case 'sell':
      case 'strong_sell':
        return 'bg-red-500/20 text-red-500 border-red-500/50'
      default:
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50'
    }
  }

  const formatAction = (action: string) => {
    return action.replace('_', ' ').toUpperCase()
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Stock Analyzer</h2>
        <p className="text-sm text-muted-foreground">
          Enter a stock ticker to get AI-powered quantimental analysis
        </p>
      </div>

      {/* Input Section */}
      <div className="flex gap-3">
        <Input
          type="text"
          placeholder="Enter ticker (e.g., AAPL)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          className="flex-1"
          disabled={singleLoading}
        />
        <Button
          onClick={handleAnalyze}
          disabled={singleLoading || !ticker.trim()}
          className="min-w-[120px]"
        >
          {singleLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze'
          )}
        </Button>
      </div>

      {/* Error Display */}
      {singleError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm font-medium">{singleError}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetSingle}
            className="mt-2"
          >
            Clear
          </Button>
        </div>
      )}

      {/* Results Display */}
      {singleData?.signal && (
        <div className="space-y-4 animate-in fade-in-50 duration-500">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">{singleData.signal.ticker}</h3>
              <p className="text-sm text-muted-foreground">
                {singleData.signal.company_name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getSignalColor(singleData.signal.signal)}>
                {getSignalIcon(singleData.signal.signal)}
                <span className="ml-1 capitalize">{singleData.signal.signal}</span>
              </Badge>
            </div>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-xs text-muted-foreground mb-1">Hybrid Score</p>
              <p className="text-2xl font-bold">{singleData.signal.hybrid_score}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-xs text-muted-foreground mb-1">Technical</p>
              <p className="text-2xl font-bold">{singleData.signal.technical_rating}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-xs text-muted-foreground mb-1">Sentiment</p>
              <p className="text-2xl font-bold">{singleData.signal.sentiment_rating}</p>
            </div>
          </div>

          {/* Recommendation */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Recommendation</h4>
              <Badge className={getRecommendationColor(singleData.signal.recommendation.action)}>
                {formatAction(singleData.signal.recommendation.action)}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Confidence:</span>
              <span className="font-semibold">{singleData.signal.recommendation.confidence}%</span>
              <div className="flex-1 bg-secondary rounded-full h-2 ml-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${singleData.signal.recommendation.confidence}%` }}
                />
              </div>
            </div>
            <div className="space-y-1">
              {singleData.signal.recommendation.reasons.map((reason, idx) => (
                <p key={idx} className="text-xs text-muted-foreground">
                  • {reason}
                </p>
              ))}
            </div>
          </div>

          {/* Technical Analysis */}
          <div className="rounded-lg border p-4 space-y-3">
            <h4 className="font-semibold">Technical Analysis</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Trend:</span>
                <span className="ml-2 font-medium capitalize">
                  {singleData.signal.technical_analysis.trend}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">RSI:</span>
                <span className="ml-2 font-medium">
                  {singleData.signal.technical_analysis.rsi.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Price:</span>
                <span className="ml-2 font-medium">
                  ${singleData.signal.technical_analysis.price.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Volatility:</span>
                <span className="ml-2 font-medium capitalize">
                  {singleData.signal.technical_analysis.volatility}
                </span>
              </div>
            </div>
          </div>

          {/* Sentiment Analysis */}
          <div className="rounded-lg border p-4 space-y-3">
            <h4 className="font-semibold">Sentiment Analysis</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Mentions:</span>
                <span className="ml-2 font-medium">
                  {singleData.signal.sentiment_analysis.mentions.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Velocity:</span>
                <span className="ml-2 font-medium capitalize">
                  {singleData.signal.sentiment_analysis.mention_velocity}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Sentiment Score:</span>
                <span className="ml-2 font-medium">
                  {singleData.signal.sentiment_analysis.sentiment_score.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Reddit Buzz:</span>
                <span className="ml-2 font-medium">
                  {singleData.signal.sentiment_analysis.reddit_buzz}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              Analyzed: {new Date(singleData.signal.metadata.analyzed_at).toLocaleString()}
            </p>
            <p>
              Processing time: {singleData.processing_time_ms.toFixed(2)}ms
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
