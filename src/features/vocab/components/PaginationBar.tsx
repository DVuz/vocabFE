import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getVisiblePages } from './utils'

interface PaginationBarProps {
  page: number
  totalPages: number
  hasPrev: boolean
  hasNext: boolean
  onPage: (nextPage: number) => void
}

export function PaginationBar({ page, totalPages, hasPrev, hasNext, onPage }: PaginationBarProps) {
  const visiblePages = getVisiblePages(page, totalPages)

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-3">
      <span className="text-sm text-zinc-500">
        Trang <span className="font-semibold text-zinc-700">{page}</span> / {Math.max(totalPages, 1)}
      </span>

      <div className="flex items-center gap-1.5">
        <Button variant="outline" size="sm" disabled={!hasPrev} onClick={() => onPage(Math.max(1, page - 1))}>
          <ArrowLeft size={14} />
        </Button>

        {visiblePages[0] > 1 && (
          <>
            <Button variant={page === 1 ? 'default' : 'outline'} size="sm" onClick={() => onPage(1)}>1</Button>
            {visiblePages[0] > 2 && <span className="px-1 text-zinc-400">…</span>}
          </>
        )}

        {visiblePages.map(v => (
          <Button key={v} variant={v === page ? 'default' : 'outline'} size="sm" onClick={() => onPage(v)}>
            {v}
          </Button>
        ))}

        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="px-1 text-zinc-400">…</span>
            )}
            <Button
              variant={page === totalPages ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPage(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button variant="outline" size="sm" disabled={!hasNext} onClick={() => onPage(page + 1)}>
          <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  )
}
