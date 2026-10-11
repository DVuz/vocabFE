import { Link } from '@tanstack/react-router'
import { ArrowLeft, BookOpen, FolderOpen, Loader2, List } from 'lucide-react'
import { ROUTES } from '../../../shared/constants/routes'
import { useWordLists } from '../hooks/use-word-lists'

export function WordListPage() {
  const query = useWordLists()

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50">
      <header className="border-b border-slate-200 bg-linear-to-br from-slate-100 to-blue-50">
        <div className="mx-auto max-w-400 px-4 py-6 sm:px-6 lg:px-10">
          <Link to={ROUTES.VOCABULARY} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
            <ArrowLeft size={16} /> Vocabulary
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
              <FolderOpen size={22} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">Word lists của tôi</h1>
              <p className="text-sm text-slate-500">Chọn một nhóm để xem các từ đã lưu</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-400 px-4 py-7 sm:px-6 lg:px-10">
        {query.isLoading && <LoadingState />}
        {query.isError && <ErrorState message={(query.error as Error).message} />}
        {!query.isLoading && !query.isError && query.data?.length === 0 && (
          <EmptyState />
        )}
        {!query.isLoading && !query.isError && query.data && query.data.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {query.data.map(list => (
              <Link
                key={list.id}
                to={ROUTES.WORD_LIST_DETAIL}
                params={{ wordListId: String(list.id) }}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
              >
                <div className="mb-7 flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <List size={20} />
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                    {list.wordCount} từ
                  </span>
                </div>
                <h2 className="truncate text-lg font-bold text-slate-800 group-hover:text-blue-700">{list.name}</h2>
                <p className="mt-2 min-h-5 truncate text-sm text-slate-500">{list.description || 'Chưa có mô tả'}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function LoadingState() {
  return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>
}

function ErrorState({ message }: { message: string }) {
  return <p className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-600">{message || 'Không tải được word list'}</p>
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <BookOpen className="mx-auto mb-3 text-slate-300" size={32} />
      <p className="font-semibold text-slate-700">Bạn chưa có word list nào</p>
      <p className="mt-1 text-sm text-slate-500">Hãy thêm từ vào word list ngay trong Vocabulary.</p>
    </div>
  )
}
