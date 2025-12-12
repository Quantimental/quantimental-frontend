'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getNewsForTicker, type NewsArticle } from '@/lib/news-api'

type StockNewsHeadlinesProps = {
  ticker: string
  onArticleClick?: (article: NewsArticle) => void
}

export function StockNewsHeadlines({ ticker, onArticleClick }: StockNewsHeadlinesProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true)
        setError(null)
        const data = await getNewsForTicker(ticker, 3)
        setArticles(data.articles || [])
      } catch (err) {
        console.error('Error fetching news:', err)
        setError('Failed to load news')
      } finally {
        setLoading(false)
      }
    }

    if (ticker) {
      fetchNews()
    }
  }, [ticker])

  if (loading) {
    return (
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-accent uppercase">Recent News</h4>
        <div className="text-xs text-muted-foreground">Loading news...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-accent uppercase">Recent News</h4>
        <div className="text-xs text-muted-foreground">{error}</div>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-accent uppercase">Recent News</h4>
        <div className="text-xs text-muted-foreground">No recent news available</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-accent uppercase">Recent News</h4>
      <div className="space-y-2">
        {articles.map((article) => {
          const sentiment = article.impact?.sentiment || 'neutral'
          const impact = article.impact?.impact || 'low'
          const impactScore = article.impact?.score || 0

          const sentimentIcon =
            sentiment === 'bullish' ? TrendingUp :
            sentiment === 'bearish' ? TrendingDown :
            Minus

          const sentimentColor =
            sentiment === 'bullish' ? 'text-success border-success' :
            sentiment === 'bearish' ? 'text-destructive border-destructive' :
            'text-muted-foreground border-muted-foreground'

          const impactColor =
            impact === 'high' ? 'bg-orange-500/20 text-orange-500 border-orange-500/50' :
            impact === 'medium' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' :
            'bg-muted/20 text-muted-foreground border-muted-foreground/50'

          return (
            <div
              key={article.id}
              onClick={() => onArticleClick?.(article)}
              className="p-3 rounded-lg border border-border/50 hover:border-accent/50 hover:bg-accent/5 cursor-pointer transition-smooth group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h5 className="text-sm font-medium flex-1 group-hover:text-accent transition-smooth line-clamp-2">
                  {article.title}
                </h5>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent flex-shrink-0 mt-0.5" />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={`${sentimentColor} text-xs`}
                >
                  <sentimentIcon className="w-3 h-3 mr-1" />
                  {sentiment.toUpperCase()}
                </Badge>

                <Badge
                  variant="outline"
                  className={`${impactColor} text-xs`}
                >
                  {impact.toUpperCase()} Impact ({impactScore.toFixed(0)})
                </Badge>

                {article.source && (
                  <span className="text-xs text-muted-foreground">
                    {article.source}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
