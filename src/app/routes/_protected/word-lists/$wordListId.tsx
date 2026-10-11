import { createFileRoute } from '@tanstack/react-router'
import { WordListDetailPage } from '../../../../features/word-list/components/word-list-detail-page'

export const Route = createFileRoute('/_protected/word-lists/$wordListId')({
  component: WordListDetailPage,
})
