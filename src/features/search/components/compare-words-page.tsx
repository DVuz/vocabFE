import { ArrowLeftRight, Search } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { fetchWordDetail, isApiError } from '../api/search.api'
import type { Meaning, WordData } from '../types/search.types'
import { AudioButton } from './AudioButton'
import { CEFR_COLOR, POS_COLOR } from '../constants'

interface CompareWordsPageProps {
  wordA: string
  wordB: string
}

function MeaningList({ data }: { data: WordData }) {
  return (
    <div className="flex flex-col gap-3">
      {data.meanings.map((meaning, index) => (
        <MeaningComparisonCard key={meaning.id} meaning={meaning} index={index + 1} />
      ))}
    </div>
  )
}

function MeaningComparisonCard({ meaning, index }: { meaning: Meaning; index: number }) {
  const posClass = POS_COLOR[meaning.partOfSpeech] ?? 'bg-zinc-100 text-zinc-600 border-zinc-200'

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-zinc-300">{index}</span>
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${posClass}`}>{meaning.partOfSpeech}</span>
        {meaning.cefrLevel && (
          <span className={`rounded border px-1.5 py-0.5 text-xs font-bold ${CEFR_COLOR[meaning.cefrLevel] ?? 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
            {meaning.cefrLevel}
          </span>
        )}
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {meaning.ipa.uk && (
          <div className="flex items-center gap-1.5 rounded-md border-2 border-blue-300 bg-blue-50 px-2.5 py-1 font-mono text-xs font-semibold text-blue-700">
            <span>UK</span><span>/{meaning.ipa.uk}/</span>
            {meaning.audio.uk && <AudioButton url={meaning.audio.uk} label="UK" />}
          </div>
        )}
        {meaning.ipa.us && (
          <div className="flex items-center gap-1.5 rounded-md border-2 border-amber-300 bg-amber-50 px-2.5 py-1 font-mono text-xs font-semibold text-amber-700">
            <span>US</span><span>/{meaning.ipa.us}/</span>
            {meaning.audio.us && <AudioButton url={meaning.audio.us} label="US" />}
          </div>
        )}
        {!meaning.ipa.uk && !meaning.ipa.us && <span className="text-xs text-zinc-400">Chưa có IPA</span>}
      </div>

      <p className="text-sm font-medium leading-relaxed text-zinc-900">{meaning.definition}</p>
      <p className="mt-1 text-sm italic leading-relaxed text-zinc-500">{meaning.vnDefinition}</p>
    </article>
  )
}

function WordColumn({ word, data, loading, error }: { word: string; data: WordData | null; loading: boolean; error: string | null }) {
  return (
    <section className="min-w-0">
      <div className="mb-4 rounded-2xl bg-zinc-900 p-5 text-white">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-400">Từ {word === data?.word ? '' : 'đang tìm'}</p>
        <h2 className="break-all text-3xl font-extrabold tracking-tight">{data?.word ?? word}</h2>
        {data && <p className="mt-2 text-sm text-zinc-400">{data.meanings.length} nghĩa</p>}
      </div>
      {loading && <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" /></div>}
      {!loading && error && <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-600">{error}</div>}
      {!loading && data && <MeaningList data={data} />}
    </section>
  )
}

export function CompareWordsPage({ wordA, wordB }: CompareWordsPageProps) {
  const navigate = useNavigate()
  const [first, setFirst] = useState(wordA)
  const [second, setSecond] = useState(wordB)
  const [results, setResults] = useState<[WordData | null, WordData | null]>([null, null])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<[string | null, string | null]>([null, null])
  const [loadedWords, setLoadedWords] = useState('')

  useEffect(() => {
    let active = true

    Promise.allSettled([fetchWordDetail(wordA), fetchWordDetail(wordB)]).then(values => {
      if (!active) return
      setResults(values.map(value => value.status === 'fulfilled' ? value.value : null) as [WordData | null, WordData | null])
      setErrors(values.map(value => value.status === 'rejected'
        ? (isApiError(value.reason) ? (value.reason.message ?? 'Không tìm thấy từ này') : 'Lỗi kết nối, vui lòng thử lại')
        : null) as [string | null, string | null])
      setLoadedWords(`${wordA}\0${wordB}`)
      setLoading(false)
    })

    return () => { active = false }
  }, [wordA, wordB])

  const requestLoading = loading || loadedWords !== `${wordA}\0${wordB}`

  function submit(event: FormEvent) {
    event.preventDefault()
    const nextFirst = first.trim()
    const nextSecond = second.trim()
    if (nextFirst && nextSecond) {
      navigate({ to: '/compare/$wordA/$wordB', params: { wordA: nextFirst, wordB: nextSecond } })
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50">
      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-10">
        <div className="mb-8 flex flex-col gap-5">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">Dictionary compare</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">So sánh hai từ</h1>
            <p className="mt-2 text-sm text-zinc-500">Đối chiếu trực tiếp IPA, audio và các lớp nghĩa từ dữ liệu tra từ.</p>
          </div>
          <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto_1fr_auto] sm:items-center">
            <input value={first} onChange={event => setFirst(event.target.value)} placeholder="Từ thứ nhất" className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500" />
            <ArrowLeftRight className="hidden text-emerald-500 sm:block" size={20} />
            <input value={second} onChange={event => setSecond(event.target.value)} placeholder="Từ thứ hai" className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500" />
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"><Search size={16} /> So sánh</button>
          </form>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <WordColumn word={wordA} data={results[0]} loading={requestLoading} error={errors[0]} />
          <WordColumn word={wordB} data={results[1]} loading={requestLoading} error={errors[1]} />
        </div>
      </div>
    </div>
  )
}
