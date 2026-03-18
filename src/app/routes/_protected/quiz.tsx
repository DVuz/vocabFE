import { createFileRoute } from '@tanstack/react-router'
import { QuizPage } from '../../../features/quiz/components/quiz-page'

export const Route = createFileRoute('/_protected/quiz')({
  component: QuizPage,
})
