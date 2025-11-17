/**
 * Market Intelligence Engine
 * 
 * Core calculations for:
 * - Hybrid scoring (technical + sentiment fusion)
 * - Signal recommendations with confidence
 * - Market mood analysis
 * - Signal age tracking
 */

export type RecommendationAction = 
  | 'strong_buy' 
  | 'buy' 
  | 'hold' 
  | 'sell' 
  | 'strong_sell'

export type MarketMood = 'bearish' | 'cautious_bearish' | 'neutral' | 'cautious_bullish' | 'bullish'

/**
 * Calculate hybrid score: the sacred fusion of quant + psych
 * 
 * Weights can be dynamic based on market regime
 * Default: 45% technical, 55% sentiment (sentiment matters more in efficient markets)
 */
export function calculateHybridScore(
  technicalRating: number,
  sentimentRating: number,
  technicalWeight: number = 0.45,
  sentimentWeight: number = 0.55
): {
  score: number
  weights: { technical: number; sentiment: number }
} {
  const score = Math.round(
    technicalRating * technicalWeight + sentimentRating * sentimentWeight
  )
  
  return {
    score: Math.min(100, Math.max(0, score)),
    weights: { technical: technicalWeight, sentiment: sentimentWeight }
  }
}

/**
 * Generate trading recommendation based on dual analysis
 * 
 * Rules:
 * - Strong alignment (tech + sentiment both high/low) = higher confidence
 * - Divergence (one high, one low) = lower confidence, interesting setup
 * - RSI extremes matter more when sentiment agrees
 */
export function generateRecommendation(
  hybridScore: number,
  technicalRating: number,
  sentimentRating: number,
  signal: 'bullish' | 'bearish' | 'neutral',
  rsi: number,
  mentions: number,
  mentionVelocity: 'rising' | 'falling' | 'steady'
): {
  action: RecommendationAction
  confidence: number
  reasons: string[]
} {
  const reasons: string[] = []
  let confidence = 50 // baseline

  // Analyze alignment
  const techSentimentDiff = Math.abs(technicalRating - sentimentRating)
  const isAligned = techSentimentDiff < 20
  const isDiverged = techSentimentDiff > 40

  if (isAligned) {
    confidence += 15
    if (signal === 'bullish') {
      reasons.push('Strong alignment: Technical AND sentiment both bullish')
    } else if (signal === 'bearish') {
      reasons.push('Strong alignment: Technical AND sentiment both bearish')
    } else {
      reasons.push('Strong alignment: Both metrics neutral')
    }
  }

  // RSI extremes
  if (rsi > 70) {
    reasons.push('RSI overbought - potential pullback risk')
    if (sentimentRating > 75) {
      confidence += 10
      reasons.push('...but sentiment strongly positive - momentum may continue')
    } else {
      confidence -= 5
    }
  } else if (rsi < 30) {
    reasons.push('RSI oversold - potential bounce incoming')
    if (sentimentRating < 40) {
      confidence += 10
      reasons.push('...and sentiment negative - capitulation setting up')
    } else {
      confidence -= 5
    }
  }

  // Sentiment momentum
  if (mentionVelocity === 'rising') {
    reasons.push('Hype velocity rising - attention increasing')
    confidence += 8
  } else if (mentionVelocity === 'falling') {
    reasons.push('Hype velocity falling - interest waning')
    confidence -= 5
  }

  // Divergence is interesting but riskier
  if (isDiverged) {
    confidence -= 8
    reasons.push('Technical/sentiment divergence - mixed signals')
  }

  // Determine action based on hybrid score
  let action: RecommendationAction = 'hold'

  if (hybridScore >= 80) {
    action = 'strong_buy'
  } else if (hybridScore >= 65) {
    action = 'buy'
  } else if (hybridScore >= 40) {
    action = 'hold'
  } else if (hybridScore >= 25) {
    action = 'sell'
  } else {
    action = 'strong_sell'
  }

  // Cap confidence at 0-100
  confidence = Math.min(100, Math.max(0, confidence))

  return {
    action,
    confidence,
    reasons
  }
}

