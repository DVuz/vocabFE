import { createFileRoute } from '@tanstack/react-router'
import { CompareWordsPage } from '../../../../../features/search/components/compare-words-page'

export const Route = createFileRoute('/_public/compare/$wordA/$wordB')({
  component: CompareRoutePage,
})

function CompareRoutePage() {
  const { wordA, wordB } = Route.useParams()
  return <CompareWordsPage wordA={wordA} wordB={wordB} />
}
