import {
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  LoaderCircle,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useDriveTree } from "../hooks/use-drive";
import type { DriveItem } from "../types/drive.types";
import {
  countMarkdownFiles,
  formatLessonName,
  isMarkdownFile,
  pruneTree,
} from "./drive.utils";

function TreeItem({
  item,
  selectedId,
  depth = 0,
  onSelect,
}: {
  item: DriveItem;
  selectedId?: string;
  depth?: number;
  onSelect?: () => void;
}) {
  const [open, setOpen] = useState(true);

  if (item.type === "folder") {
    if (depth === 0 && item.children) {
      return (
        <div className="space-y-1">
          {item.children.map((child) => (
            <TreeItem
              key={child.id}
              item={child}
              selectedId={selectedId}
              depth={depth + 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      );
    }

    const fileCount = countMarkdownFiles(item);

    return (
      <div className="select-none">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="group flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100/80"
        >
          <ChevronRight
            size={14}
            className={`shrink-0 text-slate-400 transition-transform duration-200 ${
              open ? "rotate-90" : ""
            }`}
          />
          {open ? (
            <FolderOpen size={16} className="shrink-0 text-amber-500" />
          ) : (
            <Folder size={16} className="shrink-0 text-amber-500" />
          )}
          <span className="min-w-0 flex-1 truncate">{item.name}</span>
          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500 group-hover:bg-white">
            {fileCount}
          </span>
        </button>
        {open && (
          <div className="mt-0.5 ml-3.5 space-y-0.5 border-l border-slate-200/80 pl-2.5">
            {(item.children ?? []).map((child) => (
              <TreeItem
                key={child.id}
                item={child}
                selectedId={selectedId}
                depth={depth + 1}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!isMarkdownFile(item)) return null;

  const isSelected = selectedId === item.id;
  const displayName = formatLessonName(item.name);

  return (
    <Link
      to="/drive/$fileId"
      params={{ fileId: item.id }}
      onClick={onSelect}
      title={displayName}
      className={`group flex items-start gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-all ${
        isSelected
          ? "bg-emerald-50 font-semibold text-emerald-700 shadow-2xs ring-1 ring-emerald-200/60"
          : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
      }`}
    >
      <FileText
        size={15}
        className={`mt-0.5 shrink-0 transition-colors ${
          isSelected
            ? "text-emerald-600"
            : "text-slate-400 group-hover:text-emerald-500"
        }`}
      />
      <span className="line-clamp-2 leading-snug break-words">
        {displayName}
      </span>
    </Link>
  );
}

export function DriveTreeSidebar({
  selectedId,
  onSelect,
  className = "",
}: {
  selectedId?: string;
  onSelect?: () => void;
  className?: string;
}) {
  const { data: tree, isLoading, isError, error } = useDriveTree();
  const [search, setSearch] = useState("");

  const prunedTree = useMemo(
    () => (tree ? pruneTree(tree, search) : null),
    [tree, search],
  );

  return (
    <aside className={`h-fit lg:sticky lg:top-20 ${className}`}>
      <div className="flex max-h-[calc(100vh-6.5rem)] flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs lg:min-h-[460px]">
        <div className="mb-3 border-b border-slate-100 pb-3">
          <div className="mb-2.5 flex items-center justify-between px-1">
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-slate-500 uppercase">
              <Folder size={14} className="text-amber-500" /> Danh mục bài học
            </p>
            {tree && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                {countMarkdownFiles(tree)} bài
              </span>
            )}
          </div>
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm tên bài học..."
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/80 pr-8 pl-9 text-sm text-slate-800 transition-colors outline-none placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/15"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Xóa tìm kiếm"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-0.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-8 text-sm text-slate-500">
              <LoaderCircle
                size={16}
                className="animate-spin text-emerald-600"
              />
              Đang tải danh sách...
            </div>
          )}
          {isError && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {(error as Error)?.message ?? "Không thể tải danh sách bài học."}
            </p>
          )}
          {!isLoading && !isError && !prunedTree && (
            <div className="py-8 text-center text-sm text-slate-400">
              Không tìm thấy bài học phù hợp.
            </div>
          )}
          {prunedTree && (
            <TreeItem
              item={prunedTree}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          )}
        </div>
      </div>
    </aside>
  );
}
