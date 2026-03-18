import { Search } from 'lucide-react'
import type { FormEvent } from 'react'
import type { WordData } from '../types/search.types'
import { MeaningCard } from './MeaningCard'
import { SearchSidebar } from './SearchSidebar'
import { POS_COLOR } from '../constants'

interface SearchWordPageProps {
  word: string
  query: string
  setQuery: (value: string) => void
  data: WordData | null
  loading: boolean
  error: string | null
  showVN: boolean
  setShowVN: (updater: (prev: boolean) => boolean) => void
  grouped: Record<string, import('../types/search.types').Meaning[]>
  posList: string[]
  savedMeaningIds: Record<number, boolean>
  savingMeaningIds: Record<number, boolean>
  saveErrors: Record<number, string | null>
  onSearch: (event: FormEvent) => void
  onSaveMeaning: (meaningId: number) => void
}

export function SearchWordPage({
  word, query, setQuery, data, loading, error,
  showVN, setShowVN, grouped, posList,
  savedMeaningIds, savingMeaningIds, saveErrors,
  onSearch, onSaveMeaning,
}: SearchWordPageProps) {
  let meaningIndex = 0

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50">
      <div className="mx-auto max-w-400 px-4 py-8 sm:px-6 lg:px-10">
        <div className="flex items-start gap-8">
          <SearchSidebar
            query={query} setQuery={setQuery} data={data} loading={loading}
            showVN={showVN} setShowVN={setShowVN} grouped={grouped}
            posList={posList} onSearch={onSearch}
          />

          <main className="min-w-0 flex-1">
            {loading && (
              <div className="flex flex-col items-center justify-center gap-4 py-32">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
                <p className="text-sm text-zinc-400">Đang tìm "{word}"…</p>
              </div>
            )}

            {!loading && error && (
              <div className="flex flex-col items-center justify-center gap-3 py-32 text-center">
                <Search size={40} className="text-zinc-300" />
                <h2 className="text-xl font-bold text-zinc-800">Không tìm thấy "{word}"</h2>
                <p className="text-sm text-zinc-400">{error}</p>
              </div>
            )}

            {!loading && data && (
              <div className="flex flex-col gap-10">
                {posList.map(pos => (
                  <section key={pos} id={`pos-${pos}`}>
                    <div className="mb-4 flex items-center gap-3">
                      <span className={`rounded-full border px-3 py-1 text-sm font-bold ${POS_COLOR[pos] ?? 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>
                        {pos}
                      </span>
                      <div className="h-px flex-1 bg-zinc-200" />
                      <span className="shrink-0 tabular-nums text-xs text-zinc-400">{grouped[pos].length} nghĩa</span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {grouped[pos].map(meaning => {
                        meaningIndex++
                        return (
                          <MeaningCard
                            key={meaning.id} meaning={meaning} index={meaningIndex}
                            showVN={showVN} saved={Boolean(savedMeaningIds[meaning.id])}
                            saving={Boolean(savingMeaningIds[meaning.id])}
                            saveError={saveErrors[meaning.id] ?? null}
                            onSave={() => void onSaveMeaning(meaning.id)}
                          />
                        )
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}