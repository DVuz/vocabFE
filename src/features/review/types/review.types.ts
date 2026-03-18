import type { VocabularyPagination } from '../../vocab/types/vocabulary.types'

export interface ReviewCard {
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

export type ReviewMode = 'today' | 'priority'

export interface ReviewQuery {
  page: number
  pageSize: number
  status?: string
}

export interface ReviewPayload {
  data: ReviewCard[]
  pagination: VocabularyPagination
}
