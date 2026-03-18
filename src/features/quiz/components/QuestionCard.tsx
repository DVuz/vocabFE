import { ArrowRight, CheckCircle2, Volume2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CEFR_CLASS, POS_CLASS } from '../../vocab/components/constants'
import type { Question } from './utils'
import { playAudio } from './utils'

interface QuestionCardProps {
  question: Question
  index: number
  total: number
  answered: number | null
  onAnswer: (index: number) => void
  onNext: () => void
}

function choiceClass(choiceIndex: number, answered: number | null, correctIndex: number) {
  if (answered === null) {
    return 'cursor-pointer border-zinc-200 bg-white hover:border-emerald-400 hover:bg-emerald-50'
  }
  if (choiceIndex === correctIndex) {
    return 'cursor-default border-emerald-500 bg-emerald-50'
  }
  if (choiceIndex === answered) {
    return 'cursor-default border-red-400 bg-red-50'
  }
  return 'cursor-default border-zinc-100 bg-zinc-50 opacity-50'
}

function choiceBadgeClass(choiceIndex: number, answered: number | null, correctIndex: number) {
  if (answered === null) return 'bg-zinc-100 text-zinc-500'
  if (choiceIndex === correctIndex) return 'bg-emerald-500 text-white'
  if (choiceIndex === answered) return 'bg-red-400 text-white'
  return 'bg-zinc-100 text-zinc-300'
}

export function QuestionCard({ question, index, total, answered, onAnswer, onNext }: QuestionCardProps) {
  const { card, choices, correctIndex } = question
  const isAnswered = answered !== null

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Progress row */}
      <div className="mb-4 flex items-center justify-between text-sm text-zinc-400">
        <span>Câu {index + 1} / {total}</span>
        <div className="mx-4 h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
        {isAnswered && (
          answered === correctIndex
            ? <CheckCircle2 size={18} className="text-emerald-500" />
            : <XCircle size={18} className="text-red-500" />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Word card */}
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-1.5">
            {card.cefrLevel && (
              <span className={`rounded border px-2 py-0.5 text-xs font-bold ${CEFR_CLASS[card.cefrLevel] ?? 'border-zinc-200 bg-zinc-100 text-zinc-500'}`}>
                {card.cefrLevel}
              </span>
            )}
            {card.partOfSpeech && (
              <span className={`rounded px-2 py-0.5 text-xs font-semibold ${POS_CLASS[card.partOfSpeech.toLowerCase()] ?? 'bg-zinc-100 text-zinc-500'}`}>
                {card.partOfSpeech}
              </span>
            )}
          </div>

          <h2 className="text-4xl font-black tracking-tight text-zinc-900">{card.word}</h2>

          <div className="w-full space-y-1.5">
            {card.ipa.uk && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-blue-400">UK</span>
                <span className="font-mono text-sm text-blue-700">/{card.ipa.uk}/</span>
                {card.audio.uk && (
                  <button
                    onClick={() => playAudio(card.audio.uk!)}
                    className="text-blue-400 transition-colors hover:text-blue-600"
                    title="[U] Nghe UK"
                  >
                    <Volume2 size={14} />
                  </button>
                )}
              </div>
            )}
            {card.ipa.us && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-400">US</span>
                <span className="font-mono text-sm text-amber-700">/{card.ipa.us}/</span>
                {card.audio.us && (
                  <button
                    onClick={() => playAudio(card.audio.us!)}
                    className="text-amber-400 transition-colors hover:text-amber-600"
                    title="[A] Nghe US"
                  >
                    <Volume2 size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Choices */}
        <div className="flex flex-col gap-2">
          {choices.map((definition, i) => (
            <button
              key={i}
              disabled={isAnswered}
              onClick={() => onAnswer(i)}
              className={`relative flex w-full items-start gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm leading-relaxed transition-all ${choiceClass(i, answered, correctIndex)}`}
            >
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${choiceBadgeClass(i, answered, correctIndex)}`}>
                {i + 1}
              </span>
              <span className={isAnswered && i === correctIndex ? 'font-medium text-emerald-800' : ''}>
                {definition}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Next button */}
      {isAnswered && (
        <div className="mt-4 flex justify-end">
          <Button onClick={onNext} className="rounded-xl bg-zinc-800 text-white hover:bg-zinc-700">
            {index < total - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
            <ArrowRight size={16} />
          </Button>
        </div>
      )}

      {/* Keyboard hints */}
      <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {[
          ['1', 'Chọn 1'],
          ['2', 'Chọn 2'],
          ['3', 'Chọn 3'],
          ['4', 'Chọn 4'],
          ['U', 'Nghe UK'],
          ['A', 'Nghe US'],
        ].map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-zinc-400">
            <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-zinc-300 bg-white px-1.5 font-mono text-[11px] text-zinc-600 shadow-sm">
              {key}
            </kbd>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
