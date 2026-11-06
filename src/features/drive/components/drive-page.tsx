import {
  ArrowUpRight,
  Calendar,
  FileText,
  Folder,
  FolderTree,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useDriveTree } from "../hooks/use-drive";
import { DriveTreeSidebar } from "./drive-tree-sidebar";
import {
  flattenMarkdownFilesWithPath,
  formatLessonName,
} from "./drive.utils";

export function DrivePage() {
  const navigate = useNavigate();
  const { data: tree, isLoading } = useDriveTree();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileTreeOpen, setMobileTreeOpen] = useState(false);

  const filesWithPaths = useMemo(
    () => flattenMarkdownFilesWithPath(tree),
    [tree],
  );

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const entry of filesWithPaths) {
      const topFolder = entry.folderPath[0] ?? "Khác";
      counts.set(topFolder, (counts.get(topFolder) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [filesWithPaths]);

  const filteredFiles = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    return filesWithPaths.filter(({ item, folderPath }) => {
      const topFolder = folderPath[0] ?? "Khác";
      if (selectedCategory !== "ALL" && topFolder !== selectedCategory) {
        return false;
      }
      if (!needle) return true;
      const cleanName = formatLessonName(item.name).toLowerCase();
      const pathStr = folderPath.join(" ").toLowerCase();
      return (
        cleanName.includes(needle) ||
        item.name.toLowerCase().includes(needle) ||
        pathStr.includes(needle)
      );
    });
  }, [filesWithPaths, selectedCategory, searchQuery]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/50">
      {/* Hero Banner */}
      <div className="border-b border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-emerald-50/50">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-5 sm:px-6 sm:py-7 lg:px-10">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-xs ring-1 ring-slate-200/80 sm:h-12 sm:w-12">
              <Folder size={22} className="text-amber-500" />
            </div>
            <div className="min-w-0">
              <p className="mb-0.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-600 sm:text-xs">
                Không gian học tập
              </p>
              <h1 className="truncate text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                Bài học Google Drive
              </h1>
              <p className="line-clamp-1 text-xs text-slate-500 sm:text-sm">
                Tổng hợp bài học Speaking, Writing và Từ vựng đồng bộ trực tiếp từ Drive
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileTreeOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-emerald-300 hover:text-emerald-700 lg:hidden"
            >
              <FolderTree size={15} className="text-amber-500" />
              <span>Cây thư mục</span>
            </button>
            <Sparkles className="hidden text-emerald-400 sm:block" size={24} />
          </div>
        </div>
      </div>

      {/* Mobile Drawer for Folder Tree */}
      {mobileTreeOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          onClick={() => setMobileTreeOpen(false)}
        >
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <div
            className="relative z-10 flex h-full w-[86vw] max-w-[340px] flex-col bg-slate-50 p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between px-1 py-1">
              <span className="text-sm font-bold text-slate-800">
                Duyệt theo thư mục
              </span>
              <button
                type="button"
                onClick={() => setMobileTreeOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/70"
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <DriveTreeSidebar
                onSelect={() => setMobileTreeOpen(false)}
                className="[&>div]:max-h-[calc(100vh-4.5rem)] [&>div]:border-0 [&>div]:shadow-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-5 sm:px-6 sm:py-7 lg:grid-cols-[280px_1fr] lg:gap-8 lg:px-10">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <DriveTreeSidebar />
        </div>

        <section className="min-w-0">
          {/* Toolbar: Search + Category Filter Chips */}
          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                  Tất cả bài học
                </h2>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Chọn một bài học bên dưới để bắt đầu luyện tập
                </p>
              </div>

              <div className="relative w-full sm:w-64 md:w-72">
                <Search
                  size={15}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm bài học..."
                  className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/70 pr-8 pl-9 text-sm text-slate-800 transition-colors outline-none placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/15"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-0.5 text-slate-400 hover:text-slate-600"
                    aria-label="Xóa tìm kiếm"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {categories.length > 0 && (
              <div className="-mx-1 flex items-center gap-1.5 overflow-x-auto px-1 pt-1 pb-0.5 no-scrollbar">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("ALL")}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedCategory === "ALL"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                  }`}
                >
                  <span>Tất cả</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      selectedCategory === "ALL"
                        ? "bg-emerald-700 text-emerald-50"
                        : "bg-white text-slate-600"
                    }`}
                  >
                    {filesWithPaths.length}
                  </span>
                </button>
                {categories.map((cat) => {
                  const active = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                        active
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                      }`}
                    >
                      <Folder
                        size={12}
                        className={active ? "text-amber-300" : "text-amber-500"}
                      />
                      <span>{cat.name}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                          active
                            ? "bg-emerald-700 text-emerald-50"
                            : "bg-white text-slate-600"
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-36 animate-pulse rounded-2xl border border-slate-200/70 bg-white p-4 sm:p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="h-9 w-9 rounded-xl bg-slate-100" />
                    <div className="h-5 w-20 rounded-full bg-slate-100" />
                  </div>
                  <div className="h-4 w-3/4 rounded bg-slate-100" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredFiles.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <FileText size={32} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">
                Không tìm thấy bài học nào phù hợp.
              </p>
              {(searchQuery || selectedCategory !== "ALL") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("ALL");
                  }}
                  className="mt-3 inline-flex items-center rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          )}

          {/* Lesson Cards Grid */}
          {!isLoading && filteredFiles.length > 0 && (
            <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
              {filteredFiles.map(({ item: file, folderPath }) => {
                const displayName = formatLessonName(file.name);
                const folderBadge =
                  folderPath.length > 0 ? folderPath.join(" / ") : "Bài học";

                return (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() =>
                      navigate({
                        to: "/drive/$fileId",
                        params: { fileId: file.id },
                      })
                    }
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 text-left shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md sm:p-5"
                  >
                    <div>
                      <div className="mb-3.5 flex items-center justify-between gap-2">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white sm:h-10 sm:w-10">
                          <FileText size={18} />
                        </span>
                        <span className="truncate rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700">
                          {folderBadge}
                        </span>
                      </div>

                      <h3
                        title={displayName}
                        className="line-clamp-2 text-[15px] font-bold leading-snug text-slate-800 group-hover:text-emerald-700 sm:text-base"
                      >
                        {displayName}
                      </h3>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={12} />
                        {file.modifiedTime
                          ? new Date(file.modifiedTime).toLocaleDateString(
                              "vi-VN",
                            )
                          : "Bài học Drive"}
                      </span>
                      <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-600 opacity-80 transition group-hover:translate-x-0.5 group-hover:opacity-100">
                        Học ngay
                        <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
