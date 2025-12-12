/**
 * Stock Analysis Hooks
 *
 * Specialized hooks for analyzing stocks using the backend API
 */

'use client'

import { useCallback } from 'react'
import { useMutation } from './use-api'
import { apiServices, AnalyzeStockResponse, AnalyzeMultipleResponse } from '../api-services'

/**
 * Hook for analyzing a single stock
 */
export function useAnalyzeStock(options?: {
  onSuccess?: (data: AnalyzeStockResponse) => void
  onError?: (error: string) => void
}) {
  return useMutation<AnalyzeStockResponse, string>(
    async (ticker: string) => {
      return await apiServices.ingestion.analyzeStock(ticker)
    },
    options
  )
}

/**
 * Hook for analyzing multiple stocks
 */
export function useAnalyzeMultipleStocks(options?: {
  onSuccess?: (data: AnalyzeMultipleResponse) => void
  onError?: (error: string) => void
}) {
  return useMutation<AnalyzeMultipleResponse, string[]>(
    async (tickers: string[]) => {
      return await apiServices.ingestion.analyzeMultiple(tickers)
    },
    options
  )
}

/**
 * Convenience hook that provides both single and multiple analysis
 */
export function useStockAnalysis() {
  const analyzeSingle = useAnalyzeStock()
  const analyzeMultiple = useAnalyzeMultipleStocks()

  const analyzeStock = useCallback(
    async (ticker: string) => {
      return await analyzeSingle.mutate(ticker)
    },
    [analyzeSingle]
  )

  const analyzeStocks = useCallback(
    async (tickers: string[]) => {
      return await analyzeMultiple.mutate(tickers)
    },
    [analyzeMultiple]
  )

  return {
    // Single stock analysis
    analyzeStock,
    singleLoading: analyzeSingle.loading,
    singleError: analyzeSingle.error,
    singleData: analyzeSingle.data,
    resetSingle: analyzeSingle.reset,

    // Multiple stocks analysis
    analyzeStocks,
    multipleLoading: analyzeMultiple.loading,
    multipleError: analyzeMultiple.error,
    multipleData: analyzeMultiple.data,
    resetMultiple: analyzeMultiple.reset,

    // Combined loading state
    loading: analyzeSingle.loading || analyzeMultiple.loading,
  }
}
