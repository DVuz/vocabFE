export interface Meaning {
  id: number
  partOfSpeech: string
  cefrLevel: string | null
  definition: string
  vnDefinition: string
  examples: string[]
  ipa: { uk: string | null; us: string | null }
  audio: { uk: string | null; us: string | null }
}

export interface WordData {
  id: number
  word: string
  meanings: Meaning[]
}
