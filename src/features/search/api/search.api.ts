import type { ApiError, ApiResponse } from '../../../shared/api'
import { apiGet, apiPost } from '../../../shared/api'
import type { WordData } from '../types/search.types'

interface SaveMeaningPayload {
  meaningId: number
}

export async function fetchWordDetail(word: string) {
  const encodedWord = encodeURIComponent(word)
  const response = await apiGet<ApiResponse<WordData>>(`/words/${encodedWord}`)
  return response.data
}

export async function saveMeaningToUserWords(meaningId: number) {
  return apiPost<ApiResponse<unknown>, SaveMeaningPayload>('/user-words', { meaningId })
}

export function isApiError(error: unknown): error is ApiError {
  return Boolean(error && typeof error === 'object' && 'status' in (error as Record<string, unknown>))
}
