import { CheckCircle2, Flame, Loader2, TrendingUp, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CEFR_CLASS, POS_CLASS } from '../../vocab/components/constants'
import { useReviewSessionDetail } from '../hooks/use-review-history'

interface SessionDetailTableProps {
  sessionId: number
}

type DetailFilter = 'all' | 'correct' | 'wrong'

export function SessionDetailTable({ sessionId }: SessionDetailTableProps) {
  const { data: detail, isLoading, isError } = useReviewSessionDetail(sessionId)
  const [filter, setFilter] = useState<DetailFilter>('all')

  const summary = useMemo(() => {
    if (!detail) return { total: 0, correct: 0, wrong: 0 }
    const correct = detail.items.filter(i => i.isCorrect).length
    return {
      total: detail.items.length,
      correct,
      wrong: detail.items.length - correct,
    }
  }, [detail])

  const filteredItems = useMemo(() => {
    if (!detail) return []
    if (filter === 'correct') return detail.items.filter(i => i.isCorrect)
    if (filter === 'wrong') return detail.items.filter(i => !i.isCorrect)
    return detail.items
  }, [detail, filter])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
        <Loader2 size={18} className="animate-spin text-emerald-600" />
        <span>Đang tải chi tiết câu hỏi...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <p className="rounded-xl bg-red-50 py-4 text-center text-sm text-red-600">
        Không tải được chi tiết buổi ôn tập.
      </p>
    )
  }

  if (!detail) return null

  return (
    <div className="flex flex-col gap-3.5">
      {/* Filter tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-slate-800 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tất cả ({summary.total})
          </button>
          <button
            type="button"
            onClick={() => setFilter('correct')}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              filter === 'correct'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <CheckCircle2 size={13} />
            Đúng ({summary.correct})
          </button>
          <button
            type="button"
            onClick={() => setFilter('wrong')}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              filter === 'wrong'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-rose-600 hover:bg-rose-50'
            }`}
          >
            <XCircle size={13} />
            Sai ({summary.wrong})
          </button>
        </div>
      </div>

      {/* Filtered empty state */}
      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
          Không có từ nào trong mục này.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`flex flex-col justify-between gap-2.5 rounded-xl border p-3.5 transition-all ${
                item.isCorrect
                  ? 'border-emerald-200/80 bg-white hover:border-emerald-300'
                  : 'border-rose-200/90 bg-rose-50/30 hover:border-rose-300'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 shrink-0">
                  {item.isCorrect ? (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  ) : (
                    <XCircle size={18} className="text-rose-500" />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[15px] font-bold text-slate-900 break-words">
                      {item.word}
                    </span>
                    {item.cefrLevel && (
                      <span
                        className={`rounded border px-1.5 py-0.5 text-[10px] font-bold ${
                          CEFR_CLASS[item.cefrLevel] ??
                          'border-slate-200 bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.cefrLevel}
                      </span>
                    )}
                    {item.partOfSpeech && (
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                          POS_CLASS[item.partOfSpeech.toLowerCase()] ??
                          'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.partOfSpeech}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {item.definition}
                  </p>
                  {item.vnDefinition && (
                    <p className="mt-0.5 text-xs italic text-slate-400">
                      {item.vnDefinition}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer stats: Streak & Interval */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 pl-7 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1 font-medium">
                  <Flame size={12} className="text-amber-500" />
                  Chuỗi đúng: <strong className="text-slate-700">{item.streakBefore ?? 0}</strong> →{' '}
                  <strong
                    className={
                      (item.streakAfter ?? 0) > (item.streakBefore ?? 0)
                        ? 'text-emerald-600'
                        : 'text-rose-600'
                    }
                  >
                    {item.streakAfter ?? 0}
                  </strong>
                </span>

                {(item.intervalBefore !== null || item.intervalAfter !== null) && (
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <TrendingUp size={12} />
                    Chu kỳ: {item.intervalBefore ?? 0}d → {item.intervalAfter ?? 0}d
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
