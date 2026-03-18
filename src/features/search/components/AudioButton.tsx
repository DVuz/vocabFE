import { Volume2 } from 'lucide-react'
import { useRef, useState } from 'react'

interface AudioButtonProps {
  url: string
  label: string
}

export function AudioButton({ url, label }: AudioButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  function play(event: React.MouseEvent) {
    event.stopPropagation()
    if (!audioRef.current) {
      audioRef.current = new Audio(url)
      audioRef.current.onended = () => setPlaying(false)
    }
    audioRef.current.currentTime = 0
    void audioRef.current.play()
    setPlaying(true)
  }

  return (
    <button
      onClick={play}
      title={`Nghe phát âm ${label}`}
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium transition-all
        ${playing
          ? 'bg-emerald-500 border-emerald-500 text-white'
          : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600'
        }`}
    >
      <Volume2 size={11} />
      {label}
    </button>
  )
}