import { X } from 'lucide-react'
import { useEffect } from 'react'
import { CEFR_CLASS, POS_CLASS } from './constants'
import type { UserWordRow } from '../types/vocabulary.types'
import { AudioButton } from './AudioButton'

interface MeaningDialogProps {
  row: UserWordRow | null
  open: boolean
  onClose: () => void
}

export function MeaningDialog({ row, open, onClose }: MeaningDialogProps) {
  useEffect(() => {
    if (!open) return
    const onEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [open, onClose])

  if (!open || !row) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl"
        style={{ animation: 'dialogIn 0.18s cubic-bezier(0.16,1,0.3,1) both' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-5 pt-4 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              {row.word}
            </span>
            {row.partOfSpeech && (
              <span className={`rounded px-2 py-0.5 text-xs font-semibold ${POS_CLASS[row.partOfSpeech.toLowerCase()] ?? 'bg-zinc-100 text-zinc-500'}`}>
                {row.partOfSpeech}
              </span>
            )}
            {row.cefrLevel && (
              <span className={`rounded border px-2 py-0.5 text-xs font-bold ${CEFR_CLASS[row.cefrLevel] ?? 'border-zinc-200 bg-zinc-100 text-zinc-500'}`}>
                {row.cefrLevel}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Đóng"
          >
            <X size={16} />
          </button>
        </div>

        {/* IPA */}
        {(row.ipa.uk || row.ipa.us) && (
          <div className="flex flex-wrap gap-2 px-5 pb-3">
            {row.ipa.uk && (
              <span className="inline-flex items-center gap-1.5 rounded border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30 px-2.5 py-1 font-mono text-[12px] text-blue-700 dark:text-blue-300">
                UK /{row.ipa.uk}/
                {row.audio.uk && <AudioButton url={row.audio.uk} label="▶" />}
              </span>
            )}
            {row.ipa.us && (
              <span className="inline-flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 px-2.5 py-1 font-mono text-[12px] text-amber-700 dark:text-amber-300">
                US /{row.ipa.us}/
                {row.audio.us && <AudioButton url={row.audio.us} label="▶" />}
              </span>
            )}
          </div>
        )}

        {/* Definition */}
        <div className="px-5 pb-3">
          <p className="text-[15px] font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
            {row.definition}
          </p>
          {row.vnDefinition && (
            <p className="mt-1 text-[14px] italic text-zinc-400 dark:text-zinc-500">
              {row.vnDefinition}
            </p>
          )}
        </div>

        {/* Examples */}
        {row.examples.length > 0 && (
          <div className="border-t border-zinc-100 dark:border-zinc-800 px-5 py-3 flex flex-col gap-1.5">
            {row.examples.map((example, i) => (
              <p key={i} className="border-l-2 border-emerald-300 dark:border-emerald-700 pl-3 text-[13px] italic text-zinc-500 dark:text-zinc-400 leading-relaxed">
                &ldquo;{example}&rdquo;
              </p>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes dialogIn {
          from { opacity: 0; transform: translateY(6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }
      `}</style>
    </div>
  )
}