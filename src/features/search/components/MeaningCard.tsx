import { Bookmark, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Meaning } from '../types/search.types'
import { AudioButton } from './AudioButton'
import { CEFR_COLOR } from '../constants'

interface MeaningCardProps {
  meaning: Meaning
  index: number
  showVN: boolean
  saved: boolean
  saving: boolean
  saveError: string | null
  onSave: () => void
  groupUkIpa?: string | null
  groupUsIpa?: string | null
}

export function MeaningCard({
  meaning,
  index,
  showVN,
  saved,
  saving,
  saveError,
  onSave,
  groupUkIpa,
  groupUsIpa,
}: MeaningCardProps) {
  const [showAllExamples, setShowAllExamples] = useState(false)

  // Only show IPA inside the individual meaning row if it differs from the POS group's default IPA
  const hasCustomUkIpa =
    Boolean(meaning.ipa.uk) && meaning.ipa.uk !== groupUkIpa
  const hasCustomUsIpa =
    Boolean(meaning.ipa.us) && meaning.ipa.us !== groupUsIpa

  const visibleExamples = showAllExamples
    ? meaning.examples
    : meaning.examples.slice(0, 1)
  const hiddenExamplesCount = Math.max(0, meaning.examples.length - 1)

  return (
    <article
      id={`meaning-${meaning.id}`}
      className="group relative flex items-start gap-3 px-4 py-3.5 transition-colors first:pt-4 last:pb-4 hover:bg-slate-50/70 sm:gap-4 sm:px-5 sm:py-4"
    >
      {/* Left Column: Sense Index + CEFR Level */}
      <div className="flex w-9 shrink-0 flex-col items-center gap-1 pt-0.5 sm:w-10">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-xs font-extrabold tabular-nums text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800">
          {index}
        </span>
        {meaning.cefrLevel && (
          <Badge
            variant="outline"
            className={`h-4.5 rounded px-1.5 py-0 text-[10px] font-extrabold ${
              CEFR_COLOR[meaning.cefrLevel] ??
              'border-slate-200 bg-slate-100 text-slate-600'
            }`}
          >
            {meaning.cefrLevel}
          </Badge>
        )}
      </div>

      {/* Center Column: Concise Meaning Layer + Examples */}
      <div className="min-w-0 flex-1">
        {/* Optional variant IPA if different from group header */}
        {(hasCustomUkIpa || hasCustomUsIpa) && (
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            {hasCustomUkIpa &&
              (meaning.audio.uk ? (
                <AudioButton
                  url={meaning.audio.uk}
                  label="UK"
                  ipa={meaning.ipa.uk}
                  tone="uk"
                />
              ) : (
                <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-xs text-blue-700">
                  UK /{meaning.ipa.uk}/
                </span>
              ))}
            {hasCustomUsIpa &&
              (meaning.audio.us ? (
                <AudioButton
                  url={meaning.audio.us}
                  label="US"
                  ipa={meaning.ipa.us}
                  tone="us"
                />
              ) : (
                <span className="rounded bg-amber-50 px-2 py-0.5 font-mono text-xs text-amber-700">
                  US /{meaning.ipa.us}/
                </span>
              ))}
          </div>
        )}

        {/* Vietnamese sense headline (when showVN is active) + English definition */}
        {showVN && meaning.vnDefinition ? (
          <div className="space-y-0.5">
            <p className="text-[15px] font-bold leading-snug text-emerald-800">
              {meaning.vnDefinition}
            </p>
            <p className="text-sm leading-relaxed text-slate-700">
              {meaning.definition}
            </p>
          </div>
        ) : (
          <p className="text-[15px] font-semibold leading-snug text-slate-900">
            {meaning.definition}
          </p>
        )}

        {saveError && (
          <p className="mt-1 text-xs font-medium text-red-500">{saveError}</p>
        )}

        {/* Compact Examples */}
        {meaning.examples.length > 0 && (
          <div className="mt-2 space-y-1">
            {visibleExamples.map((example, i) => (
              <p
                key={i}
                className="border-l-2 border-emerald-300/80 pl-2.5 text-xs italic leading-relaxed text-slate-500 sm:text-[13px]"
              >
                "{example}"
              </p>
            ))}

            {hiddenExamplesCount > 0 && (
              <button
                type="button"
                onClick={() => setShowAllExamples(v => !v)}
                className="inline-flex items-center gap-1 pt-0.5 text-[11px] font-semibold text-slate-400 transition hover:text-emerald-600"
              >
                {showAllExamples ? (
                  <>
                    <ChevronUp size={12} /> Thu gọn ví dụ
                  </>
                ) : (
                  <>
                    <ChevronDown size={12} /> +{hiddenExamplesCount} ví dụ khác
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right Column: Save Button */}
      <div className="shrink-0">
        <Button
          type="button"
          size="xs"
          variant={saved ? 'secondary' : 'outline'}
          onClick={onSave}
          disabled={saved || saving}
          title={saved ? 'Đã lưu nghĩa này' : 'Lưu lớp nghĩa này vào kho từ'}
          className={`rounded-lg px-2.5 font-semibold transition ${
            saved
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-slate-200 text-slate-500 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          {saved ? (
            <>
              <Check size={12} />
              <span className="hidden sm:inline">Đã lưu</span>
            </>
          ) : (
            <>
              <Bookmark size={12} />
              <span>{saving ? '...' : 'Lưu'}</span>
            </>
          )}
        </Button>
      </div>
    </article>
  )
}
