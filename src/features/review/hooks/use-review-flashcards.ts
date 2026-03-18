import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../../shared/store/auth.store'
import { fetchPracticeQueue, fetchTodayDueWords } from '../api/review.api'
import type { ReviewMode, ReviewQuery } from '../types/review.types'

export function useReviewFlashcards(mode: ReviewMode, query: ReviewQuery) {
  const accessToken = useAuthStore(state => state.accessToken)
  const user = useAuthStore(state => state.user)
  const isLoggedIn = Boolean(accessToken && user)

  const request = useQuery({
    queryKey: ['review-flashcards', mode, query.page, query.pageSize, query.status],
    queryFn: () =>
      mode === 'today'
        ? fetchTodayDueWords(query)
        : fetchPracticeQueue(query),
    enabled: isLoggedIn,
  })

  return {
    isLoggedIn,
    rows: request.data?.data ?? [],
    pagination: request.data?.pagination ?? null,
    isFetching: request.isFetching,
    isError: request.isError,
    error: request.error,
    refetch: request.refetch,
  }
}
