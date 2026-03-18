import { CheckCircle2, ChevronDown, ChevronUp, Clock, XCircle } from 'lucide-react'
import type { ReviewSessionSummary } from '../types/review-history.types'
import { SessionDetailTable } from './SessionDetailTable'
import { formatDate, formatDuration, scoreTone } from './utils'

interface SessionRowProps {
  session: ReviewSessionSummary
  expanded: boolean
  onToggle: () => void
}

export function SessionRow({ session, expanded, onToggle }: SessionRowProps) {
  const percent = session.scorePercent ?? 0
  const scoreClass = scoreTone(session.scorePercent)

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all">
      {/* Header row — clickable */}
      <button
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-zinc-50"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {/* Time + score */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-zinc-800">{formatDate(session.startedAt)}</span>
            <span className={`rounded-md border px-2 py-0.5 text-xs font-bold ${scoreClass}`}>
              {percent}%
            </span>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
            <span className="font-medium text-zinc-700">{session.totalQuestions} câu hỏi</span>

            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 size={13} />
              {session.correctAnswers} đúng
            </span>

            <span className="flex items-center gap-1 text-red-500">
              <XCircle size={13} />
              {session.incorrectAnswers} sai
            </span>

            <span className="flex items-center gap-1 text-zinc-400">
              <Clock size={13} />
              {formatDuration(session.durationSeconds)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percent >= 80 ? 'bg-emerald-500' : percent >= 50 ? 'bg-amber-400' : 'bg-red-400'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Chevron */}
        <span className="mt-1 shrink-0 text-zinc-400">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-zinc-100 px-5 py-4">
          <SessionDetailTable sessionId={session.id} />
        </div>
      )}
    </div>
  )
}