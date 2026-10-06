import { FileText, Folder, Sparkles } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useDriveTree } from '../hooks/use-drive'
import type { DriveItem } from '../types/drive.types'
import { DriveTreeSidebar } from './drive-tree-sidebar'

function flattenMarkdownFiles(item: DriveItem): DriveItem[] {
  if (item.type === 'file') return item.mimeType === 'text/markdown' || item.name.endsWith('.md') ? [item] : []
  return (item.children ?? []).flatMap(flattenMarkdownFiles)
}

export function DrivePage() {
  const navigate = useNavigate()
  const { data: tree, isLoading } = useDriveTree()
  const files = useMemo(() => flattenMarkdownFiles(tree ?? { id: 'root', name: '', type: 'folder' }), [tree])

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white">
      <div className="border-b border-slate-200 bg-gradient-to-br from-slate-100 to-blue-50">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-5 py-7 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"><Folder size={22} className="text-amber-500" /></div>
            <div><p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">Your learning space</p><h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Drive Lessons</h1><p className="text-sm text-slate-500">Browse and study lessons from your shared Drive folder</p></div>
          </div>
          <Sparkles className="hidden text-emerald-400 sm:block" size={25} />
        </div>
      </div>
      <div className="mx-auto grid max-w-[1600px] gap-7 px-5 py-7 lg:grid-cols-[280px_1fr] lg:px-10">
        <DriveTreeSidebar />
        <section>
          <div className="mb-5 flex items-end justify-between"><div><p className="text-sm font-medium text-slate-500">Choose a lesson to begin</p><h2 className="mt-1 text-2xl font-extrabold text-slate-900">All lessons</h2></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{files.length} files</span></div>
          {files.length === 0 && !isLoading && <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">No Markdown lessons found.</p>}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{files.map(file => <button key={file.id} type="button" onClick={() => navigate({ to: '/drive/$fileId', params: { fileId: file.id } })} className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl"><div className="mb-8 flex items-start justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500 group-hover:bg-emerald-50 group-hover:text-emerald-600"><FileText size={20} /></span><span className="text-xs text-slate-400">Markdown</span></div><h3 className="truncate text-base font-bold text-slate-800">{file.name.replace(/\.md$/i, '')}</h3><p className="mt-2 text-xs text-slate-500">{file.modifiedTime ? `Updated ${new Date(file.modifiedTime).toLocaleDateString()}` : 'Drive lesson'}</p></button>)}</div>
        </section>
      </div>
    </div>
  )
}
