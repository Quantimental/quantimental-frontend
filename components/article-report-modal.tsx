'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, Send, Bot, User } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getArticleDetails, type NewsArticle, type ArticleDetails } from '@/lib/news-api'
import { formatDistanceToNow } from 'date-fns'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface ArticleReportModalProps {
  article: NewsArticle
  ticker: string
  onClose: () => void
}

export function ArticleReportModal({ article: initialArticle, ticker, onClose }: ArticleReportModalProps) {
  const [article, setArticle] = useState<ArticleDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [question, setQuestion] = useState('')
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [chatLoading, setChatLoading] = useState(false)

  useEffect(() => {
    async function loadArticle() {
      try {
        setLoading(true)
        // Try to load full article details, but if it fails, use initial article data
        try {
          const details = await getArticleDetails(initialArticle.id)
          setArticle(details)
          // Auto-generate summary immediately
          await generateSummary(details)
        } catch (apiError: any) {
          // If article not found by ID, use initial article data (might be from SentimentEvent)
          console.warn('Article details not found, using initial article data:', apiError)
          // Use initial article as ArticleDetails
          const articleData = {
            ...initialArticle,
            content: initialArticle.content || undefined,
            summary: undefined,
            author: undefined,
          } as ArticleDetails
          setArticle(articleData)
          await generateSummary(articleData)
        }
      } catch (err) {
        console.error('Failed to load article:', err)
        // Fallback: use initial article data
        const articleData = {
          ...initialArticle,
          content: initialArticle.content || undefined,
          summary: undefined,
          author: undefined,
        } as ArticleDetails
        setArticle(articleData)
        await generateSummary(articleData)
      } finally {
        setLoading(false)
      }
    }

    loadArticle()
  }, [initialArticle.id])

  async function generateSummary(articleData: ArticleDetails | NewsArticle) {
    try {
      setSummaryLoading(true)
      
      // Generate summary immediately (no delay)
      const sentimentText = articleData.impact.sentiment === 'bullish' 
        ? 'positive' 
        : articleData.impact.sentiment === 'bearish' 
        ? 'negative' 
        : 'neutral'
      
      const impactText = articleData.impact.impact === 'high'
        ? 'significant'
        : articleData.impact.impact === 'medium'
        ? 'moderate'
        : 'minimal'

      const sentimentScore = (articleData.sentiment?.score || 0)
      const sentimentLabel = articleData.sentiment?.label || 'neutral'
      const confidence = (articleData.sentiment?.confidence || 0) * 100

      const summary = `This article discusses ${ticker} with a ${sentimentText} sentiment and ${impactText} potential impact on the stock price. ` +
        `Based on our ML sentiment analysis, the article has a sentiment score of ${sentimentScore.toFixed(2)} ` +
        `(${sentimentLabel}) with ${confidence.toFixed(0)}% confidence. ` +
        `The impact rating suggests this news could have a ${impactText} effect on ${ticker}'s stock performance.`

      // Set summary immediately
      setAiSummary(summary)
      setSummaryLoading(false)
    } catch (err) {
      console.error('Failed to generate summary:', err)
      setAiSummary('Unable to generate summary at this time.')
      setSummaryLoading(false)
    }
  }

  function extractNegativePhrases(content: string): string[] {
    if (!content) return []
    
    // Common negative keywords/phrases for stock analysis
    const negativePatterns = [
      /\b(decline|fall|drop|plunge|crash|tumble|sink|slump|dip|retreat)\b/gi,
      /\b(concern|worr|risk|threat|challenge|problem|issue|trouble)\b/gi,
      /\b(overvalued|expensive|bubble|speculative|risky)\b/gi,
      /\b(competition|competitor|losing|declining|shrinking)\b/gi,
      /\b(uncertain|volatile|unstable|unpredictable)\b/gi,
      /\b(bearish|negative|pessimistic|doubtful|skeptical)\b/gi,
      /\b(sell|avoid|warning|caution|red flag)\b/gi,
    ]
    
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
    const negativeSentences: string[] = []
    
    for (const sentence of sentences) {
      for (const pattern of negativePatterns) {
        if (pattern.test(sentence)) {
          negativeSentences.push(sentence.trim())
          break
        }
      }
    }
    
    return negativeSentences.slice(0, 5) // Return top 5 most relevant
  }

  function extractPositivePhrases(content: string): string[] {
    if (!content) return []
    
    const positivePatterns = [
      /\b(rise|gain|surge|jump|soar|rally|climb|boost|growth)\b/gi,
      /\b(opportunity|potential|strength|advantage|benefit)\b/gi,
      /\b(undervalued|cheap|bargain|attractive|promising)\b/gi,
      /\b(leading|dominant|strong|robust|solid)\b/gi,
      /\b(bullish|positive|optimistic|confident|upbeat)\b/gi,
      /\b(buy|recommend|outperform|upgrade|target)\b/gi,
    ]
    
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
    const positiveSentences: string[] = []
    
    for (const sentence of sentences) {
      for (const pattern of positivePatterns) {
        if (pattern.test(sentence)) {
          positiveSentences.push(sentence.trim())
          break
        }
      }
    }
    
    return positiveSentences.slice(0, 5)
  }

  async function handleQuestionSubmit() {
    if (!question.trim() || chatLoading) return

    const userQuestion = question
    setQuestion('')
    setChatHistory(prev => [...prev, { role: 'user', content: userQuestion }])
    setChatLoading(true)

    try {
      // Use current article data (either loaded or initial)
      const currentArticle = article || initialArticle
      const impact = currentArticle.impact
      const sentiment = currentArticle.sentiment
      const articleContent = currentArticle.content || currentArticle.title || ''
      
      // Analyze article content for specific quotes
      const negativePhrases = extractNegativePhrases(articleContent)
      const positivePhrases = extractPositivePhrases(articleContent)
      
      // TODO: Call AI Q&A endpoint for more sophisticated analysis
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let response = ''
      const questionLower = userQuestion.toLowerCase()
      
      // Check if user wants specific quotes/examples
      if (questionLower.includes('what') && (questionLower.includes('negative') || questionLower.includes('bearish') || questionLower.includes('why'))) {
        if (impact.sentiment === 'bearish' && negativePhrases.length > 0) {
          response = `Based on the article content, here are specific quotes that contribute to the negative sentiment:\n\n` +
            negativePhrases.map((phrase, idx) => `"${phrase}..."`).join('\n\n') +
            `\n\nThese statements suggest concerns or challenges that could negatively impact ${ticker}'s stock performance. ` +
            `Our ML model scored this at ${(sentiment?.score || 0).toFixed(2)} (${sentiment?.label || 'negative'}) with ${((sentiment?.confidence || 0) * 100).toFixed(0)}% confidence.`
        } else if (impact.sentiment === 'bullish' && positivePhrases.length > 0) {
          response = `Based on the article content, here are specific quotes that contribute to the positive sentiment:\n\n` +
            positivePhrases.map((phrase, idx) => `"${phrase}..."`).join('\n\n') +
            `\n\nThese statements suggest positive factors that could benefit ${ticker}'s stock performance. ` +
            `Our ML model scored this at ${(sentiment?.score || 0).toFixed(2)} (${sentiment?.label || 'positive'}) with ${((sentiment?.confidence || 0) * 100).toFixed(0)}% confidence.`
        } else {
          response = `The article content is not fully available for detailed analysis. ` +
            `However, our ML sentiment analysis shows ${impact.sentiment} sentiment (score: ${(sentiment?.score || 0).toFixed(2)}) with ${impact.impact} impact. ` +
            `The title "${currentArticle.title}" suggests ${impact.sentiment === 'bearish' ? 'negative' : 'positive'} implications for ${ticker}. ` +
            `\n\nTo get specific quotes, the full article content would need to be available. You can read the original article at: ${currentArticle.url}`
        }
      } else if (questionLower.includes('sentiment')) {
        const sentimentText = impact.sentiment === 'bullish' ? 'positive' : impact.sentiment === 'bearish' ? 'negative' : 'neutral'
        const score = (sentiment?.score || 0).toFixed(2)
        const confidence = ((sentiment?.confidence || 0) * 100).toFixed(0)
        
        if (impact.sentiment === 'bearish' && negativePhrases.length > 0) {
          response = `Based on our ML sentiment analysis, this article has a ${sentimentText} sentiment (${impact.sentiment}) with ${impact.impact} impact. ` +
            `The sentiment score is ${score} (${sentiment?.label || 'negative'}) with ${confidence}% confidence.\n\n` +
            `Key negative points from the article:\n` +
            negativePhrases.slice(0, 3).map(p => `• "${p}..."`).join('\n') +
            `\n\nThis suggests negative implications for ${ticker}'s stock price.`
        } else {
          response = `Based on our ML sentiment analysis, this article has a ${sentimentText} sentiment (${impact.sentiment}) with ${impact.impact} impact. ` +
            `The sentiment score is ${score} (${sentiment?.label || 'neutral'}) with ${confidence}% confidence. ` +
            `This suggests ${impact.sentiment === 'bullish' ? 'positive' : impact.sentiment === 'bearish' ? 'negative' : 'neutral'} implications for ${ticker}'s stock price.`
        }
      } else if (questionLower.includes('impact') || questionLower.includes('affect')) {
        const impactText = impact.impact === 'high' ? 'significant' : impact.impact === 'medium' ? 'moderate' : 'minimal'
        response = `This article has a ${impact.impact} impact rating (${impact.score}/100), which suggests a ${impactText} potential effect on ${ticker}'s stock performance. ` +
          `The ${impact.sentiment} sentiment indicates ${impact.sentiment === 'bullish' ? 'positive' : impact.sentiment === 'bearish' ? 'negative' : 'neutral'} market implications. ` +
          `Investors should consider this ${impact.impact === 'high' ? 'carefully' : impact.impact === 'medium' ? 'moderately' : 'as part of overall analysis'}.`
      } else if (questionLower.includes('what') || questionLower.includes('about')) {
        response = `This article discusses "${currentArticle.title}". ` +
          `Our analysis shows ${impact.sentiment} sentiment with ${impact.impact} impact (${impact.score}/100). ` +
          `The sentiment score is ${(sentiment?.score || 0).toFixed(2)} (${sentiment?.label || 'neutral'}) with ${((sentiment?.confidence || 0) * 100).toFixed(0)}% confidence. ` +
          `Would you like to know more about the sentiment analysis or potential impact on ${ticker}?`
      } else {
        response = `I can help you understand this article about ${ticker}. ` +
          `The article shows ${impact.sentiment} sentiment with ${impact.impact} impact. ` +
          `Our ML model scored it at ${(sentiment?.score || 0).toFixed(2)} with ${((sentiment?.confidence || 0) * 100).toFixed(0)}% confidence. ` +
          `What specific aspect would you like to know more about?`
      }

      setChatHistory(prev => [...prev, { role: 'assistant', content: response }])
    } catch (err) {
      console.error('Failed to get AI response:', err)
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }])
    } finally {
      setChatLoading(false)
    }
  }

  const displayArticle = article || initialArticle

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold mb-2">
                {displayArticle.title}
              </DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={
                    displayArticle.impact.sentiment === 'bullish'
                      ? 'border-success text-success'
                      : displayArticle.impact.sentiment === 'bearish'
                      ? 'border-destructive text-destructive'
                      : 'border-muted-foreground text-muted-foreground'
                  }
                >
                  {displayArticle.impact.sentiment === 'bullish' ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : displayArticle.impact.sentiment === 'bearish' ? (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  ) : (
                    <Minus className="w-3 h-3 mr-1" />
                  )}
                  {displayArticle.impact.sentiment.toUpperCase()}
                </Badge>

                <Badge
                  variant="secondary"
                  className={
                    displayArticle.impact.impact === 'high'
                      ? 'bg-destructive/20 text-destructive'
                      : displayArticle.impact.impact === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-600'
                      : 'bg-muted text-muted-foreground'
                  }
                >
                  {displayArticle.impact.impact === 'high' ? '🔥 High Impact' :
                   displayArticle.impact.impact === 'medium' ? '⚡ Medium Impact' :
                   '💡 Low Impact'} ({displayArticle.impact.score}/100)
                </Badge>

                {displayArticle.published_at && (
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(displayArticle.published_at), { addSuffix: true })}
                  </span>
                )}

                <span className="text-sm text-muted-foreground">
                  {displayArticle.source}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Article Content */}
          <ScrollArea className="flex-1 px-6 py-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* AI Summary */}
                <div className="p-4 rounded-lg bg-accent/30 border border-accent/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-accent-foreground" />
                    <h3 className="text-sm font-semibold">AI-Generated Summary</h3>
                  </div>
                  {summaryLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Generating summary...
                    </div>
                  ) : aiSummary ? (
                    <p className="text-sm text-foreground leading-relaxed">{aiSummary}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Summary will be generated shortly...</p>
                  )}
                </div>

                {/* Article Image */}
                {displayArticle.image_url && (
                  <img
                    src={displayArticle.image_url}
                    alt={displayArticle.title}
                    className="w-full rounded-lg object-cover max-h-64"
                  />
                )}

                {/* Article Content */}
                {displayArticle.content ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {displayArticle.content}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Full article content is not available. 
                    <a 
                      href={displayArticle.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-1 text-accent hover:underline"
                    >
                      Read original article →
                    </a>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* AI Agent Sidebar */}
          <div className="w-80 border-l flex flex-col bg-muted/30">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-accent-foreground" />
                <h3 className="font-semibold">Ask AI Agent</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ask questions about this article and {ticker}
              </p>
            </div>

            {/* Chat History */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatHistory.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-8">
                    <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Ask me anything about this article!</p>
                    <p className="text-xs mt-2">Try: "What's the sentiment?" or "How will this affect the stock?"</p>
                  </div>
                )}
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-2 text-sm ${
                        msg.role === 'user'
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-background border border-border'
                      }`}
                    >
                      {msg.content}
                    </div>
                    {msg.role === 'user' && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex gap-2 justify-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-background border border-border rounded-lg p-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask about the article..."
                  className="min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleQuestionSubmit()
                    }
                  }}
                />
                <Button
                  onClick={handleQuestionSubmit}
                  disabled={!question.trim() || chatLoading}
                  size="icon"
                  className="flex-shrink-0"
                >
                  {chatLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

