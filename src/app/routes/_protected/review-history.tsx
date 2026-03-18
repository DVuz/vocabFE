import { createFileRoute } from '@tanstack/react-router'
import { ReviewHistoryPage } from '../../../features/review-history/components/review-history-page'

export const Route = createFileRoute('/_protected/review-history')({
  component: ReviewHistoryPage,
})
