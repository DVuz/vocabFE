import { Volume2 } from 'lucide-react'
import { useRef, useState } from 'react'

interface AudioButtonProps {
  url: string
  label: string
}

export function AudioButton({ url, label }: AudioButtonProps) {
  const ref = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  function play(event: React.MouseEvent) {
    event.stopPropagation()

    if (!ref.current) {
      ref.current = new Audio(url)
      ref.current.onended = () => setPlaying(false)
      ref.current.onerror = () => setPlaying(false)
    }

    ref.current.currentTime = 0
    void ref.current.play()
    setPlaying(true)
  }

  return (
    <button
      onClick={play}
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold transition-colors ${
        playing
          ? 'border-emerald-500 bg-emerald-500 text-white'
          : 'border-zinc-200 bg-zinc-50 text-zinc-400 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600'
      }`}
      title={`Nghe ${label}`}
      aria-label={`Nghe ${label}`}
    >
      <Volume2 size={10} />
      {label}
    </button>
  )
}
