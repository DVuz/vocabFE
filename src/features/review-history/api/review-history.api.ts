import { apiGet, type ApiResponse } from '../../../shared/api'
import type {
  ReviewSessionDetail,
  ReviewSessionsPayload,
  ReviewSessionSummary,
} from '../types/review-history.types'

interface SessionsQuery {
  page: number
  pageSize: number
}

export async function fetchReviewSessions(query: SessionsQuery) {
  const response = await apiGet<ApiResponse<ReviewSessionSummary[]>>('/review-tests/sessions', {
    params: query,
  })

  return {
    data: response.data ?? [],
    pagination: response.pagination
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
          page: query.page,
          pageSize: query.pageSize,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
  } satisfies ReviewSessionsPayload
}

export async function fetchReviewSessionDetail(sessionId: number) {
  const response = await apiGet<ApiResponse<ReviewSessionDetail>>(`/review-tests/sessions/${sessionId}`)
  return response.data
}
