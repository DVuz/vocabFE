import { BookPlus, Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import type { WordList } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

interface AddToListPopoverProps {
  meaningId: number;
  token: string;
}

export function AddToListPopover({ meaningId, token }: AddToListPopoverProps) {
  const [open, setOpen] = useState(false);
  const [lists, setLists] = useState<WordList[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [addingTo, setAddingTo] = useState<number | null>(null);
  const [added, setAdded] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch(`${API_BASE}/my/word-lists`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(json => {
        if (json.success) setLists(json.data);
      })
      .finally(() => setLoadingLists(false));
    setLoadingLists(true);
  }, [open, token]);

  async function addToList(listId: number) {
    setAddingTo(listId);
    try {
      const r = await fetch(`${API_BASE}/my/word-lists/${listId}/items`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ wordMeaningId: meaningId }),
      });
      if (r.ok) {
        setAdded(listId);
        setTimeout(() => setOpen(false), 800);
      }
    } finally {
      setAddingTo(null);
    }
  }

  async function createAndAdd() {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const r = await fetch(`${API_BASE}/my/word-lists`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const json = await r.json();
      if (json.success && json.data?.id) {
        await addToList(json.data.id);
        setNewName('');
        setCreating(false);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs gap-1.5 text-zinc-400 hover:text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={e => e.stopPropagation()}
        >
          <BookPlus size={12} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end" onClick={e => e.stopPropagation()}>
        <div className="px-3 py-2.5 border-b border-zinc-100">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Word Lists</p>
        </div>
        <div className="max-h-52 overflow-y-auto py-1">
          {loadingLists && (
            <div className="flex items-center justify-center py-6">
              <Loader2 size={16} className="animate-spin text-zinc-400" />
            </div>
          )}
          {!loadingLists && lists.length === 0 && (
            <p className="text-xs text-zinc-400 text-center py-4">Chưa có wordlist nào</p>
          )}
          {!loadingLists &&
            lists.map(list => (
              <button
                key={list.id}
                onClick={() => addToList(list.id)}
                disabled={addingTo === list.id || added === list.id}
                className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-zinc-50 transition-colors disabled:opacity-60"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-800">{list.name}</p>
                  <p className="text-xs text-zinc-400">{list.totalItems} từ</p>
                </div>
                {added === list.id ? (
                  <span className="text-[10px] font-bold text-emerald-500">✓ Đã thêm</span>
                ) : addingTo === list.id ? (
                  <Loader2 size={12} className="animate-spin text-zinc-400" />
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
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-emerald-700 font-medium hover:bg-emerald-50 transition-colors"
            >
              <Plus size={14} />
              Tạo wordlist mới
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <Input
                autoFocus
                placeholder="Tên wordlist…"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createAndAdd()}
                className="h-7 text-xs flex-1"
              />
              <Button
                size="sm"
                className="h-7 px-2 text-xs"
                disabled={!newName.trim() || saving}
                onClick={createAndAdd}
              >
                {saving ? <Loader2 size={12} className="animate-spin" /> : 'Lưu'}
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