/**
 * Calculate global market mood from portfolio statistics
 */
export function calculateMarketMood(
  avgSentiment: number,
  bullishCount: number,
  totalStocks: number,
  avgMentionVelocity: number,
  vixLevel: number
): {
  mood: MarketMood
  insight: string
  sentiment: number
  hypyVelocity: number
  vixLevel: number
  fearGreedTilt: number
} {
  // Sentiment: -1 (bearish) to 1 (bullish)
  const sentiment = (avgSentiment - 50) / 50

  // Bullish percentage
  const bullishPercentage = (bullishCount / totalStocks) * 100

  // Hype velocity: -100 to +100, mapped to percentage
  const hypyVelocity = avgMentionVelocity

  // Fear/Greed: 0-100
  // Low VIX + high sentiment = greed
  // High VIX + low sentiment = fear
  const fearGreedTilt = Math.round(
    (1 - Math.min(vixLevel, 50) / 50) * 50 + (sentiment + 1) * 25
  )

  // Determine mood
  let mood: MarketMood = 'neutral'

  if (sentiment > 0.3 && bullishPercentage > 60) {
    mood = 'bullish'
  } else if (sentiment > 0.1 && bullishPercentage > 50) {
    mood = 'cautious_bullish'
  } else if (sentiment < -0.3 && bullishPercentage < 40) {
    mood = 'bearish'
  } else if (sentiment < -0.1 && bullishPercentage < 50) {
    mood = 'cautious_bearish'
  }

  // Generate insight
  let insight = ''
  if (mood === 'bullish') {
    insight = `Market showing strong bullish signals (${bullishPercentage.toFixed(0)}% bullish). Sentiment rising${hypyVelocity > 0 ? ' with accelerating momentum' : ''}.`
  } else if (mood === 'cautious_bullish') {
    insight = `Market cautiously optimistic. Technical setup favorable, but sentiment not yet fully convinced.`
  } else if (mood === 'neutral') {
    insight = `Market at crossroads. Mixed signals between technical indicators and sentiment analysis.`
  } else if (mood === 'cautious_bearish') {
    insight = `Caution warranted. More stocks bearish than bullish, with concerning sentiment backdrop.`
  } else {
    insight = `Market showing bearish conviction. ${bullishPercentage.toFixed(0)}% bullish signals suggest continued weakness.`
  }

  return {
    mood,
    insight,
    sentiment: Math.round(sentiment * 100) / 100,
    hypyVelocity: Math.round(hypyVelocity * 100) / 100,
    vixLevel: Math.round(vixLevel * 10) / 10,
    fearGreedTilt
  }
}

/**
 * Format time-ago string
 */
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return 'Long time ago'
}

/**
 * Determine signal freshness category
 */
export function getSignalFreshness(timestamp: number): 'new' | 'fresh' | 'recent' | 'stale' {
  const now = Date.now()
  const hoursDiff = (now - timestamp) / (1000 * 60 * 60)

  if (hoursDiff < 2) return 'new'
  if (hoursDiff < 6) return 'fresh'
  if (hoursDiff < 24) return 'recent'
  return 'stale'
}

/**
 * Calculate signal distribution stats for market snapshot
 */
export function calculateSignalDistribution(
  stocks: Array<{
    signal: 'bullish' | 'bearish' | 'neutral'
    hybridScore: number
  }>
): {
  strongBuy: number
  buy: number
  hold: number
  sell: number
  strongSell: number
  total: number
} {
  let strongBuy = 0
  let buy = 0
  let hold = 0
  let sell = 0
  let strongSell = 0

  stocks.forEach(stock => {
    if (stock.hybridScore >= 80) strongBuy++
    else if (stock.hybridScore >= 65) buy++
    else if (stock.hybridScore >= 40) hold++
    else if (stock.hybridScore >= 25) sell++
    else strongSell++
  })

  return {
    strongBuy,
    buy,
    hold,
    sell,
    strongSell,
    total: stocks.length
  }
}

