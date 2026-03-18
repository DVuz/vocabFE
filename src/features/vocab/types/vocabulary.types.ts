export interface UserWordRow {
  userWordId: number
  wordId: number
  word: string
  meaningId: number
  definition: string
  vnDefinition: string | null
  partOfSpeech: string | null
  cefrLevel: string | null
  examples: string[]
  ipa: { uk: string | null; us: string | null }
  audio: { uk: string | null; us: string | null }
  status: string | null
  nextReviewAt: string | null
}

export interface VocabularyPagination {
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface VocabularyPayload {
  data: UserWordRow[]
  pagination: VocabularyPagination
}

export interface VocabSearch {
  page: number
  pageSize: number
  status?: string
  tab?: 'all' | 'due'
  q?: string
}
