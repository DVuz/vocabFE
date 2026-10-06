import {
  FileText,
  Folder,
  FolderOpen,
  LoaderCircle,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useDriveTree } from "../hooks/use-drive";
import type { DriveItem } from "../types/drive.types";

function TreeItem({
  item,
  selectedId,
}: {
  item: DriveItem;
  selectedId?: string;
}) {
  const [open, setOpen] = useState(true);

  if (item.type === "folder") {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          {open ? (
            <FolderOpen size={16} className="text-amber-500" />
          ) : (
            <Folder size={16} className="text-amber-500" />
          )}
          <span className="truncate">{item.name}</span>
        </button>
        {open && (
          <div className="ml-4 border-l border-slate-200 pl-2">
            {(item.children ?? []).map((child) => (
              <TreeItem key={child.id} item={child} selectedId={selectedId} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!(item.mimeType === "text/markdown" || item.name.endsWith(".md")))
    return null;
  return (
    <Link
      to="/drive/$fileId"
      params={{ fileId: item.id }}
      className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm ${selectedId === item.id ? "bg-emerald-50 font-semibold text-emerald-700" : "text-slate-600 hover:bg-slate-50"}`}
    >
      <FileText size={15} className="shrink-0 text-rose-400" />
      <span className="truncate">{item.name}</span>
    </Link>
  );
}

export function DriveTreeSidebar({ selectedId }: { selectedId?: string }) {
  const { data: tree, isLoading, isError, error } = useDriveTree();
  const [search, setSearch] = useState("");

  return (
    <aside className="h-fit lg:sticky lg:top-24">
      <div className="flex max-h-[calc(100vh-7rem)] min-h-[220px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_12px_35px_rgba(15,23,42,0.07)] lg:min-h-[420px]">
        <div className="mb-3 border-b border-slate-100 pb-3">
          <p className="mb-2 flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            <Folder size={14} className="text-amber-500" /> Drive files
          </p>
          <div className="relative">
            <Search
              size={15}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search files..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm outline-none focus:border-emerald-400"
            />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {isLoading && (
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
              <LoaderCircle size={15} className="animate-spin" />
              Loading files...
            </div>
          )}
          {isError && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {(error as Error)?.message ?? "Unable to load Drive files."}
            </p>
          )}
          {tree && (
            <TreeItem
              item={search.trim() ? filterTree(tree, search) : tree}
              selectedId={selectedId}
            />
          )}
        </div>
      </div>
    </aside>
  );
}

function filterTree(item: DriveItem, query: string): DriveItem {
  const needle = query.toLowerCase().trim();
  if (item.type === "file") return item;
  return {
    ...item,
    children: (item.children ?? [])
      .filter(
        (child) =>
          child.type === "folder" || child.name.toLowerCase().includes(needle),
      )
      .map((child) =>
        child.type === "folder" ? filterTree(child, query) : child,
      ),
  };
}
