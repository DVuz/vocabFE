import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { UserWordRow } from '../types/vocabulary.types'
import { CEFR_CLASS, POS_CLASS, STATUS_LABEL } from './constants'
import { statusClasses } from './utils'
import { AddToListPopover } from './AddToListPopover'
import { MeaningDialog } from './MeaningDialog'
import { AudioButton } from './AudioButton'

export function TableView({ rows, isFetching }: { rows: UserWordRow[]; isFetching: boolean }) {
  const [selectedRow, setSelectedRow] = useState<UserWordRow | null>(null)

  if (isFetching) {
    return (
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-zinc-50/80">
            <TableRow>
              <TableHead className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Word</TableHead>
              <TableHead className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Type</TableHead>
              <TableHead className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Pronunciation</TableHead>
              <TableHead className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Meaning</TableHead>
              <TableHead className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Example</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 5 }).map((__, j) => (
                  <TableCell key={j}>
                    <div className="h-4 animate-pulse rounded bg-zinc-100" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (!rows.length) {
    return <div className="py-12 text-center text-sm text-zinc-400">Chưa có từ nào được lưu.</div>
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-zinc-50/80">
          <TableRow>
            <TableHead className="w-44 text-xs font-semibold tracking-wide text-zinc-500 uppercase">Word</TableHead>
            <TableHead className="w-36 text-xs font-semibold tracking-wide text-zinc-500 uppercase">Type</TableHead>
            <TableHead className="w-60 text-xs font-semibold tracking-wide text-zinc-500 uppercase">Pronunciation</TableHead>
            <TableHead className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Meaning</TableHead>
            <TableHead className="w-72 text-xs font-semibold tracking-wide text-zinc-500 uppercase">Example</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.userWordId} className="align-top hover:bg-zinc-50/70">
              {/* Word */}
              <TableCell>
                <div className="space-y-1.5">
                  <p className="text-base font-bold tracking-tight text-zinc-900">{row.word}</p>
                </div>
              </TableCell>

              {/* Part of speech */}
              <TableCell>
                {row.partOfSpeech ? (
                  <span
                    className={`inline-flex rounded px-2 py-1 text-[11px] font-semibold ${POS_CLASS[row.partOfSpeech.toLowerCase()] ?? 'bg-zinc-100 text-zinc-500'}`}
                  >
                    {row.partOfSpeech}
                  </span>
                ) : (
                  <span className="text-xs text-zinc-400">—</span>
                )}
              </TableCell>

              {/* IPA + audio inline */}
              <TableCell className="py-4">
                <div className="flex flex-col gap-0.5">
                  {row.ipa.uk && (
                    <span className="flex items-center gap-1.5 text-[12px] font-mono text-blue-700">
                      /{row.ipa.uk}/
                      {row.audio.uk && <AudioButton url={row.audio.uk} label="UK" />}
                    </span>
                  )}
                  {row.ipa.us && (
                    <span className="flex items-center gap-1.5 text-[12px] font-mono text-amber-700">
                      /{row.ipa.us}/
                      {row.audio.us && <AudioButton url={row.audio.us} label="US" />}
                    </span>
                  )}
                  {!row.ipa.uk && !row.ipa.us && <span className="text-xs text-zinc-400">Không có phiên âm</span>}
                </div>
              </TableCell>

              {/* Meaning */}
              <TableCell>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline" className={`w-fit text-[10px] ${statusClasses(row.status)}`}>
                      {STATUS_LABEL[row.status ?? 'new'] ?? (row.status ?? 'new')}
                    </Badge>
                    {row.cefrLevel && (
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${CEFR_CLASS[row.cefrLevel] ?? 'bg-zinc-50 text-zinc-600 border-zinc-200'}`}
                      >
                        {row.cefrLevel}
                      </Badge>
                    )}
                    <AddToListPopover meaningId={row.meaningId} />
                  </div>
                  <button
                    className="w-full text-left"
                    onClick={() => setSelectedRow(row)}
                    aria-label={`Xem chi tiết ${row.word}`}
                  >
                    <p className="line-clamp-2 text-sm font-semibold leading-relaxed text-zinc-800 hover:text-zinc-950">
                      {row.definition}
                    </p>
                    {row.vnDefinition && (
                      <p className="line-clamp-1 text-xs italic text-zinc-500">{row.vnDefinition}</p>
                    )}
                  </button>
                </div>
              </TableCell>

              {/* Example */}
              <TableCell>
                {row.examples && row.examples.length > 0 ? (
                  <p className="line-clamp-2 border-l-2 border-emerald-200 pl-2.5 text-xs italic leading-relaxed text-zinc-500">
                    "{row.examples[0]}"
                  </p>
                ) : (
                  <span className="text-xs text-zinc-300">Không có ví dụ</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <MeaningDialog row={selectedRow} open={Boolean(selectedRow)} onClose={() => setSelectedRow(null)} />
    </div>
  )
}
