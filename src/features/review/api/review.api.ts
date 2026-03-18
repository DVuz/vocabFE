import { apiGet, type ApiResponse } from '../../../shared/api'
import type { ReviewCard, ReviewPayload, ReviewQuery } from '../types/review.types'

async function fetchReviewByEndpoint(endpoint: '/review/today' | '/review/practice-queue', params: ReviewQuery) {
  const response = await apiGet<ApiResponse<ReviewCard[]>>(endpoint, {
    params,
  })

  const pagination = response.pagination
    ? {
        total: response.pagination.total,
        page: response.pagination.page,
        pageSize: response.pagination.pageSize,
        totalPages: response.pagination.totalPages,
        hasNext: Boolean(response.pagination.hasNext),
        hasPrev: Boolean(response.pagination.hasPrev),
      }
    : {
        total: (response.data ?? []).length,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      }

  return {
    data: response.data ?? [],
    pagination,
  } satisfies ReviewPayload
}

export function fetchTodayDueWords(params: ReviewQuery) {
  return fetchReviewByEndpoint('/review/today', params)
}

export function fetchPracticeQueue(params: ReviewQuery) {
  return fetchReviewByEndpoint('/review/practice-queue', params)
}
