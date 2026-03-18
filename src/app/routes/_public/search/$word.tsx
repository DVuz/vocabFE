import { createFileRoute } from '@tanstack/react-router'
import { SearchWordPage as SearchWordView } from '../../../../features/search/components/search-word-page'
import { useSearchWord } from '../../../../features/search/hooks/use-search-word'

export const Route = createFileRoute('/_public/search/$word')({
  component: SearchWordRoutePage,
})

function SearchWordRoutePage() {
  const { word } = Route.useParams()
  const {
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
  } = useSearchWord(word)

  return (
    <SearchWordView
      word={word}
      query={query}
      setQuery={setQuery}
      data={data}
      loading={loading}
      error={error}
      showVN={showVN}
      setShowVN={setShowVN}
      grouped={grouped}
      posList={posList}
      savedMeaningIds={savedMeaningIds}
      savingMeaningIds={savingMeaningIds}
      saveErrors={saveErrors}
      onSearch={handleSearch}
      onSaveMeaning={saveMeaning}
    />
  )
}
