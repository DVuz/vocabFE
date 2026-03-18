import { BookOpen } from 'lucide-react'
import type { Meaning } from '../types/search.types'
import { AudioButton } from './AudioButton'
import { CEFR_COLOR, POS_COLOR } from '../constants'

interface MeaningCardProps {
  meaning: Meaning
  index: number
  showVN: boolean
  saved: boolean
  saving: boolean
  saveError: string | null
  onSave: () => void
}

export function MeaningCard({ meaning, index, showVN, saved, saving, saveError, onSave }: MeaningCardProps) {
  const posClass = POS_COLOR[meaning.partOfSpeech] ?? 'bg-zinc-100 text-zinc-600 border-zinc-200'

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span className="shrink-0 text-xs font-bold text-zinc-300">{index}</span>

          <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${posClass}`}>
            {meaning.partOfSpeech}
          </span>

          {meaning.cefrLevel && (
            <span className={`shrink-0 rounded border px-1.5 py-0.5 text-xs font-bold ${CEFR_COLOR[meaning.cefrLevel] ?? 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
              {meaning.cefrLevel}
            </span>
          )}

          {(meaning.ipa.uk || meaning.ipa.us) && (
            <div className="flex flex-wrap items-center gap-2">
              {meaning.ipa.uk && (
                <span className="flex items-center gap-1.5 rounded-md border-2 border-blue-300 bg-blue-50 px-3 py-1 font-mono text-[12px] font-semibold text-blue-700">
                  <span className="text-blue-600">UK</span>
                  <span>/{meaning.ipa.uk}/</span>
                  {meaning.audio.uk && <AudioButton url={meaning.audio.uk} label="UK" />}
                </span>
              )}
              {meaning.ipa.us && (
                <span className="flex items-center gap-1.5 rounded-md border-2 border-amber-300 bg-amber-50 px-3 py-1 font-mono text-[12px] font-semibold text-amber-700">
                  <span className="text-amber-600">US</span>
                  <span>/{meaning.ipa.us}/</span>
                  {meaning.audio.us && <AudioButton url={meaning.audio.us} label="US" />}
                </span>
              )}
            </div>
          )}
        </div>

        <button
          onClick={onSave}
          disabled={saved || saving}
          title={saved ? 'Đã lưu' : 'Thêm vào danh sách từ'}
          className={`shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all
            ${saved
              ? 'bg-emerald-50 border-emerald-300 text-emerald-600 cursor-default'
              : saving
                ? 'border-zinc-200 text-zinc-300 cursor-wait'
                : 'border-zinc-200 text-zinc-400 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
        >
          <BookOpen size={11} />
          {saving ? 'Đang lưu…' : saved ? 'Đã lưu' : 'Lưu'}
        </button>
      </div>

      {saveError && <p className="mb-2 text-xs text-red-500">{saveError}</p>}

      <p className="text-sm leading-relaxed font-medium text-zinc-900">{meaning.definition}</p>
      {showVN && <p className="mt-0.5 text-sm leading-relaxed text-zinc-500 italic">{meaning.vnDefinition}</p>}

      {meaning.examples.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1.5">
          {meaning.examples.map((example, i) => (
            <li key={i} className="border-l-2 border-emerald-300 pl-3 text-xs leading-relaxed text-zinc-600 italic">
              "{example}"
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}