import { apiGet, apiPost, type ApiResponse } from '../../../shared/api'
import type {
  QuizCard,
  QuizQueuePayload,
  QuizQueueQuery,
  QuizSubmitPayload,
  QuizSubmitResult,
} from '../types/quiz.types'

export async function fetchQuizQueue(query: QuizQueueQuery) {
  const response = await apiGet<ApiResponse<QuizCard[]>>('/review-tests/queue', {
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
  } satisfies QuizQueuePayload
}

export async function submitQuizSession(payload: QuizSubmitPayload) {
  const response = await apiPost<ApiResponse<QuizSubmitResult>, QuizSubmitPayload>(
    '/review-tests/sessions',
    payload,
  )

  return response.data
}
