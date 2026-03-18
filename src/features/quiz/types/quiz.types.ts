import type { VocabularyPagination } from '../../vocab/types/vocabulary.types'

export interface QuizCard {
  userWordId: number
  wordId: number
  word: string
  meaningId: number
  partOfSpeech: string | null
  cefrLevel: string | null
  definition: string
  vnDefinition: string | null
  examples: string[]
  ipa: { uk: string | null; us: string | null }
  audio: { uk: string | null; us: string | null }
  status: string | null
  currentStreak: number
  intervalDays: number
  nextReviewAt: string | null
  addedAt: string
}

export interface QuizQueueQuery {
  page: number
  pageSize: number
  status?: string
}

export interface QuizQueuePayload {
  data: QuizCard[]
  pagination: VocabularyPagination
}

export interface QuizSubmitItem {
  userWordId: number
  correct: boolean
}

export interface QuizSubmitPayload {
  results: QuizSubmitItem[]
  durationSeconds?: number
}

export interface QuizSubmitResult {
  sessionId: number
  total: number
  correct: number
  incorrect: number
  scorePercent: number
}
