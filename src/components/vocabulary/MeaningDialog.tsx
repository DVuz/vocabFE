import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { AudioButton } from './AudioButton';
import { CEFR_CLASS, POS_CLASS } from './constants';
import type { UserWordRow } from './types';

interface MeaningDialogProps {
  row: UserWordRow | null;
  open: boolean;
  onClose: () => void;
}

export function MeaningDialog({ row, open, onClose }: MeaningDialogProps) {
  if (!row) return null;
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-zinc-900 tracking-tight flex items-center flex-wrap gap-2">
            {row.word}
            {row.partOfSpeech && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${POS_CLASS[row.partOfSpeech.toLowerCase()] ?? 'bg-zinc-100 text-zinc-500'}`}
              >
                {row.partOfSpeech}
              </span>
            )}
            {row.cefrLevel && (
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded border ${CEFR_CLASS[row.cefrLevel] ?? 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}
              >
                {row.cefrLevel}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {(row.ipa.uk || row.ipa.us) && (
          <div className="flex gap-3 flex-wrap mb-1">
            {row.ipa.uk && (
              <span className="flex items-center gap-1.5 text-[12px] font-mono text-blue-700 bg-blue-50 border border-blue-200 rounded px-2 py-0.5">
                UK /{row.ipa.uk}/{row.audio.uk && <AudioButton url={row.audio.uk} label="▶" />}
              </span>
            )}
            {row.ipa.us && (
              <span className="flex items-center gap-1.5 text-[12px] font-mono text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5">
                US /{row.ipa.us}/{row.audio.us && <AudioButton url={row.audio.us} label="▶" />}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col gap-1.5 mt-1">
          <p className="text-sm font-semibold text-zinc-900 leading-relaxed">{row.definition}</p>
          {row.vnDefinition && (
            <p className="text-sm text-zinc-500 italic leading-relaxed">{row.vnDefinition}</p>
          )}
        </div>

        {row.examples.length > 0 && (
          <ul className="mt-3 flex flex-col gap-1.5 border-t pt-3">
            {(row.examples as string[]).map((ex, i) => (
              <li
                key={i}
                className="text-xs text-zinc-500 italic pl-3 border-l-2 border-emerald-200"
              >
                "{ex}"
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
