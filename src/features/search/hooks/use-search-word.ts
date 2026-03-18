import { useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useAuthStore } from '../../../shared/store/auth.store'
import { fetchWordDetail, isApiError, saveMeaningToUserWords } from '../api/search.api'
import type { Meaning, WordData } from '../types/search.types'

export function useSearchWord(word: string) {
  const navigate = useNavigate()
  const accessToken = useAuthStore(state => state.accessToken)

  const [query, setQuery] = useState(word)
  const [data, setData] = useState<WordData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showVN, setShowVN] = useState(true)
  const [savedMeaningIds, setSavedMeaningIds] = useState<Record<number, boolean>>({})
  const [savingMeaningIds, setSavingMeaningIds] = useState<Record<number, boolean>>({})
  const [saveErrors, setSaveErrors] = useState<Record<number, string | null>>({})

  useEffect(() => {
    let active = true

    setLoading(true)
    setError(null)
    setData(null)
    setQuery(word)

    fetchWordDetail(word)
      .then(payload => {
        if (!active) {
          return
        }

        setData(payload)
      })
      .catch(caughtError => {
        if (!active) {
          return
        }

        const message = isApiError(caughtError)
          ? (caughtError.message ?? 'Không tìm thấy từ này')
          : 'Lỗi kết nối, vui lòng thử lại'

        setError(message)
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [word])

  const grouped = useMemo(() => {
    const nextGrouped: Record<string, Meaning[]> = {}

    if (!data) {
      return nextGrouped
    }

    for (const meaning of data.meanings) {
      if (!nextGrouped[meaning.partOfSpeech]) {
        nextGrouped[meaning.partOfSpeech] = []
      }

      nextGrouped[meaning.partOfSpeech].push(meaning)
    }

    return nextGrouped
  }, [data])

  const posList = useMemo(() => Object.keys(grouped), [grouped])

  function handleSearch(event: FormEvent) {
    event.preventDefault()
    const trimmed = query.trim()

    if (trimmed) {
      navigate({ to: '/search/$word', params: { word: trimmed } })
    }
  }

  async function saveMeaning(meaningId: number) {
    if (savedMeaningIds[meaningId] || savingMeaningIds[meaningId]) {
      return
    }

    if (!accessToken) {
      setSaveErrors(previous => ({ ...previous, [meaningId]: 'Bạn cần đăng nhập để lưu từ' }))
      return
    }

    setSavingMeaningIds(previous => ({ ...previous, [meaningId]: true }))
    setSaveErrors(previous => ({ ...previous, [meaningId]: null }))

    try {
      await saveMeaningToUserWords(meaningId)
      setSavedMeaningIds(previous => ({ ...previous, [meaningId]: true }))
    } catch (caughtError) {
      if (isApiError(caughtError) && caughtError.status === 409) {
        setSavedMeaningIds(previous => ({ ...previous, [meaningId]: true }))
      } else {
        const message = isApiError(caughtError)
          ? (caughtError.message ?? 'Lưu thất bại')
          : 'Lỗi kết nối'

        setSaveErrors(previous => ({ ...previous, [meaningId]: message }))
      }
    } finally {
      setSavingMeaningIds(previous => ({ ...previous, [meaningId]: false }))
    }
  }

  return {
    word,
    query,
    setQuery,
    data,
    loading,
    error,
    showVN,
    setShowVN,
    grouped,
    posList,
    savedMeaningIds,
    savingMeaningIds,
    saveErrors,
    handleSearch,
    saveMeaning,
  }
}
