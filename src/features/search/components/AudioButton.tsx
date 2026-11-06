import { Volume2 } from 'lucide-react'
import { useRef, useState } from 'react'

interface AudioButtonProps {
  url: string
  label: string
  ipa?: string | null
  tone?: 'uk' | 'us'
}

export function AudioButton({ url, label, ipa, tone = 'uk' }: AudioButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  function play(event: React.MouseEvent) {
    event.stopPropagation()
    if (!audioRef.current) {
      audioRef.current = new Audio(url)
      audioRef.current.onended = () => setPlaying(false)
      audioRef.current.onerror = () => setPlaying(false)
    }
    audioRef.current.currentTime = 0
    void audioRef.current
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
  }

  const toneClass =
    tone === 'uk'
      ? playing
        ? 'border-blue-500 bg-blue-600 text-white'
        : 'border-blue-200 bg-blue-50/80 text-blue-700 hover:bg-blue-100'
      : playing
        ? 'border-amber-500 bg-amber-500 text-white'
        : 'border-amber-200 bg-amber-50/80 text-amber-700 hover:bg-amber-100'

  return (
    <button
      type="button"
      onClick={play}
      title={`Nghe phát âm ${label}`}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-xs font-semibold transition-all ${toneClass}`}
    >
      <span className="font-sans text-[10px] font-extrabold uppercase opacity-80">
        {label}
      </span>
      {ipa && <span>/{ipa}/</span>}
      <Volume2 size={13} className="shrink-0" />
    </button>
  )
}
