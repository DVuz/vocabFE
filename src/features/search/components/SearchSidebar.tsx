import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Search } from 'lucide-react'
import type { FormEvent } from 'react'
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

export function SearchSidebar({ query, setQuery, data, loading, showVN, setShowVN, grouped, posList, onSearch }: SearchSidebarProps) {
  return (
    <aside className="sticky top-24 flex w-72 shrink-0 flex-col gap-4">
      <form onSubmit={onSearch}>
        <div className="flex items-center overflow-hidden rounded-xl border-2 border-zinc-200 bg-white shadow-sm transition-all focus-within:border-emerald-500">
          <span className="shrink-0 pl-3 text-zinc-400">
            <Search size={15} />
          </span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Tìm từ khác..."
            className="flex-1 border-none bg-transparent px-2 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
          />
          <button
            type="submit"
            className="m-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-emerald-700"
          >
            Tra
          </button>
        </div>
      </form>

      {!loading && data && (
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h1 className="font-display mb-1 break-all text-3xl font-extrabold tracking-tight text-zinc-900">
            {data.word}
          </h1>
          <p className="mb-3 text-xs text-zinc-400">{data.meanings.length} lớp nghĩa</p>

          <button
            onClick={() => setShowVN(prev => !prev)}
            className={`mb-2 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-xs font-semibold transition-all
              ${showVN
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-300'
              }`}
          >
            <span>Dịch nghĩa (VI)</span>
            <span className={`relative h-4 w-8 rounded-full transition-colors ${showVN ? 'bg-emerald-500' : 'bg-zinc-300'}`}>
              <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all ${showVN ? 'left-4' : 'left-0.5'}`} />
            </span>
          </button>

          <div className="flex flex-col gap-1">
            {posList.map(pos => (
              <button
                key={pos}
                onClick={() => document.getElementById(`pos-${pos}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="group flex items-center justify-between rounded-lg px-3 py-2 text-left transition-all hover:bg-zinc-50"
              >
                <span className="flex items-center gap-2">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${POS_DOT[pos] ?? 'bg-zinc-400'}`} />
                  <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900">{pos}</span>
                </span>
                <span className="tabular-nums text-xs text-zinc-400">{grouped[pos].length}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="animate-pulse rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-2 h-8 w-3/4 rounded-lg bg-zinc-100" />
          <div className="mb-5 h-3 w-1/3 rounded bg-zinc-100" />
          {[1, 2, 3].map(i => <div key={i} className="mb-1.5 h-8 rounded-lg bg-zinc-100" />)}
        </div>
      )}

      <Link
        to={ROUTES.HOME}
        className="flex items-center gap-2 px-1 text-sm text-zinc-400 transition-colors hover:text-emerald-600"
      >
        <ArrowLeft size={14} />
        Về trang chủ
      </Link>
    </aside>
  )
}