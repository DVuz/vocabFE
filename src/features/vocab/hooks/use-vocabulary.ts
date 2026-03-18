import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAuthStore } from '../../../shared/store/auth.store'
import { fetchVocabularyWords } from '../api/vocabulary.api'
import type { UserWordRow, VocabSearch } from '../types/vocabulary.types'

function matchesQuery(row: UserWordRow, query?: string) {
  if (!query) {
    return true
  }

  const needle = query.toLowerCase().trim()
  if (!needle) {
    return true
  }

  return (
    row.word.toLowerCase().includes(needle) ||
    row.definition.toLowerCase().includes(needle) ||
    (row.vnDefinition ?? '').toLowerCase().includes(needle)
  )
}

function isDueToday(nextReviewAt: string | null) {
  if (!nextReviewAt) {
    return false
  }

  const dueDate = new Date(nextReviewAt)
  const now = new Date()
  return dueDate <= now
}

export function useVocabulary(search: VocabSearch) {
  const accessToken = useAuthStore(state => state.accessToken)
  const user = useAuthStore(state => state.user)
  const isLoggedIn = Boolean(accessToken && user)

  const query = useQuery({
    queryKey: ['vocabulary-words', search.page, search.pageSize, search.status],
    queryFn: () =>
      fetchVocabularyWords({
        page: search.page,
        pageSize: search.pageSize,
        status: search.status,
      }),
    enabled: isLoggedIn,
  })

  const rows = query.data?.data ?? []
  const pagination = query.data?.pagination ?? null

  const filteredRows = useMemo(() => {
    return rows.filter(row => {
      if (!matchesQuery(row, search.q)) {
        return false
      }

      if (search.tab === 'due') {
        return isDueToday(row.nextReviewAt)
      }

      return true
    })
  }, [rows, search.q, search.tab])

  const total = search.tab === 'all' && !search.q ? (pagination?.total ?? filteredRows.length) : filteredRows.length

  return {
    isLoggedIn,
    rows: filteredRows,
    total,
    pagination,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
  }
}
