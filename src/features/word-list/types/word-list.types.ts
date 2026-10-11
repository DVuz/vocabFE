export interface WordList {
  id: number
  name: string
  description: string | null
  isPublic: boolean
  createdAt: string
  wordCount: number
}

export interface WordListItem {
  id: number
  listId: number
  wordMeaningId: number
  addedAt: string
  wordMeaning: {
    id: number
    definition: string
    vnDefinition: string | null
    partOfSpeech: string | null
    word: {
      word: string
      ipa: {
        uk: string | null
        us: string | null
      }
      audio: {
        uk: string | null
        us: string | null
        tts: string | null
      }
    }
  }
}
