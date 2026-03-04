import { AddToListPopover } from './AddToListPopover';
import { AudioButton } from './AudioButton';
import { CEFR_CLASS, POS_CLASS, STATUS_CLASS, STATUS_LABEL } from './constants';
import type { UserWordRow } from './types';

interface WordCardProps {
  row: UserWordRow;
  token: string;
  onOpen: () => void;
}

export function WordCard({ row, token, onOpen }: WordCardProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl font-bold text-zinc-900 tracking-tight">{row.word}</span>
            {row.partOfSpeech && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${POS_CLASS[row.partOfSpeech.toLowerCase()] ?? 'bg-zinc-100 text-zinc-500'}`}
              >
                {row.partOfSpeech}
              </span>
            )}
            {row.cefrLevel && (
              <span
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded border ${CEFR_CLASS[row.cefrLevel] ?? 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}
              >
                {row.cefrLevel}
              </span>
            )}
          </div>
          {(row.ipa.uk || row.ipa.us) && (
            <div className="flex gap-2 flex-wrap mt-1.5">
              {row.ipa.uk && (
                <span className="inline-flex items-center gap-1.5 text-[12px] font-mono text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-2 py-0.5">
                  <span className="text-[10px] text-blue-400 font-sans font-semibold">UK</span>/
                  {row.ipa.uk}/{row.audio.uk && <AudioButton url={row.audio.uk} label="►" />}
                </span>
              )}
              {row.ipa.us && (
                <span className="inline-flex items-center gap-1.5 text-[12px] font-mono text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2 py-0.5">
                  <span className="text-[10px] text-amber-400 font-sans font-semibold">US</span>/
                  {row.ipa.us}/{row.audio.us && <AudioButton url={row.audio.us} label="►" />}
                </span>
              )}
            </div>
          )}
        </div>
        <span
          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 mt-0.5 ${STATUS_CLASS[row.status ?? 'new'] ?? STATUS_CLASS.new}`}
        >
          {STATUS_LABEL[row.status ?? 'new'] ?? row.status}
        </span>
      </div>

      <button
        className="w-full text-left px-4 py-3 bg-zinc-50 border-t border-zinc-100 active:bg-zinc-100 transition-colors"
        onClick={onOpen}
      >
        <p className="text-sm font-medium text-zinc-800 line-clamp-2 leading-relaxed">
          {row.definition}
        </p>
        {row.vnDefinition && (
          <p className="text-sm text-zinc-400 italic line-clamp-1 mt-0.5">{row.vnDefinition}</p>
        )}
        <span className="text-xs text-emerald-600 font-semibold mt-1.5 inline-block">
          Xem đầy đủ →
        </span>
      </button>

      <div className="px-4 py-2.5 flex items-center justify-between border-t border-zinc-100">
        <span
          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${STATUS_CLASS[row.status ?? 'new'] ?? STATUS_CLASS.new}`}
        >
          {STATUS_LABEL[row.status ?? 'new'] ?? row.status}
        </span>
        <div className="group">
          <AddToListPopover meaningId={row.meaningId} token={token} />
        </div>
      </div>
    </div>
  );
}
