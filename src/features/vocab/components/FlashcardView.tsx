import {
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  Sparkles,
  Volume2,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { UserWordRow } from '../types/vocabulary.types'
import { CEFR_CLASS, POS_CLASS, STATUS_CLASS, STATUS_LABEL } from './constants'
import { playAudio } from './utils'

export function FlashcardView({
  rows,
  isFetching,
}: {
  rows: UserWordRow[]
  isFetching: boolean
}) {
  const rowsKey = useMemo(
    () => rows.map(r => r.userWordId).join(','),
    [rows],
  )

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200/80 bg-white py-24 text-sm text-slate-500 shadow-2xs">
        <RotateCcw size={26} className="animate-spin text-emerald-500" />
        <span>Đang tải thẻ từ vựng...</span>
      </div>
    )
  }

  if (!rows.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400">
        Không có từ nào để hiển thị.
      </div>
    )
  }

  return <FlashcardDeck key={rowsKey} initialRows={rows} />
}

function FlashcardDeck({ initialRows }: { initialRows: UserWordRow[] }) {
  const [deck, setDeck] = useState<UserWordRow[]>(initialRows)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)

  const card = deck[index]
  const ttsAudioUrl = card?.audio?.tts ?? null

  const goNext = useCallback(() => {
    if (index >= deck.length - 1) return
    setFlipped(false)
    setTimeout(() => setIndex(v => v + 1), 120)
  }, [index, deck.length])

  const goPrev = useCallback(() => {
    if (index <= 0) return
    setFlipped(false)
    setTimeout(() => setIndex(v => v - 1), 120)
  }, [index])

  const flip = useCallback(() => setFlipped(v => !v), [])

  const handleShuffle = useCallback(() => {
    setFlipped(false)
    setIndex(0)
    if (isShuffled) {
      setDeck(initialRows)
      setIsShuffled(false)
    } else {
      const copy = [...initialRows]
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
      }
      setDeck(copy)
      setIsShuffled(true)
    }
  }, [initialRows, isShuffled])

  const handleRestart = useCallback(() => {
    setFlipped(false)
    setIndex(0)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tts = card?.audio?.tts
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }
      if (e.code === 'Space') {
        e.preventDefault()
        flip()
      }
      if (e.key === 'h' || e.key === 'H' || e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
      if (e.key === 'l' || e.key === 'L' || e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
      if ((e.key === 'u' || e.key === 'U') && card?.audio?.uk) {
        playAudio(card.audio.uk)
      }
      if ((e.key === 'a' || e.key === 'A') && card?.audio?.us) {
        playAudio(card.audio.us)
      }
      if ((e.key === 'm' || e.key === 'M') && tts) {
        playAudio(tts)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [card, flip, goNext, goPrev])

  const progress = ((index + 1) / deck.length) * 100

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 pb-6 sm:gap-5">
      {/* Top Progress & Deck Actions */}
      <div className="flex w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-3.5 py-2.5 shadow-2xs sm:px-4">
        <span className="shrink-0 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-extrabold tabular-nums text-emerald-700">
          {index + 1} / {deck.length}
        </span>

        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleShuffle}
            title={isShuffled ? 'ắt trộn thẻ' : 'Trộn ngẫu nhiên'}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              isShuffled
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            <Shuffle size={13} />
            <span className="hidden sm:inline">Trộn</span>
          </button>
          <button
            type="button"
            onClick={handleRestart}
            disabled={index === 0 && !flipped}
            title="Quay về thẻ đầu tiên"
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* 3D Flip Card using CSS Grid overlay so height adapts automatically */}
      {card && (
        <div
          className="w-full cursor-pointer select-none"
          style={{ perspective: '1400px' }}
          onClick={flip}
        >
          <div
            className="relative grid w-full transition-transform duration-500 [grid-template-areas:'card']"
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* FRONT FACE */}
            <div
              className="flex min-h-[300px] flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 shadow-md [grid-area:card] sm:min-h-[360px] sm:p-8"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {/* Top Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {card.cefrLevel && (
                    <span
                      className={`rounded-md border px-2 py-0.5 text-xs font-bold ${
                        CEFR_CLASS[card.cefrLevel] ??
                        'border-slate-200 bg-slate-100 text-slate-600'
                      }`}
                    >
                      {card.cefrLevel}
                    </span>
                  )}
                  {card.partOfSpeech && (
                    <span
                      className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                        POS_CLASS[card.partOfSpeech.toLowerCase()] ??
                        'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {card.partOfSpeech}
                    </span>
                  )}
                  {card.status && (
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                        STATUS_CLASS[card.status] ??
                        'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      {STATUS_LABEL[card.status] ?? card.status}
                    </span>
                  )}
                </div>

                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
                  Mặt trước
                </span>
              </div>

              {/* Center Word & Pronunciation */}
              <div className="my-6 flex flex-col items-center gap-5 text-center sm:my-8">
                <h2 className="max-w-full text-3xl font-black tracking-tight break-words text-slate-900 sm:text-4xl md:text-5xl">
                  {card.word}
                </h2>

                {(card.ipa?.uk || card.ipa?.us) && (
                  <div className="flex flex-wrap justify-center gap-2.5">
                    {card.ipa.uk && (
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation()
                          if (card.audio?.uk) playAudio(card.audio.uk)
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/80 px-3.5 py-1.5 font-mono text-xs font-semibold text-blue-700 transition hover:bg-blue-100 sm:text-sm"
                      >
                        <span className="text-[10px] font-extrabold tracking-wider text-blue-500 uppercase">
                          UK
                        </span>
                        <span>/{card.ipa.uk}/</span>
                        {card.audio?.uk && (
                          <Volume2 size={14} className="text-blue-500" />
                        )}
                      </button>
                    )}
                    {card.ipa.us && (
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation()
                          if (card.audio?.us) playAudio(card.audio.us)
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-3.5 py-1.5 font-mono text-xs font-semibold text-amber-700 transition hover:bg-amber-100 sm:text-sm"
                      >
                        <span className="text-[10px] font-extrabold tracking-wider text-amber-500 uppercase">
                          US
                        </span>
                        <span>/{card.ipa.us}/</span>
                        {card.audio?.us && (
                          <Volume2 size={14} className="text-amber-500" />
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Flip Hint */}
              <p className="text-center text-xs font-medium text-slate-400">
                Chạm vào thẻ hoặc nhấn <span className="font-semibold">Space</span> để xem nghĩa
              </p>
            </div>

            {/* BACK FACE */}
            <div
              className="flex min-h-[300px] flex-col justify-between rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-white via-white to-emerald-50/30 p-5 shadow-md [grid-area:card] sm:min-h-[360px] sm:p-8"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              {/* Top Bar on Back */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                    {card.word}
                  </h3>
                  {card.partOfSpeech && (
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      {card.partOfSpeech}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {card.audio?.uk && (
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation()
                        playAudio(card.audio.uk!)
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-100"
                    >
                      <Volume2 size={12} /> UK
                    </button>
                  )}
                  {card.audio?.us && (
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation()
                        playAudio(card.audio.us!)
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700 hover:bg-amber-100"
                    >
                      <Volume2 size={12} /> US
                    </button>
                  )}
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                    Giải nghĩa
                  </span>
                </div>
              </div>

              {/* Definition & Meaning Audio */}
              <div className="my-4 flex flex-col gap-3 sm:my-5">
                <div className="flex items-start gap-3">
                  {ttsAudioUrl && (
                    <MeaningAudioButton
                      key={ttsAudioUrl}
                      audioUrl={ttsAudioUrl}
                    />
                  )}
                  <p className="min-w-0 flex-1 text-base font-bold leading-relaxed break-words text-slate-800 sm:text-lg">
                    {card.definition}
                  </p>
                </div>

                {card.vnDefinition && (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-2.5">
                    <p className="text-sm font-medium leading-relaxed text-emerald-900">
                      <Sparkles
                        size={13}
                        className="mr-1.5 inline text-emerald-600"
                      />
                      {card.vnDefinition}
                    </p>
                  </div>
                )}

                {card.examples && card.examples.length > 0 && (
                  <div className="mt-1 space-y-1.5 border-t border-slate-100 pt-3">
                    <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      Ví dụ ngữ cảnh
                    </p>
                    {card.examples.slice(0, 2).map((example, idx) => (
                      <p
                        key={idx}
                        className="border-l-2 border-emerald-300 pl-3 text-xs italic leading-relaxed text-slate-600 sm:text-sm"
                      >
                        "{example}"
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-center text-xs font-medium text-slate-400">
                Chạm vào thẻ để lật lại mặt trước
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="grid w-full grid-cols-3 gap-2.5 sm:max-w-md sm:gap-3">
        <Button
          onClick={goPrev}
          disabled={index === 0}
          variant="outline"
          className="h-11 rounded-2xl border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
        >
          <ArrowLeft size={16} /> Trước
        </Button>
        <Button
          onClick={flip}
          className="h-11 rounded-2xl bg-emerald-600 text-sm font-bold text-white shadow-sm hover:bg-emerald-700"
        >
          Lật thẻ
        </Button>
        <Button
          onClick={goNext}
          disabled={index >= deck.length - 1}
          variant="outline"
          className="h-11 rounded-2xl border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
        >
          Tiếp <ArrowRight size={16} />
        </Button>
      </div>

      {/* Keyboard Shortcuts (Desktop) */}
      <div className="hidden flex-wrap justify-center gap-x-4 gap-y-2 pt-1 sm:flex">
        {[
          ['Space', 'Lật thẻ'],
          ['← / H', 'Thẻ trước'],
          ['→ / L', 'Thẻ tiếp'],
          ['U', 'Nghe UK'],
          ['A', 'Nghe US'],
          ['M', 'Nghe nghĩa'],
        ].map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-slate-500">
            <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-slate-200 bg-white px-1.5 font-mono text-[11px] font-semibold text-slate-700 shadow-2xs">
              {key}
            </kbd>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MeaningAudioButton({ audioUrl }: { audioUrl: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = new Audio(audioUrl)
    audioRef.current = audio
    audio.onended = () => setPlaying(false)
    audio.onerror = () => setPlaying(false)

    return () => {
      audio.pause()
      audio.onended = null
      audio.onerror = null
    }
  }, [audioUrl])

  const toggle = useCallback((event: React.MouseEvent) => {
    event.stopPropagation()
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      void audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
    } else {
      audio.pause()
      setPlaying(false)
    }
  }, [])

  return (
    <button
      type="button"
      onClick={toggle}
      title={playing ? 'Tạm dừng đọc nghĩa' : 'Nghe đọc nghĩa'}
      aria-label={playing ? 'Tạm dừng đọc nghĩa' : 'Nghe đọc nghĩa'}
      className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-2xs transition hover:border-emerald-300 hover:bg-emerald-100"
    >
      {playing ? (
        <Pause size={15} fill="currentColor" />
      ) : (
        <Play size={15} fill="currentColor" />
      )}
    </button>
  )
}
