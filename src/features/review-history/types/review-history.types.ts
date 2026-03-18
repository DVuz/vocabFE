import type { VocabularyPagination } from '../../vocab/types/vocabulary.types'

export interface ReviewSessionSummary {
  id: number
  sessionType: string
  sourceType: string
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  scorePercent: number | null
  durationSeconds: number | null
  status: string
  startedAt: string
  finishedAt: string | null
}

export interface ReviewSessionItem {
  id: number
  userWordId: number
  word: string
  definition: string
  vnDefinition: string | null
  partOfSpeech: string | null
  cefrLevel: string | null
  isCorrect: boolean
  questionType: string
  streakBefore: number | null
  streakAfter: number | null
  easeBefore: number | null
  easeAfter: number | null
  intervalBefore: number | null
  intervalAfter: number | null
}

export interface ReviewSessionDetail {
  id: number
  sessionType: string
  sourceType: string
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  scorePercent: number | null
  durationSeconds: number | null
  status: string
  startedAt: string
  finishedAt: string | null
  items: ReviewSessionItem[]
}

export interface ReviewSessionsPayload {
  data: ReviewSessionSummary[]
  pagination: VocabularyPagination
}
