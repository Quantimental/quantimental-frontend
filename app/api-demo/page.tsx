/**
 * API Integration Demo Page
 *
 * Demonstrates the backend API integration
 */

'use client'

import { StockAnalyzer } from '@/components/stock-analyzer'
import { useBackendHealth } from '@/lib/hooks/use-api'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function APIDemoPage() {
  const { data: health, loading: healthLoading } = useBackendHealth(10000) // Check every 10 seconds

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-accent-foreground"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                  <polyline points="16 7 22 7 22 13"></polyline>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Quantimental</h1>
                <p className="text-xs text-muted-foreground">API Demo</p>
              </div>
            </Link>
          </div>

          {/* Backend Status */}
          <div className="flex items-center gap-2">
            {healthLoading ? (
              <Badge variant="outline" className="gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Checking...
              </Badge>
            ) : health?.healthy ? (
              <Badge className="gap-2 bg-green-500/10 text-green-500 border-green-500/50">
                <CheckCircle2 className="w-3 h-3" />
                Backend Online
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-2">
                <XCircle className="w-3 h-3" />
                Backend Offline
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Introduction */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            API Integration Demo
          </h1>
          <p className="text-lg text-muted-foreground">
            Test the live connection between frontend and backend
          </p>
        </div>

        {/* Backend Info */}
        {health && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-bold">Backend Status</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Status</p>
                <p className="font-semibold">
                  {health.healthy ? '✅ Healthy' : '❌ Unhealthy'}
                </p>
              </div>
              {health.details && typeof health.details === 'object' && (
                <>
                  {'service' in health.details && (
                    <div>
                      <p className="text-muted-foreground mb-1">Service</p>
                      <p className="font-semibold">{String(health.details.service)}</p>
                    </div>
                  )}
                  {'version' in health.details && (
                    <div>
                      <p className="text-muted-foreground mb-1">Version</p>
                      <p className="font-semibold">{String(health.details.version)}</p>
                    </div>
                  )}
                  {'environment' in health.details && (
                    <div>
                      <p className="text-muted-foreground mb-1">Environment</p>
                      <p className="font-semibold">{String(health.details.environment)}</p>
                    </div>
                  )}
                </>
              )}
            </div>
            {health.message && (
              <p className="text-sm text-muted-foreground">{health.message}</p>
            )}
          </Card>
        )}

        {/* Stock Analyzer */}
        <StockAnalyzer />

        {/* Instructions */}
        <Card className="p-6 space-y-4 bg-accent/5">
          <h2 className="text-xl font-bold">How to Use</h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>1.</strong> Enter a stock ticker symbol (e.g., AAPL, TSLA, GOOGL)
            </p>
            <p>
              <strong>2.</strong> Click "Analyze" or press Enter
            </p>
            <p>
              <strong>3.</strong> The backend will analyze the stock using:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
              <li>Technical indicators (RSI, trend, volatility) - REAL DATA from Yahoo Finance</li>
              <li>Sentiment analysis (social media buzz, mentions) - Volume-based proxy</li>
              <li>Hybrid scoring (quantitative + psychological)</li>
            </ul>
            <p className="mt-4">
              <strong>Note:</strong> Price data and technical indicators are fetched in real-time from Yahoo Finance.
              Sentiment analysis currently uses trading volume as a proxy and will be enhanced with Reddit/Twitter integration.
            </p>
          </div>
        </Card>

        {/* API Endpoints */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Available Endpoints</h2>
          <div className="space-y-3 text-sm font-mono">
            <div className="rounded-lg border p-3 bg-muted/30">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">GET</Badge>
                <code>/health</code>
              </div>
              <p className="text-xs text-muted-foreground">Backend health check</p>
            </div>
            <div className="rounded-lg border p-3 bg-muted/30">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">POST</Badge>
                <code>/api/v1/ingestion/analyze</code>
              </div>
              <p className="text-xs text-muted-foreground">Analyze single stock</p>
            </div>
            <div className="rounded-lg border p-3 bg-muted/30">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">POST</Badge>
                <code>/api/v1/ingestion/analyze-multiple</code>
              </div>
              <p className="text-xs text-muted-foreground">Analyze multiple stocks</p>
            </div>
          </div>
          <div className="pt-4 border-t">
            <Link
              href="http://localhost:8000/docs"
              target="_blank"
              className="text-sm text-accent hover:underline"
            >
              View Full API Documentation →
            </Link>
          </div>
        </Card>
      </main>
    </div>
  )
}
