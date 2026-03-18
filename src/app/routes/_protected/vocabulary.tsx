import { createFileRoute } from '@tanstack/react-router'
import { VocabularyPage as VocabularyView } from '../../../features/vocab/components/vocabulary-page'
import type { VocabSearch } from '../../../features/vocab/types/vocabulary.types'

export const Route = createFileRoute('/_protected/vocabulary')({
  validateSearch: (search: Record<string, unknown>): VocabSearch => ({
    page: search.page ? Number(search.page) : 1,
    pageSize: search.pageSize ? Number(search.pageSize) : 20,
    status: typeof search.status === 'string' ? search.status : undefined,
    tab: search.tab === 'due' ? 'due' : 'all',
    q: typeof search.q === 'string' ? search.q : undefined,
  }),
  component: VocabularyRoutePage,
})

function VocabularyRoutePage() {
  const search = Route.useSearch()

  return <VocabularyView search={search} />
}
