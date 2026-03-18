import { ArrowLeft, ArrowRight, RotateCcw, Volume2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { UserWordRow } from '../types/vocabulary.types'
import { CEFR_CLASS, STATUS_CLASS, STATUS_LABEL } from './constants'
import { playAudio } from './utils'

export function FlashcardView({ rows, isFetching }: { rows: UserWordRow[]; isFetching: boolean }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    setIndex(0)
    setFlipped(false)
  }, [rows])

  const card = rows[index]

  const goNext = useCallback(() => {
    if (index >= rows.length - 1) return
    setFlipped(false)
    setTimeout(() => setIndex(v => v + 1), 120)
  }, [index, rows.length])

  const goPrev = useCallback(() => {
    if (index <= 0) return
    setFlipped(false)
    setTimeout(() => setIndex(v => v - 1), 120)
  }, [index])

  const flip = useCallback(() => setFlipped(v => !v), [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.code === 'Space') { e.preventDefault(); flip() }
      if (e.key === 'h' || e.key === 'H' || e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
      if (e.key === 'l' || e.key === 'L' || e.key === 'ArrowRight') { e.preventDefault(); goNext() }
      if ((e.key === 'u' || e.key === 'U') && card?.audio?.uk) playAudio(card.audio.uk)
      if ((e.key === 'a' || e.key === 'A') && card?.audio?.us) playAudio(card.audio.us)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [card, flip, goNext, goPrev])

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-24">
        <RotateCcw size={26} className="animate-spin text-emerald-500" />
      </div>
    )
  }

  if (!rows.length) {
    return <div className="py-20 text-center text-sm text-zinc-400">Không có từ nào để hiển thị.</div>
  }

  const progress = ((index + 1) / rows.length) * 100

  return (
    <div className="flex flex-col items-center gap-6 pb-4">
      {/* Progress bar */}
      <div className="flex w-full max-w-2xl items-center gap-3">
        <span className="shrink-0 text-xs tabular-nums text-zinc-400">{index + 1} / {rows.length}</span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200">
          <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Card */}
      {card && (
        <div
          className="w-full max-w-2xl cursor-pointer select-none"
          style={{ perspective: '1200px' }}
          onClick={flip}
        >
          <div
            className="relative w-full transition-transform duration-500"
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              minHeight: '340px',
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-5 rounded-3xl border border-zinc-200 bg-white px-8 py-10 shadow-lg"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {/* Badges */}
              <div className="flex flex-wrap justify-center gap-2">
                {card.cefrLevel && (
                  <span className={`rounded border px-2 py-0.5 text-xs font-bold ${CEFR_CLASS[card.cefrLevel] ?? 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                    {card.cefrLevel}
                  </span>
                )}
                {card.partOfSpeech && (
                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-semibold text-zinc-600">
                    {card.partOfSpeech}
                  </span>
                )}
                {card.status && (
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASS[card.status] ?? 'bg-zinc-50 text-zinc-600 border-zinc-200'}`}>
                    {STATUS_LABEL[card.status] ?? card.status}
                  </span>
                )}
              </div>

              {/* Word */}
              <h2 className="text-center text-5xl font-black tracking-tight text-zinc-900">{card.word}</h2>

              {/* IPA + Audio */}
              <div className="flex flex-wrap justify-center gap-3">
                {card.ipa?.uk && (
                  <button
                    onClick={e => { e.stopPropagation(); card.audio?.uk && playAudio(card.audio.uk) }}
                    className="flex items-center gap-2 rounded-xl border-2 border-blue-200 bg-blue-50 px-4 py-2 font-mono text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    <span className="text-xs font-bold">UK</span>
                    <span>/{card.ipa.uk}/</span>
                    {card.audio?.uk && <Volume2 size={14} className="text-blue-500" />}
                  </button>
                )}
                {card.ipa?.us && (
                  <button
                    onClick={e => { e.stopPropagation(); card.audio?.us && playAudio(card.audio.us) }}
                    className="flex items-center gap-2 rounded-xl border-2 border-amber-200 bg-amber-50 px-4 py-2 font-mono text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-100"
                  >
                    <span className="text-xs font-bold">US</span>
                    <span>/{card.ipa.us}/</span>
                    {card.audio?.us && <Volume2 size={14} className="text-amber-500" />}
                  </button>
                )}
              </div>

              <p className="text-sm text-zinc-400">Nhấn Space hoặc click để xem nghĩa</p>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 flex flex-col justify-center gap-4 rounded-3xl border border-emerald-200 bg-white px-8 py-10 shadow-lg"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <h3 className="text-center text-2xl font-bold text-zinc-900">{card.word}</h3>
              <p className="text-center text-base font-semibold leading-relaxed text-zinc-800">{card.definition}</p>
              {card.vnDefinition && (
                <p className="text-center text-sm italic leading-relaxed text-zinc-500">{card.vnDefinition}</p>
              )}
              {card.examples && card.examples.length > 0 && (
                <div className="mt-2 border-t border-zinc-100 pt-3">
                  <p className="text-center text-xs italic leading-relaxed text-zinc-400">"{card.examples[0]}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button onClick={goPrev} disabled={index === 0} variant="outline" className="rounded-xl">
          <ArrowLeft size={16} /> Trước
        </Button>
        <Button
          onClick={flip}
          className="rounded-xl bg-zinc-800 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700"
        >
          Lật thẻ
        </Button>
        <Button onClick={goNext} disabled={index >= rows.length - 1} variant="outline" className="rounded-xl">
          Tiếp theo <ArrowRight size={16} />
        </Button>
      </div>

      {/* Keyboard shortcuts */}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
        {[
          ['Space', 'Lật thẻ'],
          ['←/H', 'Quay lại'],
          ['→/L', 'Tiếp theo'],
          ['U', 'Nghe UK'],
          ['A', 'Nghe US'],
        ].map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-zinc-500">
            <kbd className="inline-flex h-6 min-w-7 items-center justify-center rounded border border-zinc-300 bg-white px-1.5 font-mono text-[11px] text-zinc-700 shadow-sm">
              {key}
            </kbd>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
