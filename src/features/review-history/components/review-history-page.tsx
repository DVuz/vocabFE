import { Link } from '@tanstack/react-router'
import {
  Award,
  CheckCircle2,
  ClipboardList,
  Clock,
  Loader2,
  Target,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { ROUTES } from '../../../shared/constants/routes'
import { PaginationBar } from '../../vocab/components/PaginationBar'
import { useReviewSessions } from '../hooks/use-review-history'
import { SessionRow } from './SessionRow'
import { formatDuration } from './utils'

export function ReviewHistoryPage() {
  const [page, setPage] = useState(1)
  const [expandedSessionId, setExpandedSessionId] = useState<number | null>(null)

  const { isLoggedIn, sessions, pagination, isLoading, isError, error } =
    useReviewSessions(page, 10)

  function toggleSession(id: number) {
    setExpandedSessionId(prev => (prev === id ? null : id))
  }

  const stats = useMemo(() => {
    if (!sessions.length) return null
    const totalSessions = pagination?.total ?? sessions.length
    const avgScore = Math.round(
      sessions.reduce((acc, s) => acc + (s.scorePercent ?? 0), 0) /
        sessions.length,
    )
    const totalCorrect = sessions.reduce((acc, s) => acc + s.correctAnswers, 0)
    const totalQuestions = sessions.reduce(
      (acc, s) => acc + s.totalQuestions,
      0,
    )
    const avgDuration = Math.round(
      sessions.reduce((acc, s) => acc + (s.durationSeconds ?? 0), 0) /
        sessions.length,
    )

    return {
      totalSessions,
      avgScore,
      totalCorrect,
      totalQuestions,
      avgDuration,
    }
  }, [sessions, pagination?.total])

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
          <ClipboardList size={28} className="text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">
          Đăng nhập để xem lịch sử ôn tập
        </h2>
        <p className="text-sm text-slate-500">
          Vui lòng đăng nhập để theo dõi kết quả kiểm tra và tiến độ ghi nhớ từ vựng.
        </p>
        <Link
          to={ROUTES.LOGIN}
          className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Đi tới đăng nhập
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/60 pb-10">
      {/* Hero Header */}
      <div className="border-b border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-emerald-50/50">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 sm:py-7">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-xs ring-1 ring-slate-200/80 sm:h-12 sm:w-12">
              <ClipboardList size={22} className="text-emerald-600" />
            </div>
            <div>
              <p className="mb-0.5 text-[11px] font-bold tracking-[0.16em] text-emerald-600 uppercase sm:text-xs">
                Tiến độ học tập
              </p>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                Lịch sử ôn tập & Kiểm tra
              </h1>
              <p className="text-xs text-slate-500 sm:text-sm">
                Xem lại kết quả từng buổi kiểm tra và chi tiết chuỗi ghi nhớ của từng từ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={ROUTES.REVIEW}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-emerald-300 hover:text-emerald-700 sm:text-sm"
            >
              Ôn tập Flashcard
            </Link>
            <Link
              to={ROUTES.QUIZ}
              className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-emerald-700 sm:text-sm"
            >
              Làm bài kiểm tra
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-7">
        {/* Summary Stats Grid */}
        {stats && !isLoading && (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs sm:p-4">
              <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Target size={15} className="text-blue-500" />
                <span>Tổng số buổi</span>
              </div>
              <p className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                {stats.totalSessions}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs sm:p-4">
              <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Award size={15} className="text-emerald-500" />
                <span>Điểm trung bình</span>
              </div>
              <p className="text-xl font-extrabold text-emerald-600 sm:text-2xl">
                {stats.avgScore}%
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs sm:p-4">
              <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <CheckCircle2 size={15} className="text-teal-500" />
                <span>Số câu đúng (trang này)</span>
              </div>
              <p className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                {stats.totalCorrect}
                <span className="text-sm font-medium text-slate-400">
                  /{stats.totalQuestions}
                </span>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs sm:p-4">
              <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Clock size={15} className="text-amber-500" />
                <span>Thời lượng TB</span>
              </div>
              <p className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                {formatDuration(stats.avgDuration)}
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white py-20 text-sm text-slate-500 shadow-2xs">
            <Loader2 size={26} className="animate-spin text-emerald-600" />
            <span>Đang tải lịch sử ôn tập...</span>
          </div>
        )}

        {/* Error */}
        {!isLoading && isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
            {(error as Error)?.message ?? 'Lỗi tải dữ liệu. Vui lòng thử lại.'}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && sessions.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <ClipboardList size={28} className="text-slate-400" />
            </div>
            <p className="text-base font-bold text-slate-700">
              Chưa có buổi kiểm tra nào
            </p>
            <p className="max-w-sm text-sm text-slate-400">
              Hãy bắt đầu một bài kiểm tra từ vựng để theo dõi kết quả và tiến độ tại đây.
            </p>
            <Link
              to={ROUTES.QUIZ}
              className="mt-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Làm bài kiểm tra ngay
            </Link>
          </div>
        )}

        {/* Session List */}
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

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-5">
            <PaginationBar
              page={pagination.page}
              totalPages={Math.max(pagination.totalPages, 1)}
              hasPrev={pagination.hasPrev}
              hasNext={pagination.hasNext}
              onPage={nextPage => {
                setPage(nextPage)
                setExpandedSessionId(null)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
