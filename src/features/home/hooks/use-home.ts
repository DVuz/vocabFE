import { useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { ROUTES } from '../../../shared/constants/routes'
import { useAuthStore } from '../../../shared/store/auth.store'
import { HOME_SUGGESTIONS, normalizeSearchWord } from '../api/home.api'

export function useHome() {
  const navigate = useNavigate()
  const accessToken = useAuthStore(state => state.accessToken)
  const user = useAuthStore(state => state.user)
  const [query, setQuery] = useState('')
  const isLoggedIn = Boolean(accessToken && user)

  function goToSearch(rawWord: string) {
    const word = normalizeSearchWord(rawWord)

    if (!word) {
      return
    }

    navigate({ to: ROUTES.SEARCH_WORD, params: { word } })
  }

  function handleSearch(event?: FormEvent) {
    event?.preventDefault()
    goToSearch(query)
  }

  function handleSuggestionClick(word: string) {
    setQuery(word)
    goToSearch(word)
  }

  return {
    isLoggedIn,
    query,
    setQuery,
    suggestions: HOME_SUGGESTIONS,
    handleSearch,
    handleSuggestionClick,
  }
}
