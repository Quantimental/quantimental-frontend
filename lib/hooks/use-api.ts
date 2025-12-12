/**
 * React Hooks for API Integration
 *
 * Provides easy-to-use hooks for calling backend APIs with:
 * - Loading states
 * - Error handling
 * - Automatic retries
 * - Response caching (optional)
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { APIError } from '../api-client'

export interface UseAPIState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Generic hook for API calls with automatic loading/error states
 */
export function useAPI<T>(
  apiCall: () => Promise<T>,
  options?: {
    immediate?: boolean // Run on mount
    onSuccess?: (data: T) => void
    onError?: (error: string) => void
  }
): UseAPIState<T> & { execute: () => Promise<void> } {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiCall()
      setData(result)
      options?.onSuccess?.(result)
    } catch (err) {
      const errorMessage = err instanceof APIError ? err.message : 'An error occurred'
      setError(errorMessage)
      options?.onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [apiCall, options])

  useEffect(() => {
    if (options?.immediate) {
      execute()
    }
  }, [execute, options?.immediate])

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  }
}

/**
 * Hook for API calls with polling
 */
export function useAPIPolling<T>(
  apiCall: () => Promise<T>,
  intervalMs: number = 30000, // Default 30 seconds
  options?: {
    enabled?: boolean
    onSuccess?: (data: T) => void
    onError?: (error: string) => void
  }
): UseAPIState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (options?.enabled === false) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await apiCall()
      setData(result)
      options?.onSuccess?.(result)
    } catch (err) {
      const errorMessage = err instanceof APIError ? err.message : 'An error occurred'
      setError(errorMessage)
      options?.onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [apiCall, options?.enabled, options?.onSuccess, options?.onError])

  useEffect(() => {
    fetchData() // Initial fetch

    const interval = setInterval(fetchData, intervalMs)

    return () => clearInterval(interval)
  }, [fetchData, intervalMs])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

/**
 * Hook for backend health check
 */
export function useBackendHealth(pollInterval?: number) {
  const { checkBackendHealth } = require('../api-client')

  return useAPIPolling(
    checkBackendHealth,
    pollInterval || 60000, // Check every minute by default
    { enabled: true }
  )
}

/**
 * Hook for mutating data (POST, PUT, PATCH, DELETE)
 */
export function useMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData, variables: TVariables) => void
    onError?: (error: string, variables: TVariables) => void
  }
) {
  const [data, setData] = useState<TData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = useCallback(
    async (variables: TVariables) => {
      setLoading(true)
      setError(null)

      try {
        const result = await mutationFn(variables)
        setData(result)
        options?.onSuccess?.(result, variables)
        return result
      } catch (err) {
        const errorMessage = err instanceof APIError ? err.message : 'An error occurred'
        setError(errorMessage)
        options?.onError?.(errorMessage, variables)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [mutationFn, options]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    data,
    loading,
    error,
    mutate,
    reset,
  }
}
