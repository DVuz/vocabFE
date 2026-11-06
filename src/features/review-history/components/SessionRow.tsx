import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  HelpCircle,
  XCircle,
} from 'lucide-react'
import type { ReviewSessionSummary } from '../types/review-history.types'
import { SessionDetailTable } from './SessionDetailTable'
import { formatDate, formatDuration, scoreTone } from './utils'

interface SessionRowProps {
  session: ReviewSessionSummary
  expanded: boolean
  onToggle: () => void
}

export function SessionRow({ session, expanded, onToggle }: SessionRowProps) {
  const percent = Math.round(session.scorePercent ?? 0)
  const scoreClass = scoreTone(session.scorePercent)

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white transition-all ${
        expanded
          ? 'border-emerald-200 shadow-md'
          : 'border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {/* Header row — clickable */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50/70 sm:gap-5 sm:px-6 sm:py-4.5"
      >
        {/* Score Circle */}
        <div
          className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl border text-center font-extrabold sm:h-14 sm:w-14 ${scoreClass}`}
        >
          <span className="text-sm leading-none sm:text-base">{percent}%</span>
          <span className="mt-0.5 text-[9px] font-semibold uppercase opacity-75">Điểm</span>
        </div>

        {/* Main Info */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-800 sm:text-[15px]">
                <Calendar size={14} className="text-slate-400" />
                {formatDate(session.startedAt)}
              </span>
              {session.sessionType && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 capitalize">
                  {session.sessionType === 'quiz' ? 'Kiểm tra' : session.sessionType}
                </span>
              )}
            </div>

            <span className="hidden items-center gap-1 text-xs font-medium text-slate-400 sm:inline-flex">
              <Clock size={13} />
              {formatDuration(session.durationSeconds)}
            </span>
          </div>

          {/* Stats pills */}
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1 font-medium text-slate-700">
              <HelpCircle size={13} className="text-slate-400" />
              {session.totalQuestions} câu
            </span>

            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
              <CheckCircle2 size={13} />
              {session.correctAnswers} đúng
            </span>

            <span className="inline-flex items-center gap-1 font-semibold text-rose-500">
              <XCircle size={13} />
              {session.incorrectAnswers} sai
            </span>

            <span className="inline-flex items-center gap-1 text-slate-400 sm:hidden">
              <Clock size={13} />
              {formatDuration(session.durationSeconds)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percent >= 80
                  ? 'bg-emerald-500'
                  : percent >= 50
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
            />
          </div>
        </div>

        {/* Chevron */}
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors ${
            expanded
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-slate-50 text-slate-400'
          }`}
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-3.5 py-4 sm:px-6 sm:py-5">
          <SessionDetailTable sessionId={session.id} />
        </div>
      )}
    </article>
  )
}
