'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, TrendingUp, ExternalLink, Newspaper } from 'lucide-react'
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
          description: article.description,
          source: article.source,
          time: formatTimeAgo(article.published_at),
          url: article.url,
          imageUrl: article.image_url,
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
              className="p-4 hover:shadow-lg transition-all cursor-pointer group border-l-4 border-blue-500/30 bg-blue-500/5 animate-fade-in-up"
              style={{
                animation: `fade-in-up 0.5s ease-out ${index * 0.1}s backwards`
              }}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold leading-tight text-pretty group-hover:text-accent transition-colors">
                    {article.title}
                  </h3>
                  <ExternalLink className="w-4 h-4 flex-shrink-0 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>

                {article.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm pt-2 border-t border-border/30">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="font-medium">{article.source}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </a>
        ))}
      </div>
    </section>
  )
}
