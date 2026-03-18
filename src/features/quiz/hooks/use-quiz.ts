import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../../shared/store/auth.store'
import { fetchQuizQueue, submitQuizSession } from '../api/quiz.api'
import type { QuizQueueQuery, QuizSubmitPayload } from '../types/quiz.types'

export function useQuizQueue(query: QuizQueueQuery) {
  const accessToken = useAuthStore(state => state.accessToken)
  const user = useAuthStore(state => state.user)
  const isLoggedIn = Boolean(accessToken && user)

  const request = useQuery({
    queryKey: ['quiz-queue', query.page, query.pageSize, query.status],
    queryFn: () => fetchQuizQueue(query),
    enabled: isLoggedIn,
  })

  return {
    isLoggedIn,
    rows: request.data?.data ?? [],
    pagination: request.data?.pagination ?? null,
    isLoading: request.isLoading,
    isError: request.isError,
    error: request.error,
    refetch: request.refetch,
  }
}

export function submitBulkQuiz(payload: QuizSubmitPayload) {
  return submitQuizSession(payload)
}
