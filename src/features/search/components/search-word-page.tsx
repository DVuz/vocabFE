import { Compass, Languages, Search } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import type { Meaning, WordData } from '../types/search.types'
import { AudioButton } from './AudioButton'
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
  grouped: Record<string, Meaning[]>
  posList: string[]
  savedMeaningIds: Record<number, boolean>
  savingMeaningIds: Record<number, boolean>
  saveErrors: Record<number, string | null>
  onSearch: (event: FormEvent) => void
  onSaveMeaning: (meaningId: number) => void
}

export function SearchWordPage({
  word,
  query,
  setQuery,
  data,
  loading,
  error,
  showVN,
  setShowVN,
  grouped,
  posList,
  savedMeaningIds,
  savingMeaningIds,
  saveErrors,
  onSearch,
  onSaveMeaning,
}: SearchWordPageProps) {
  const [selectedPos, setSelectedPos] = useState<string>('ALL')

  // Reset POS filter if the active POS doesn't exist in the new word
  const activePos =
    selectedPos === 'ALL' || posList.includes(selectedPos) ? selectedPos : 'ALL'

  const primaryPronunciation = useMemo(() => {
    if (!data?.meanings.length) return { ukIpa: null, usIpa: null, ukAudio: null, usAudio: null }
    const firstWithUk = data.meanings.find(m => m.ipa.uk || m.audio.uk)
    const firstWithUs = data.meanings.find(m => m.ipa.us || m.audio.us)
    return {
      ukIpa: firstWithUk?.ipa.uk ?? null,
      ukAudio: firstWithUk?.audio.uk ?? null,
      usIpa: firstWithUs?.ipa.us ?? null,
      usAudio: firstWithUs?.audio.us ?? null,
    }
  }, [data])

  const visiblePosList = useMemo(
    () => (activePos === 'ALL' ? posList : posList.filter(p => p === activePos)),
    [activePos, posList],
  )

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/60 pb-12">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-7 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <SearchSidebar
            query={query}
            setQuery={setQuery}
            data={data}
            loading={loading}
            showVN={showVN}
            setShowVN={setShowVN}
            grouped={grouped}
            posList={posList}
            onSearch={onSearch}
          />

          <main className="min-w-0 flex-1">
            {loading && (
              <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200/80 bg-white py-28 shadow-2xs">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-200 border-t-emerald-600" />
                <p className="text-sm font-medium text-slate-500">
                  Đang tra cứu từ "{word}"…
                </p>
              </div>
            )}

            {!loading && error && (
              <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200/80 bg-white py-24 text-center shadow-2xs">
                <Search size={36} className="text-slate-300" />
                <h2 className="text-lg font-bold text-slate-800">
                  Không tìm thấy "{word}"
                </h2>
                <p className="text-sm text-slate-400">{error}</p>
              </div>
            )}

            {!loading && data && (
              <div className="flex flex-col gap-4">
                {/* ── 1. CONCISE WORD HEADER & SENSE OVERVIEW CARD ── */}
                <header className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-baseline gap-3">
                        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                          {data.word}
                        </h1>
                        <span className="text-xs font-semibold text-slate-400">
                          {data.meanings.length} lớp nghĩa
                        </span>
                      </div>

                      {/* Primary UK & US Pronunciation (Shown ONCE here instead of repeating on every card) */}
                      {(primaryPronunciation.ukIpa ||
                        primaryPronunciation.usIpa) && (
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          {primaryPronunciation.ukIpa &&
                            (primaryPronunciation.ukAudio ? (
                              <AudioButton
                                url={primaryPronunciation.ukAudio}
                                label="UK"
                                ipa={primaryPronunciation.ukIpa}
                                tone="uk"
                              />
                            ) : (
                              <span className="rounded-lg border border-blue-200 bg-blue-50/80 px-2.5 py-1 font-mono text-xs font-semibold text-blue-700">
                                UK /{primaryPronunciation.ukIpa}/
                              </span>
                            ))}

                          {primaryPronunciation.usIpa &&
                            (primaryPronunciation.usAudio ? (
                              <AudioButton
                                url={primaryPronunciation.usAudio}
                                label="US"
                                ipa={primaryPronunciation.usIpa}
                                tone="us"
                              />
                            ) : (
                              <span className="rounded-lg border border-amber-200 bg-amber-50/80 px-2.5 py-1 font-mono text-xs font-semibold text-amber-700">
                                US /{primaryPronunciation.usIpa}/
                              </span>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* Mobile / Quick Vietnamese Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowVN(prev => !prev)}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition lg:hidden ${
                        showVN
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 bg-slate-50 text-slate-500'
                      }`}
                    >
                      <Languages size={14} />
                      <span>{showVN ? 'Song ngữ EN-VI' : 'Chỉ tiếng Anh'}</span>
                    </button>
                  </div>

                  {/* Quick Sense Overview Chips (Tóm tắt nhanh các lớp nghĩa) */}
                  {data.meanings.length > 1 && (
                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                        <Compass size={12} className="text-emerald-600" />
                        <span>Tóm tắt nhanh các lớp nghĩa (bấm để nhảy tới):</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {data.meanings.map((m, idx) => {
                          const shortLabel =
                            (showVN && m.vnDefinition
                              ? m.vnDefinition
                              : m.definition
                            )
                              .split(/[;,.]/)[0]
                              ?.trim() || m.definition
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() =>
                                document
                                  .getElementById(`meaning-${m.id}`)
                                  ?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'center',
                                  })
                              }
                              className="inline-flex max-w-[260px] items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white px-2.5 py-1 text-left text-xs transition hover:border-emerald-400 hover:bg-emerald-50/60"
                            >
                              <span className="shrink-0 font-mono text-[10px] font-extrabold text-emerald-600">
                                #{idx + 1}
                              </span>
                              <span className="truncate font-medium text-slate-700">
                                {shortLabel}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* POS Filter Tabs */}
                  {posList.length > 1 && (
                    <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3.5">
                      <button
                        type="button"
                        onClick={() => setSelectedPos('ALL')}
                        className={`rounded-xl px-3 py-1 text-xs font-bold transition ${
                          activePos === 'ALL'
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                        }`}
                      >
                        Tất cả ({data.meanings.length})
                      </button>
                      {posList.map(pos => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => setSelectedPos(pos)}
                          className={`rounded-xl px-3 py-1 text-xs font-bold capitalize transition ${
                            activePos === pos
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                          }`}
                        >
                          {pos} ({grouped[pos].length})
                        </button>
                      ))}
                    </div>
                  )}
                </header>

                {/* ── 2. GROUPED MEANING LAYERS BY PART OF SPEECH ── */}
                {visiblePosList.map(pos => {
                  const posMeanings = grouped[pos] ?? []
                  return (
                    <section
                      key={pos}
                      id={`pos-${pos}`}
                      className="scroll-mt-20 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs"
                    >
                      {/* POS Section Header */}
                      <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-2.5 sm:px-5">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`px-2.5 py-0.5 text-xs font-bold capitalize ${
                              POS_COLOR[pos] ??
                              'border-slate-200 bg-slate-100 text-slate-700'
                            }`}
                          >
                            {pos}
                          </Badge>
                          <span className="text-xs font-medium text-slate-400">
                            {posMeanings.length} lớp nghĩa
                          </span>
                        </div>
                      </div>

                      {/* Divided list of concise meaning rows */}
                      <div className="divide-y divide-slate-100">
                        {posMeanings.map((meaning, idx) => (
                          <MeaningCard
                            key={meaning.id}
                            meaning={meaning}
                            index={idx + 1}
                            showVN={showVN}
                            saved={Boolean(savedMeaningIds[meaning.id])}
                            saving={Boolean(savingMeaningIds[meaning.id])}
                            saveError={saveErrors[meaning.id] ?? null}
                            onSave={() => void onSaveMeaning(meaning.id)}
                            groupUkIpa={primaryPronunciation.ukIpa}
                            groupUsIpa={primaryPronunciation.usIpa}
                          />
                        ))}
                      </div>
                    </section>
                  )
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
