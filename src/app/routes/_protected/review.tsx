import { createFileRoute } from '@tanstack/react-router'
import { ReviewPage } from '../../../features/review/components/review-page'

export const Route = createFileRoute('/_protected/review')({
  component: ReviewPage,
})
