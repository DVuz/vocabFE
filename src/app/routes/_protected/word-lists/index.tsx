import { createFileRoute } from '@tanstack/react-router'
import { WordListPage } from '../../../../features/word-list/components/word-list-page'

export const Route = createFileRoute('/_protected/word-lists/')({
  component: WordListPage,
})
