import { ClipboardList, Loader2 } from 'lucide-react'
import { useState } from 'react'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white px-4 py-5 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="flex items-center gap-2 text-xl font-bold text-zinc-900">
            <ClipboardList size={20} className="text-emerald-600" />
            Lịch sử kiểm tra
          </h1>
          <p className="mt-0.5 text-xs text-zinc-400">
            Xem lại kết quả từng buổi kiểm tra và chi tiết từng từ.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-emerald-500" />
          </div>
        )}

        {/* Error */}
        {!isLoading && isError && (
          <p className="py-10 text-center text-red-500">
            {(error as Error)?.message ?? 'Lỗi tải dữ liệu. Vui lòng thử lại.'}
          </p>
        )}

        {/* Empty */}
        {!isLoading && !isError && sessions.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100">
              <ClipboardList size={28} className="text-zinc-400" />
            </div>
            <p className="font-medium text-zinc-500">Chưa có buổi kiểm tra nào.</p>
            <p className="text-sm text-zinc-400">Làm bài kiểm tra để xem lịch sử tại đây.</p>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && sessions.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50">
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Tổng câu</TableHead>
                  <TableHead>Đúng/Sai</TableHead>
                  <TableHead>Điểm</TableHead>
                  <TableHead>Thời lượng</TableHead>
                  <TableHead className="text-right">Chi tiết</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map(session => (
                  <SessionRow
                    key={session.id}
                    session={session}
                    expanded={expandedSessionId === session.id}
                    onToggle={() => toggleSession(session.id)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <PaginationBar
            page={pagination.page}
            totalPages={Math.max(pagination.totalPages, 1)}
            hasPrev={pagination.hasPrev}
            hasNext={pagination.hasNext}
            onPage={setPage}
          />
        )}
      </div>
    </div>
  )
}
