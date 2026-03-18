import { BookPlus, Check, Loader2, Plus, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiGet, apiPost, type ApiError, type ApiResponse } from '../../../shared/api'

interface WordListItem {
  id: number
  name: string
  description?: string | null
  wordCount?: number
}

interface AddToListPopoverProps {
  meaningId: number
}

export function AddToListPopover({ meaningId }: AddToListPopoverProps) {
  const [open, setOpen] = useState(false)
  const [lists, setLists] = useState<WordListItem[]>([])
  const [loadingLists, setLoadingLists] = useState(false)
  const [addingTo, setAddingTo] = useState<number | null>(null)
  const [added, setAdded] = useState<number | null>(null)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const anchorRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  const panelStyle = useMemo(() => {
    const anchor = anchorRef.current
    if (!anchor || !open) {
      return { top: -9999, left: -9999 }
    }

    const rect = anchor.getBoundingClientRect()
    const width = 280
    const margin = 8
    const top = Math.min(window.innerHeight - 16, rect.bottom + margin)
    const preferredLeft = rect.right - width
    const left = Math.max(8, Math.min(preferredLeft, window.innerWidth - width - 8))

    return { top, left }
  }, [open])

  async function loadLists() {
    setLoadingLists(true)
    setErrorMessage('')

    try {
      const response = await apiGet<ApiResponse<WordListItem[]>>('/my/word-lists')
      setLists(response.data ?? [])
    } catch (error) {
      const apiError = error as ApiError
      setErrorMessage(apiError.message || 'Không tải được danh sách')
    } finally {
      setLoadingLists(false)
    }
  }

  useEffect(() => {
    if (!open) {
      return
    }

    void loadLists()
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    function onMouseDown(event: MouseEvent) {
      const target = event.target as Node
      const panel = panelRef.current
      const anchor = anchorRef.current

      if (panel?.contains(target) || anchor?.contains(target)) {
        return
      }

      setOpen(false)
    }

    function onEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    function onViewportChange() {
      setOpen(prev => prev)
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onEscape)
    window.addEventListener('scroll', onViewportChange, true)
    window.addEventListener('resize', onViewportChange)

    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onEscape)
      window.removeEventListener('scroll', onViewportChange, true)
      window.removeEventListener('resize', onViewportChange)
    }
  }, [open])

  async function addToList(listId: number) {
    setAddingTo(listId)
    setErrorMessage('')

    try {
      await apiPost<ApiResponse<unknown>, { listId: number; wordMeaningId: number }>('/my/word-list-iterms', {
        listId,
        wordMeaningId: meaningId,
      })

      setAdded(listId)
      setTimeout(() => {
        setOpen(false)
        setAdded(null)
      }, 700)
    } catch (error) {
      const apiError = error as ApiError
      if (apiError.status === 409) {
        setErrorMessage('Từ này đã có trong list')
      } else {
        setErrorMessage(apiError.message || 'Thêm vào list thất bại')
      }
    } finally {
      setAddingTo(null)
    }
  }

  async function createAndAdd() {
    const name = newName.trim()
    if (!name) {
      return
    }

    setSaving(true)
    setErrorMessage('')

    try {
      const response = await apiPost<ApiResponse<{ id: number }>, { name: string }>('/my/word-lists', {
        name,
      })

      const newListId = response.data?.id
      if (!newListId) {
        setErrorMessage('Không tạo được word list')
        return
      }

      setNewName('')
      setCreating(false)
      await loadLists()
      await addToList(newListId)
    } catch (error) {
      const apiError = error as ApiError
      setErrorMessage(apiError.message || 'Tạo word list thất bại')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Button
        ref={anchorRef}
        variant="ghost"
        size="sm"
        className="h-7 w-7 px-0 text-zinc-500 hover:bg-emerald-50 hover:text-emerald-700"
        onClick={event => {
          event.stopPropagation()
          setOpen(prev => !prev)
        }}
        title="Thêm vào word list"
        aria-label="Thêm vào word list"
      >
        <BookPlus size={13} />
      </Button>

      {open && (
        <div
          ref={panelRef}
          className="fixed z-50 w-70 rounded-xl border border-zinc-200 bg-white shadow-xl"
          style={{ top: panelStyle.top, left: panelStyle.left }}
          onClick={event => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-zinc-100 px-3 py-2.5">
            <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Thêm vào word list</p>
            <button
              className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
              onClick={() => setOpen(false)}
              aria-label="Đóng"
            >
              <X size={14} />
            </button>
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {loadingLists && (
              <div className="flex items-center justify-center py-6">
                <Loader2 size={16} className="animate-spin text-zinc-400" />
              </div>
            )}

            {!loadingLists && lists.length === 0 && (
              <p className="px-3 py-4 text-center text-xs text-zinc-400">Bạn chưa có word list nào</p>
            )}

            {!loadingLists &&
              lists.map(list => (
                <button
                  key={list.id}
                  onClick={() => addToList(list.id)}
                  disabled={addingTo === list.id || added === list.id}
                  className="flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-zinc-50 disabled:opacity-60"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-800">{list.name}</p>
                    <p className="text-xs text-zinc-400">{list.wordCount ?? 0} từ</p>
                  </div>

                  {added === list.id ? (
                    <Check size={14} className="text-emerald-500" />
                  ) : addingTo === list.id ? (
                    <Loader2 size={13} className="animate-spin text-zinc-400" />
                  ) : (
                    <Plus size={14} className="text-zinc-400" />
                  )}
                </button>
              ))}
          </div>

          <div className="border-t border-zinc-100 p-2">
            {!creating ? (
              <button
                onClick={() => setCreating(true)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
              >
                <Plus size={14} />
                Tạo word list mới
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <Input
                  autoFocus
                  value={newName}
                  onChange={event => setNewName(event.target.value)}
                  onKeyDown={event => event.key === 'Enter' && void createAndAdd()}
                  placeholder="Tên word list..."
                  className="h-8 text-xs"
                />
                <Button
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => void createAndAdd()}
                  disabled={!newName.trim() || saving}
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : 'Lưu'}
                </Button>
              </div>
            )}

            {errorMessage && <p className="mt-2 text-xs text-red-500">{errorMessage}</p>}
          </div>
        </div>
      )}
    </>
  )
}
