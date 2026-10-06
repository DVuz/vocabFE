import {
  ChevronDown,
  ChevronUp,
  Grid2X2,
  LoaderCircle,
  List,
  Volume2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "../../../components/ui/button";
import { getAccessToken } from "../../../shared/api";
import { ROUTES } from "../../../shared/constants/routes";
import { useDriveContent } from "../hooks/use-drive";
import type { DriveAudioFile } from "../types/drive.types";
import { DriveTreeSidebar } from "./drive-tree-sidebar";

interface Section {
  question: string;
  answer: string;
}

type TableViewMode = "grid" | "row";

function MarkdownContent({
  content,
  tableViewMode,
}: {
  content: string;
  tableViewMode: TableViewMode;
}) {
  const isGrid = tableViewMode === "grid";

  return (
    <div className="markdown-content overflow-x-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-1 pl-6">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-1 pl-6">{children}</ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-4 border-emerald-300 bg-emerald-50/60 px-4 py-3 italic text-slate-600">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <table
              className={
                isGrid
                  ? "my-3 grid grid-cols-1 gap-2 border-0 text-left text-sm md:grid-cols-2"
                  : "my-3 min-w-full border-separate border-spacing-0 overflow-hidden rounded-xl border border-slate-200 text-left text-sm"
              }
            >
              {children}
            </table>
          ),
          thead: ({ children }) => (
            <thead className={isGrid ? "hidden" : "bg-emerald-50 text-emerald-900"}>
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th
              className={
                isGrid
                  ? "hidden"
                  : "border-b border-slate-200 px-3 py-2 text-xs font-bold uppercase tracking-wide"
              }
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              className={
                isGrid
                  ? "min-w-0 px-3 py-2 align-top first:pb-1 first:text-base first:font-bold first:text-slate-900 last:border-l-2 last:border-emerald-300 last:pt-0 last:text-sm last:italic last:leading-relaxed last:text-slate-500"
                  : "border-b border-slate-100 px-3 py-2 align-top last:border-b-0"
              }
            >
              {children}
            </td>
          ),
          tbody: ({ children }) => (
            <tbody className={isGrid ? "contents" : ""}>{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr
              className={
                isGrid
                  ? "relative grid min-h-[94px] grid-cols-1 content-start rounded-xl border border-slate-200 bg-white px-1 py-2 shadow-sm transition hover:border-emerald-300 hover:shadow-md [&>td:last-child]:mx-1 [&>td:last-child]:mb-1 [&>td:last-child]:pl-2 [&>td:first-child]:pr-2 [&>td:first-child]:pt-1"
                  : "even:bg-slate-50/70"
              }
            >
              {children}
            </tr>
          ),
          code: ({ children }) => (
            <code className="rounded-md bg-slate-200/80 px-1.5 py-0.5 text-[0.9em] text-rose-700">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="my-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm leading-6 text-slate-100">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function parseSections(markdown: string): Section[] {
  const lines = markdown.split(/\r?\n/);
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const line of lines) {
    const heading = line.match(/^###\s+(.+)$/);
    if (heading) {
      if (current) sections.push({ ...current, answer: current.answer.trim() });
      current = { question: heading[1].trim(), answer: "" };
    } else if (current && !line.match(/^!\[\[.*\]\]$/)) {
      current.answer += `${line}\n`;
    }
  }

  if (current) sections.push({ ...current, answer: current.answer.trim() });
  return sections;
}

function AudioPlayer({ audio }: { audio: DriveAudioFile }) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    const controller = new AbortController();
    let objectUrl: string | null = null;

    async function loadAudio() {
      try {
        setStatus("loading");
        const baseUrl =
          import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";
        const url = audio.streamUrl.startsWith("http")
          ? audio.streamUrl
          : `${baseUrl}${audio.streamUrl}`;
        const token = getAccessToken();
        const response = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Audio request failed: ${response.status}`);
        }

        const contentType = response.headers.get("content-type") ?? "";
        if (
          contentType.includes("application/json") ||
          contentType.includes("text/")
        ) {
          throw new Error("Stream endpoint returned an error response.");
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(
          blob.type.startsWith("audio/")
            ? blob
            : new Blob([blob], { type: audio.mimeType || "audio/wav" }),
        );
        setAudioUrl(objectUrl);
        setStatus("ready");
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Unable to load Drive audio", error);
          setStatus("error");
        }
      }
    }

    void loadAudio();
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [audio.id, audio.mimeType, audio.streamUrl]);

  return (
    <div className="min-w-0">
      {status === "loading" && (
        <span className="text-xs text-slate-400">Đang tải audio...</span>
      )}
      {status === "error" && (
        <span className="text-xs text-red-500">Không thể tải audio</span>
      )}
      {status === "ready" && audioUrl && (
        <audio
          className="h-9 w-full"
          controls
          preload="metadata"
          src={audioUrl}
        >
          Your browser does not support audio playback.
        </audio>
      )}
    </div>
  );
}

export function DriveLessonPage({ fileId }: { fileId: string }) {
  const { data, isLoading, isError, error } = useDriveContent(fileId);
  const [openIndex, setOpenIndex] = useState(0);
  const [tableViewMode, setTableViewMode] = useState<TableViewMode>("grid");
  const sections = useMemo(
    () => parseSections(data?.content ?? ""),
    [data?.content],
  );

  if (isLoading)
    return (
      <div className="grid min-h-[60vh] gap-6 px-5 py-7 lg:grid-cols-[260px_1fr] lg:px-10">
        <DriveTreeSidebar selectedId={fileId} />
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
          <LoaderCircle size={18} className="animate-spin" />
          Loading lesson...
        </div>
      </div>
    );
  if (isError || !data)
    return (
      <div className="grid min-h-[60vh] gap-6 px-5 py-7 lg:grid-cols-[260px_1fr] lg:px-10">
        <DriveTreeSidebar selectedId={fileId} />
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-red-500">
            {(error as Error)?.message ?? "Unable to load this lesson."}
          </p>
          <Link
            to={ROUTES.DRIVE}
            className="mt-4 inline-block text-sm font-semibold text-emerald-600"
          >
            Back to Drive lessons
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/60">
      <div className="mx-auto grid max-w-[1500px] gap-4 px-3 py-4 sm:gap-6 sm:px-5 sm:py-6 lg:grid-cols-[280px_1fr] lg:gap-7 lg:px-10 lg:py-7">
        <DriveTreeSidebar selectedId={fileId} />
        <main className="min-w-0">
          <div className="mb-4 flex items-center gap-1.5 overflow-hidden text-xs text-slate-500 sm:text-sm">
            <Link
              to={ROUTES.DRIVE}
              className="font-medium hover:text-emerald-600"
            >
              Drive lessons
            </Link>
            <span>/</span>
            <span className="truncate font-semibold text-slate-700">
              {data.name}
            </span>
          </div>
          <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <h1 className="break-words text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  {data.name.replace(/\.md$/i, "")}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                  <button
                    type="button"
                    onClick={() => setTableViewMode("grid")}
                    aria-label="Hiển thị dạng lưới"
                    aria-pressed={tableViewMode === "grid"}
                    className={`rounded-md p-1.5 transition ${tableViewMode === "grid" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    <Grid2X2 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTableViewMode("row")}
                    aria-label="Hiển thị dạng hàng"
                    aria-pressed={tableViewMode === "row"}
                    className={`rounded-md p-1.5 transition ${tableViewMode === "row" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    <List size={15} />
                  </button>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                  {sections.length} câu hỏi
                </span>
              </div>
            </div>
            {data.audioFiles.length > 0 && (
              <div className="mt-4 border-t border-slate-100 pt-3">
                {data.audioFiles.map((audio) => (
                  <AudioPlayer key={audio.id} audio={audio} />
                ))}
              </div>
            )}
          </header>

          {sections.length > 0 ? (
            <div className="mt-4 space-y-2">
              {sections.map((section, index) => {
                const open = openIndex === index;
                return (
                  <article
                    key={`${section.question}-${index}`}
                    className={`overflow-hidden rounded-xl border bg-white shadow-sm transition ${open ? "border-emerald-200 shadow-md" : "border-slate-200"}`}
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setOpenIndex(open ? -1 : index)}
                      className="h-auto w-full justify-start gap-3 rounded-none px-3.5 py-3 text-left hover:bg-slate-50"
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${open ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-600"}`}
                      >
                        {index + 1}
                      </span>
                      <span className="flex-1 text-sm font-bold text-slate-800">
                        {section.question}
                      </span>
                      {open ? (
                        <ChevronUp size={17} className="text-emerald-600" />
                      ) : (
                        <ChevronDown size={17} className="text-slate-400" />
                      )}
                    </Button>
                    {open && (
                      <div className="border-t border-slate-100 bg-slate-50/60 px-3.5 py-3 pl-[3.25rem] text-sm leading-6 text-slate-600">
                        <MarkdownContent
                          content={section.answer || "No answer available."}
                          tableViewMode={tableViewMode}
                        />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-[15px] leading-7 text-slate-700 shadow-sm">
              <MarkdownContent
                content={data.content}
                tableViewMode={tableViewMode}
              />
            </div>
          )}
          <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
            <Volume2 size={14} />
            {data.modifiedTime
              ? `Updated ${new Date(data.modifiedTime).toLocaleString()}`
              : "Google Drive lesson"}
          </div>
        </main>
      </div>
    </div>
  );
}
