import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { useMemo } from 'react'
import { CEFR_CLASS, POS_CLASS } from '../../vocab/components/constants'
import { useReviewSessionDetail } from '../hooks/use-review-history'

interface SessionDetailTableProps {
  sessionId: number
}

export function SessionDetailTable({ sessionId }: SessionDetailTableProps) {
  const { data: detail, isLoading, isError } = useReviewSessionDetail(sessionId)

  const summary = useMemo(() => {
    if (!detail) return null
    const correct = detail.items.filter(i => i.isCorrect).length
    return { correct, wrong: detail.items.length - correct }
  }, [detail])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 size={20} className="animate-spin text-emerald-500" />
      </div>
    )
  }

  if (isError) {
    return <p className="py-4 text-center text-sm text-red-500">Không tải được chi tiết session.</p>
  }

  if (!detail) return null

  return (
    <div className="flex flex-col gap-3">
      {/* Summary */}
      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
          <CheckCircle2 size={15} />
          Đúng: {summary?.correct ?? 0}
        </span>
        <span className="flex items-center gap-1.5 font-semibold text-red-500">
          <XCircle size={15} />
          Sai: {summary?.wrong ?? 0}
        </span>
      </div>

      {/* Item cards */}
      <div className="flex flex-col gap-2">
        {detail.items.map(item => (
          <div
            key={item.id}
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition-all ${
              item.isCorrect
                ? 'border-emerald-200 bg-emerald-50/60'
                : 'border-red-200 bg-red-50/60'
            }`}
          >
            {/* Icon */}
            <span className="mt-0.5 shrink-0">
              {item.isCorrect
                ? <CheckCircle2 size={18} className="text-emerald-500" />
                : <XCircle size={18} className="text-red-400" />}
            </span>

            {/* Content */}
            <div className="min-w-0 flex-1">
              {/* Word + badges */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-zinc-900">{item.word}</span>
                {item.cefrLevel && (
                  <span className={`rounded border px-1.5 py-0.5 text-[10px] font-bold ${CEFR_CLASS[item.cefrLevel] ?? 'border-zinc-200 bg-zinc-100 text-zinc-600'}`}>
                    {item.cefrLevel}
                  </span>
                )}
                {item.partOfSpeech && (
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${POS_CLASS[item.partOfSpeech.toLowerCase()] ?? 'bg-zinc-100 text-zinc-500'}`}>
                    {item.partOfSpeech}
                  </span>
                )}
              </div>

              {/* Definition */}
              <p className="mt-0.5 text-sm leading-relaxed text-zinc-600">{item.definition}</p>
              {item.vnDefinition && (
                <p className="text-xs italic text-zinc-400">{item.vnDefinition}</p>
              )}
            </div>

            {/* Streak */}
            <span className="shrink-0 whitespace-nowrap text-xs text-zinc-400">
              streak {item.streakBefore ?? 0} → {item.streakAfter ?? 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}