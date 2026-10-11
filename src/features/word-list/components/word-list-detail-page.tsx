import { Link, useParams } from '@tanstack/react-router'
import { ArrowLeft, BookOpen, Grid2x2, Layers, LayoutList } from 'lucide-react'
import { useState } from 'react'
import { ROUTES } from '../../../shared/constants/routes'
import type { UserWordRow } from '../../vocab/types/vocabulary.types'
import type { WordListItem } from '../types/word-list.types'
import { FlashcardView } from '../../vocab/components/FlashcardView'
import { GridView } from '../../vocab/components/GridView'
import { TableView } from '../../vocab/components/TableView'
import { useWordListItems, useWordLists } from '../hooks/use-word-lists'

function toVocabularyRow(
  item: WordListItem,
): UserWordRow {
  return {
    userWordId: item.id,
    wordId: item.wordMeaning.id,
    word: item.wordMeaning.word.word,
    meaningId: item.wordMeaning.id,
    definition: item.wordMeaning.definition,
    vnDefinition: item.wordMeaning.vnDefinition,
    partOfSpeech: item.wordMeaning.partOfSpeech,
    cefrLevel: null,
    examples: [],
    ipa: item.wordMeaning.word.ipa,
    audio: item.wordMeaning.word.audio,
    status: null,
    nextReviewAt: null,
  }
}

export function WordListDetailPage() {
  const { wordListId } = useParams({ strict: false })
  const listId = Number(wordListId)
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'flashcard'>('table')
  const listsQuery = useWordLists()
  const itemsQuery = useWordListItems(listId)
  const list = listsQuery.data?.find(item => item.id === listId)
  const rows = (itemsQuery.data ?? []).map(toVocabularyRow)

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50">
      <header className="border-b border-slate-200 bg-linear-to-br from-slate-100 to-blue-50">
        <div className="mx-auto flex max-w-400 flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-10">
          <div>
          <Link to={ROUTES.WORD_LISTS} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
            <ArrowLeft size={16} /> Word lists
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">{list?.name ?? 'Word list'}</h1>
              <p className="text-sm text-slate-500">{list?.description || `${rows.length} từ trong danh sách`}</p>
            </div>
          </div>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
            {([
              { key: 'table', icon: LayoutList, label: 'Table' },
              { key: 'grid', icon: Grid2x2, label: 'Grid' },
              { key: 'flashcard', icon: Layers, label: 'Flashcard' },
            ] as const).map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setViewMode(key)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                  viewMode === key
                    ? key === 'flashcard'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-400 px-4 py-7 sm:px-6 lg:px-10">
        {itemsQuery.isError && <p className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-600">{(itemsQuery.error as Error).message}</p>}
        {!itemsQuery.isError && viewMode === 'table' && <TableView rows={rows} isFetching={itemsQuery.isLoading} />}
        {!itemsQuery.isError && viewMode === 'grid' && <GridView rows={rows} isFetching={itemsQuery.isLoading} />}
        {!itemsQuery.isError && viewMode === 'flashcard' && <FlashcardView rows={rows} isFetching={itemsQuery.isLoading} />}
      </main>
    </div>
  )
}
