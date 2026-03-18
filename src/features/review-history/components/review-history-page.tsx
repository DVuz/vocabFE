import { ClipboardList, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { PaginationBar } from '../../vocab/components/PaginationBar'
import { useReviewSessions } from '../hooks/use-review-history'
import { SessionRow } from './SessionRow'

export function ReviewHistoryPage() {
  const [page, setPage] = useState(1)
  const [expandedSessionId, setExpandedSessionId] = useState<number | null>(null)

  const { isLoggedIn, sessions, pagination, isLoading, isError, error } = useReviewSessions(page, 10)

  function toggleSession(id: number) {
    setExpandedSessionId(prev => (prev === id ? null : id))
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <ClipboardList size={40} className="text-zinc-300" />
        <p className="font-medium text-zinc-500">Vui lòng đăng nhập để xem lịch sử kiểm tra.</p>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white px-4 py-5 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="flex items-center gap-2 text-xl font-bold text-zinc-900">
            <ClipboardList size={20} className="text-emerald-600" />
            Lịch sử kiểm tra
          </h1>
          <p className="mt-0.5 text-xs text-zinc-400">
            Xem lại kết quả từng buổi kiểm tra và chi tiết từng từ.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-emerald-500" />
          </div>
        )}

        {!isLoading && isError && (
          <p className="py-10 text-center text-red-500">
            {(error as Error)?.message ?? 'Lỗi tải dữ liệu. Vui lòng thử lại.'}
          </p>
        )}

        {!isLoading && !isError && sessions.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100">
              <ClipboardList size={28} className="text-zinc-400" />
            </div>
            <p className="font-medium text-zinc-500">Chưa có buổi kiểm tra nào.</p>
            <p className="text-sm text-zinc-400">Làm bài kiểm tra để xem lịch sử tại đây.</p>
          </div>
        )}

        {!isLoading && !isError && sessions.length > 0 && (
          <div className="flex flex-col gap-3">
            {sessions.map(session => (
              <SessionRow
                key={session.id}
                session={session}
                expanded={expandedSessionId === session.id}
                onToggle={() => toggleSession(session.id)}
              />
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-4">
            <PaginationBar
              page={pagination.page}
              totalPages={Math.max(pagination.totalPages, 1)}
              hasPrev={pagination.hasPrev}
              hasNext={pagination.hasNext}
              onPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}