import { Volume2 } from 'lucide-react';
import { useRef, useState } from 'react';

interface AudioButtonProps {
  url: string;
  label: string;
}

export function AudioButton({ url, label }: AudioButtonProps) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  function play(e: React.MouseEvent) {
    e.stopPropagation();
    if (!ref.current) {
      ref.current = new Audio(url);
      ref.current.onended = () => setPlaying(false);
    }
    ref.current.currentTime = 0;
    ref.current.play();
    setPlaying(true);
  }

  return (
    <button
      onClick={play}
      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border text-[10px] font-semibold transition-all
        ${playing ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-200 bg-zinc-50 text-zinc-400 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600'}`}
    >
      <Volume2 size={10} />
      {label}
    </button>
  );
}
