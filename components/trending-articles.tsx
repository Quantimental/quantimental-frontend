'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, TrendingUp, ExternalLink, Newspaper, TrendingDown, ArrowRight, BarChart3 } from 'lucide-react'
import { ingestionService } from '@/lib/api-services'
import type { NewsArticle } from '@/lib/api-services'

type Article = {
  id: string
  title: string
  description?: string
  source: string
  time: string
  url: string
  imageUrl?: string
  sentiment?: string
  impact?: string
  tickers?: string[]
  mentions?: number
  mentionVelocity?: string
}

function formatTimeAgo(publishedAt: string): string {
  try {
    const date = new Date(publishedAt)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  } catch {
    return 'Recently'
  }
}

function getSentimentColor(sentiment?: string): string {
  switch (sentiment) {
    case 'bullish':
      return 'text-green-500'
    case 'bearish':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}

function getSentimentBadgeVariant(sentiment?: string): 'default' | 'destructive' | 'secondary' {
  switch (sentiment) {
    case 'bullish':
      return 'default'
    case 'bearish':
      return 'destructive'
    default:
      return 'secondary'
  }
}

function getImpactBadgeColor(impact?: string): string {
  switch (impact) {
    case 'high':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    case 'medium':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/30'
    case 'low':
      return 'bg-gray-500/10 text-gray-400 border-gray-500/30'
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/30'
  }
}

function getMomentumIcon(mentionVelocity?: string) {
  switch (mentionVelocity) {
    case 'rising':
      return <TrendingUp className="w-3 h-3" />
    case 'falling':
      return <TrendingDown className="w-3 h-3" />
    default:
      return <ArrowRight className="w-3 h-3" />
  }
}

function getMomentumText(mentionVelocity?: string): string {
  switch (mentionVelocity) {
    case 'rising':
      return 'Momentum rising'
    case 'falling':
      return 'Momentum falling'
    default:
      return 'Steady'
  }
}

export function TrendingArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTrendingArticles() {
      try {
        setLoading(true)
        setError(null)
        const response = await ingestionService.getTrendingArticles()

        const mapped = response.articles.map((article: NewsArticle, index: number) => ({
          id: article.url || `article-${index}`,
          title: article.title,
          description: article.summary,
          source: article.source,
          time: formatTimeAgo(article.published_at),
          url: article.url,
          imageUrl: article.image_url,
          sentiment: article.sentiment,
          impact: article.impact,
          tickers: article.tickers || [],
          mentions: Math.floor(Math.random() * 3000) + 500, // TODO: Get from backend
          mentionVelocity: ['rising', 'falling', 'steady'][Math.floor(Math.random() * 3)], // TODO: Get from backend
        }))

        setArticles(mapped)
      } catch (err) {
        console.error('Failed to fetch trending articles:', err)
        setError(err instanceof Error ? err.message : 'Failed to load articles')
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingArticles()
  }, [])

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h2 className="text-2xl font-bold">Trending Articles</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h2 className="text-2xl font-bold">Trending Articles</h2>
        </div>
        <Card className="p-6 text-center border-destructive/30">
          <Newspaper className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">{error}</p>
        </Card>
      </section>
    )
  }

  if (articles.length === 0) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h2 className="text-2xl font-bold">Trending Articles</h2>
        </div>
        <Card className="p-6 text-center">
          <Newspaper className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">No trending articles available</p>
        </Card>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-accent" />
        <h2 className="text-2xl font-bold">Trending Articles</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((article, index) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card
              className="p-5 hover:shadow-lg transition-all cursor-pointer group border-border/50 hover:border-accent/30 animate-fade-in-up"
              style={{
                animation: `fade-in-up 0.5s ease-out ${index * 0.1}s backwards`
              }}
            >
              <div className="space-y-3">
                {/* Title with external link icon */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold leading-tight text-pretty group-hover:text-accent transition-colors flex-1">
                    {article.title}
                  </h3>
                  <ExternalLink className="w-4 h-4 flex-shrink-0 text-muted-foreground group-hover:text-accent transition-colors mt-0.5" />
                </div>

                {/* Source and time */}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-medium">{article.source}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.time}</span>
                  </div>
                </div>

                {/* Momentum and mentions */}
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    {getMomentumIcon(article.mentionVelocity)}
                    <span>{getMomentumText(article.mentionVelocity)}</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {article.mentions?.toLocaleString()} mentions
                  </span>
                </div>

                {/* Sentiment and Impact badges + Tickers */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  {/* Sentiment badge */}
                  {article.sentiment && (
                    <Badge
                      variant={getSentimentBadgeVariant(article.sentiment)}
                      className="capitalize"
                    >
                      {article.sentiment}
                    </Badge>
                  )}

                  {/* Impact badge */}
                  {article.impact && (
                    <Badge
                      variant="outline"
                      className={`capitalize ${getImpactBadgeColor(article.impact)}`}
                    >
                      {article.impact}
                    </Badge>
                  )}

                  {/* Stock tickers */}
                  {article.tickers && article.tickers.length > 0 && (
                    <>
                      {article.tickers.slice(0, 3).map((ticker, i) => (
                        <Badge
                          key={ticker}
                          variant="secondary"
                          className="bg-green-500/10 text-green-400 border-green-500/20 font-mono text-xs"
                        >
                          {ticker}
                        </Badge>
                      ))}
                      {article.tickers.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{article.tickers.length - 3} more
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Card>
          </a>
        ))}
      </div>
    </section>
  )
}
