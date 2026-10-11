import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../../shared/store/auth.store'
import { fetchWordListItems, fetchWordLists } from '../api/word-list.api'

export function useWordLists() {
  const accessToken = useAuthStore(state => state.accessToken)
  const user = useAuthStore(state => state.user)
  const isLoggedIn = Boolean(accessToken && user)

  return useQuery({
    queryKey: ['word-lists'],
    queryFn: fetchWordLists,
    enabled: isLoggedIn,
  })
}

export function useWordListItems(listId: number) {
  const accessToken = useAuthStore(state => state.accessToken)
  const user = useAuthStore(state => state.user)
  const isLoggedIn = Boolean(accessToken && user)

  return useQuery({
    queryKey: ['word-list-items', listId],
    queryFn: () => fetchWordListItems(listId),
    enabled: isLoggedIn && Number.isInteger(listId) && listId > 0,
  })
}
