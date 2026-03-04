export interface UserWordRow {
  userWordId: number;
  wordId: number;
  word: string;
  meaningId: number;
  partOfSpeech?: string | null;
  cefrLevel?: string | null;
  definition: string;
  vnDefinition?: string | null;
  examples: string[];
  ipa: { uk?: string | null; us?: string | null };
  audio: { uk?: string | null; us?: string | null };
  status?: string | null;
  isFavorite?: boolean | null;
}

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface WordList {
  id: number;
  name: string;
  totalItems: number;
}

export type VocabSearch = {
  page?: number;
  pageSize?: number;
  status?: string;
  tab?: 'all' | 'due';
  q?: string;
};
