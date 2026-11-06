import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ArrowLeftRight, Languages, Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ROUTES } from '../../../shared/constants/routes'
import type { Meaning, WordData } from '../types/search.types'
import { POS_DOT } from '../constants'

interface SearchSidebarProps {
  query: string
  setQuery: (value: string) => void
  data: WordData | null
  loading: boolean
  showVN: boolean
  setShowVN: (updater: (prev: boolean) => boolean) => void
  grouped: Record<string, Meaning[]>
  posList: string[]
  onSearch: (event: FormEvent) => void
}

export function SearchSidebar({
  query,
  setQuery,
  data,
  loading,
  showVN,
  setShowVN,
  grouped,
  posList,
  onSearch,
}: SearchSidebarProps) {
  const navigate = useNavigate()
  const [compareWord, setCompareWord] = useState('')

  function handleCompare(event: FormEvent) {
    event.preventDefault()
    const firstWord = data?.word ?? query.trim()
    const secondWord = compareWord.trim()
    if (firstWord && secondWord) {
      navigate({
        to: '/compare/$wordA/$wordB',
        params: { wordA: firstWord, wordB: secondWord },
      })
    }
  }

  return (
    <aside className="flex w-full flex-col gap-3.5 lg:sticky lg:top-20 lg:w-68 lg:shrink-0">
      {/* Quick Search Another Word */}
      <form
        onSubmit={onSearch}
        className="flex items-center gap-1.5 rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-2xs focus-within:border-emerald-500"
      >
        <Search size={15} className="ml-2.5 shrink-0 text-slate-400" />
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Tra từ khác..."
          className="h-8 flex-1 border-0 bg-transparent px-1.5 text-sm shadow-none focus-visible:ring-0"
        />
        <Button
          type="submit"
          size="sm"
          className="h-8 rounded-xl bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-700"
        >
          Tra
        </Button>
      </form>

      {/* Desktop POS Index & Vietnamese Toggle */}
      {!loading && data && (
        <div className="hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs lg:block">
          <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              Cấu trúc từ ({data.meanings.length} nghĩa)
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowVN(prev => !prev)}
            className={`mb-3 flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
              showVN
                ? 'border-emerald-200 bg-emerald-50/80 text-emerald-800'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Languages size={14} />
              Hiện nghĩa tiếng Việt
            </span>
            <span
              className={`relative h-4 w-7 rounded-full transition-colors ${
                showVN ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all ${
                  showVN ? 'left-3.5' : 'left-0.5'
                }`}
              />
            </span>
          </button>

          <div className="flex flex-col gap-1">
            {posList.map(pos => (
              <button
                key={pos}
                type="button"
                onClick={() =>
                  document
                    .getElementById(`pos-${pos}`)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
                className="group flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors hover:bg-slate-50"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      POS_DOT[pos] ?? 'bg-slate-400'
                    }`}
                  />
                  <span className="font-semibold text-slate-700 capitalize group-hover:text-slate-900">
                    {pos}
                  </span>
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold tabular-nums text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-700">
                  {grouped[pos].length}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Compare with another word */}
      <form
        onSubmit={handleCompare}
        className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs"
      >
        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <ArrowLeftRight size={13} className="text-emerald-600" />
          <span>So sánh với từ khác</span>
        </p>
        <div className="flex gap-1.5">
          <Input
            value={compareWord}
            onChange={event => setCompareWord(event.target.value)}
            placeholder="Nhập từ thứ 2..."
            className="h-8 min-w-0 flex-1 rounded-xl border-slate-200 bg-slate-50/70 px-2.5 text-xs"
          />
          <Button
            type="submit"
            size="sm"
            variant="outline"
            disabled={!compareWord.trim()}
            className="h-8 shrink-0 rounded-xl border-emerald-200 bg-emerald-50/70 px-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
          >
            So sánh
          </Button>
        </div>
      </form>

      <Link
        to={ROUTES.HOME}
        className="hidden items-center gap-1.5 px-1 text-xs font-semibold text-slate-400 transition-colors hover:text-emerald-600 lg:inline-flex"
      >
        <ArrowLeft size={14} />
        Về trang chủ
      </Link>
    </aside>
  )
}
