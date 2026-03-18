import { Volume2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { UserWordRow } from '../types/vocabulary.types'
import { CEFR_CLASS, STATUS_LABEL } from './constants'
import { playAudio, statusClasses } from './utils'

export function GridView({ rows, isFetching }: { rows: UserWordRow[]; isFetching: boolean }) {
  if (isFetching) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border border-zinc-200 bg-white p-4">
            <div className="mb-3 h-5 w-1/2 rounded bg-zinc-100" />
            <div className="mb-2 h-3 w-1/4 rounded bg-zinc-100" />
            <div className="h-10 rounded bg-zinc-100" />
          </div>
        ))}
      </div>
    )
  }

  if (!rows.length) {
    return <div className="py-12 text-center text-sm text-zinc-400">Chưa có từ nào được lưu.</div>
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map(row => (
        <article
          key={row.userWordId}
          className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-sm"
        >
          {/* Header: word + badges */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold leading-tight text-zinc-900">{row.word}</h3>
            <div className="flex shrink-0 flex-wrap justify-end gap-1">
              {row.cefrLevel && (
                <Badge variant="outline" className={`text-[10px] ${CEFR_CLASS[row.cefrLevel] ?? 'bg-zinc-50 text-zinc-600 border-zinc-200'}`}>
                  {row.cefrLevel}
                </Badge>
              )}
              <Badge variant="outline" className={`text-[10px] ${statusClasses(row.status)}`}>
                {STATUS_LABEL[row.status ?? 'new'] ?? (row.status ?? 'new')}
              </Badge>
            </div>
          </div>

          {/* Part of speech */}
          {row.partOfSpeech && (
            <span className="w-fit rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-semibold text-zinc-500">
              {row.partOfSpeech}
            </span>
          )}

          {/* IPA + audio */}
          {(row.ipa?.uk || row.ipa?.us) && (
            <div className="flex flex-wrap gap-2">
              {row.ipa.uk && (
                <button
                  onClick={() => row.audio?.uk && playAudio(row.audio.uk)}
                  className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                >
                  <span className="text-[10px] font-bold">UK</span>
                  <span>/{row.ipa.uk}/</span>
                  {row.audio?.uk && <Volume2 size={11} className="text-blue-400" />}
                </button>
              )}
              {row.ipa.us && (
                <button
                  onClick={() => row.audio?.us && playAudio(row.audio.us)}
                  className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-amber-700 transition-colors hover:bg-amber-100"
                >
                  <span className="text-[10px] font-bold">US</span>
                  <span>/{row.ipa.us}/</span>
                  {row.audio?.us && <Volume2 size={11} className="text-amber-400" />}
                </button>
              )}
            </div>
          )}

          {/* Definition */}
          <div className="flex flex-col gap-1">
            <p className="text-sm leading-relaxed text-zinc-700">{row.definition}</p>
            {row.vnDefinition && (
              <p className="text-xs italic leading-relaxed text-zinc-400">{row.vnDefinition}</p>
            )}
          </div>

          {/* Example */}
          {row.examples && row.examples.length > 0 && (
            <p className="border-l-2 border-emerald-200 pl-2.5 text-xs italic leading-relaxed text-zinc-500">
              "{row.examples[0]}"
            </p>
          )}
        </article>
      ))}
    </div>
  )
}
