import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import type { Pagination } from './types';

interface PaginationBarProps {
  pagination: Pagination;
  onPage: (p: number) => void;
}

export function PaginationBar({ pagination, onPage }: PaginationBarProps) {
  if (pagination.totalPages <= 1) return null;

  const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1)
    .reduce<(number | '…')[]>((acc, p, idx, arr) => {
      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('…');
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="flex items-center justify-between mt-5 px-1">
      <p className="text-sm text-zinc-400">
        Trang {pagination.page} / {pagination.totalPages} · {pagination.total} từ
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0"
          disabled={!pagination.hasPrev}
          onClick={() => onPage(pagination.page - 1)}
        >
          <ChevronLeft size={16} />
        </Button>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`e-${i}`} className="px-1 text-sm text-zinc-400">
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === pagination.page ? 'default' : 'outline'}
              size="sm"
              className="h-9 w-9 p-0 text-sm"
              onClick={() => onPage(p as number)}
            >
              {p}
            </Button>
          )
        )}
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0"
          disabled={!pagination.hasNext}
          onClick={() => onPage(pagination.page + 1)}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
