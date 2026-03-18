interface InlineLoaderProps {
  text?: string
  className?: string
}

export function InlineLoader({
  text = 'Đang tải...',
  className = 'text-xs font-medium text-zinc-500',
}: InlineLoaderProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
      {text}
    </span>
  )
}
