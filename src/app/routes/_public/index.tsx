import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../../../features/home/components/home-page'
import { useHome } from '../../../features/home/hooks/use-home'

export const Route = createFileRoute('/_public/')({
  component: Home,
})

function Home() {
  const { isLoggedIn, query, setQuery, suggestions, handleSearch, handleSuggestionClick } = useHome()

  return (
    <HomePage
      isLoggedIn={isLoggedIn}
      query={query}
      suggestions={suggestions}
      onQueryChange={setQuery}
      onSearch={handleSearch}
      onSuggestionClick={handleSuggestionClick}
    />
  )
}
