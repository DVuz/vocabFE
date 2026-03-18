import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../../shared/store/auth.store'
import { fetchReviewSessionDetail, fetchReviewSessions } from '../api/review-history.api'

export function useReviewSessions(page: number, pageSize: number) {
  const accessToken = useAuthStore(state => state.accessToken)
  const user = useAuthStore(state => state.user)
  const isLoggedIn = Boolean(accessToken && user)

  const query = useQuery({
    queryKey: ['review-sessions', page, pageSize],
    queryFn: () => fetchReviewSessions({ page, pageSize }),
    enabled: isLoggedIn,
  })

  return {
    isLoggedIn,
    sessions: query.data?.data ?? [],
    pagination: query.data?.pagination ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}

export function useReviewSessionDetail(sessionId: number | null) {
  const accessToken = useAuthStore(state => state.accessToken)
  const user = useAuthStore(state => state.user)
  const isLoggedIn = Boolean(accessToken && user)

  return useQuery({
    queryKey: ['review-session-detail', sessionId],
    queryFn: () => fetchReviewSessionDetail(sessionId as number),
    enabled: isLoggedIn && Number.isInteger(sessionId) && (sessionId ?? 0) > 0,
  })
}
