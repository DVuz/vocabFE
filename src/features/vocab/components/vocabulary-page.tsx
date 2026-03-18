import { Link, useNavigate } from '@tanstack/react-router'
import { BookOpen, BookPlus, Grid2x2, Layers, LayoutList, Search } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ROUTES } from '../../../shared/constants/routes'
import { useVocabulary } from '../hooks/use-vocabulary'
import type { VocabSearch } from '../types/vocabulary.types'
import { FlashcardView } from './FlashcardView'
import { GridView } from './GridView'
import { PaginationBar } from './PaginationBar'
import { TableView } from './TableView'
import { STATUS_LABEL } from './constants'

export function VocabularyPage({ search }: { search: VocabSearch }) {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState(search.q ?? '')
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'flashcard'>('table')

  const { isLoggedIn, rows, total, pagination, isFetching, isError, error } = useVocabulary(search)

  useEffect(() => { setSearchInput(search.q ?? '') }, [search.q])

  const page = search.page ?? 1
  const statusValue = search.status ?? 'all'
  const pageSizeValue = String(search.pageSize ?? 20)
  const tab = search.tab ?? 'all'

  const errorMessage = useMemo(() => {
    if (!isError) return null
    return (error as Error)?.message ?? 'Lỗi kết nối'
  }, [error, isError])

  function updateSearch(next: Partial<VocabSearch>) {
    navigate({ to: ROUTES.VOCABULARY, search: { ...search, ...next } as never })
  }

  function submitSearch(e: FormEvent) {
    e.preventDefault()
    updateSearch({ q: searchInput || undefined, page: 1 })
  }

  function onChangeStatus(value: string | null) {
    if (!value) return
    updateSearch({ status: value === 'all' ? undefined : value, page: 1 })
  }

  function onChangePageSize(value: string | null) {
    if (!value) return
    updateSearch({ pageSize: Number(value), page: 1 })
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
          <BookPlus size={28} className="text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-zinc-800">Đăng nhập để xem từ vựng</h2>
        <p className="text-sm text-zinc-400">Bạn cần đăng nhập để truy cập danh sách từ đã lưu.</p>
        <Link to={ROUTES.LOGIN} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
          Đi tới đăng nhập
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-linear-to-br from-slate-100 to-blue-50">
        <div className="mx-auto flex w-full max-w-400 flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">My Vocabulary</h1>
              <p className="text-sm text-slate-500">Manage and review your vocabulary list</p>
            </div>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
            {(
              [
                { key: 'table', icon: LayoutList, label: 'Table' },
                { key: 'grid', icon: Grid2x2, label: 'Grid' },
                { key: 'flashcard', icon: Layers, label: 'Flashcard' },
              ] as const
            ).map(({ key, icon: Icon, label }) => (
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
      </div>

      <div className="mx-auto w-full max-w-440 px-4 py-6 sm:px-6 lg:px-10">
        {/* Tabs */}
        <div className="mb-5 flex items-center gap-2">
          <button
            onClick={() => updateSearch({ tab: 'all', page: 1 })}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
              tab !== 'due'
                ? 'border-slate-300 bg-white text-slate-800 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            All Words
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${tab !== 'due' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {isFetching ? '…' : total}
            </span>
          </button>
          <button
            onClick={() => updateSearch({ tab: 'due', page: 1 })}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
              tab === 'due'
                ? 'border-slate-300 bg-white text-slate-800 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Due Today
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${tab === 'due' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
              {tab === 'due' ? rows.length : '—'}
            </span>
          </button>
        </div>

        {/* Filters */}
        <div className="mb-4 rounded-xl border border-zinc-200 bg-white p-3">
          <form onSubmit={submitSearch} className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-72 flex-1">
              <Search size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400" />
              <Input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search words..."
                className="h-9 border-zinc-200 bg-zinc-50 pr-3 pl-8 text-sm"
              />
            </div>

            <Select value={statusValue} onValueChange={onChangeStatus}>
              <SelectTrigger className="h-9 w-44 text-sm">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses ({isFetching ? '…' : total})</SelectItem>
                {Object.entries(STATUS_LABEL).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={pageSizeValue} onValueChange={onChangePageSize}>
              <SelectTrigger className="h-9 w-28 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map(v => (
                  <SelectItem key={v} value={String(v)}>{v} / trang</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="ml-auto hidden whitespace-nowrap text-sm text-zinc-500 sm:block">
              Total: <span className="font-bold text-blue-600">{isFetching ? '…' : total}</span> words
            </span>
          </form>
        </div>

        {/* Content */}
        {errorMessage && <div className="py-12 text-center text-sm text-red-500">{errorMessage}</div>}

        {!errorMessage && viewMode === 'flashcard' && <FlashcardView rows={rows} isFetching={isFetching} />}
        {!errorMessage && viewMode === 'grid' && <GridView rows={rows} isFetching={isFetching} />}
        {!errorMessage && viewMode === 'table' && <TableView rows={rows} isFetching={isFetching} />}

        {pagination && viewMode !== 'flashcard' && (
          <PaginationBar
            page={page}
            totalPages={Math.max(pagination.totalPages, 1)}
            hasPrev={pagination.hasPrev}
            hasNext={pagination.hasNext}
            onPage={p => updateSearch({ page: p })}
          />
        )}
      </div>
    </div>
  )
}
