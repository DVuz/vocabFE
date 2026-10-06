import {
  ChevronDown,
  ChevronUp,
  FileAudio,
  FileText,
  LoaderCircle,
  Volume2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ROUTES } from "../../../shared/constants/routes";
import { useDriveContent } from "../hooks/use-drive";
import type { DriveAudioFile } from "../types/drive.types";
import { DriveTreeSidebar } from "./drive-tree-sidebar";

interface Section {
  question: string;
  answer: string;
}

function MarkdownContent({ content }: { content: string }) {
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
            <table className="my-4 min-w-full border-separate border-spacing-0 overflow-hidden rounded-xl border border-slate-200 text-left text-sm">
              {children}
            </table>
          ),
          thead: ({ children }) => (
            <thead className="bg-emerald-50 text-emerald-900">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border-b border-slate-200 px-4 py-3 font-bold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-slate-100 px-4 py-3 align-top last:border-r-0">
              {children}
            </td>
          ),
          tr: ({ children }) => (
            <tr className="even:bg-slate-50/70">{children}</tr>
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
  const streamUrl = audio.streamUrl.startsWith("http")
    ? audio.streamUrl
    : `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000"}${audio.streamUrl}`;
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
      <FileAudio size={19} className="shrink-0 text-slate-400" />
      <span className="min-w-0 truncate text-sm font-medium text-slate-700">
        {audio.name}
      </span>
      <audio
        className="ml-auto h-10 min-w-[220px] max-w-full"
        controls
        preload="metadata"
        src={streamUrl}
      >
        Your browser does not support audio playback.
      </audio>
    </div>
  );
}

export function DriveLessonPage({ fileId }: { fileId: string }) {
  const { data, isLoading, isError, error } = useDriveContent(fileId);
  const [openIndex, setOpenIndex] = useState(0);
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
      <div className="mx-auto grid max-w-[1500px] gap-7 px-5 py-7 lg:grid-cols-[280px_1fr] lg:px-10">
        <DriveTreeSidebar selectedId={fileId} />
        <main>
          <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
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
          <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <FileText size={23} />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {data.name.replace(/\.md$/i, "")}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Speaking practice lesson from Google Drive
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  Speaking Q&A
                </span>
                {data.audioFiles.length > 0 && (
                  <span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700">
                    Audio available
                  </span>
                )}
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                  {sections.length} questions
                </span>
              </div>
            </div>
          </header>

          {data.audioFiles.length > 0 && (
            <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 px-1">
                <Volume2 size={17} className="text-emerald-600" />
                <h2 className="font-bold text-slate-800">Lesson audio</h2>
              </div>
              <div className="space-y-3">
                {data.audioFiles.map((audio) => (
                  <AudioPlayer key={audio.id} audio={audio} />
                ))}
              </div>
            </section>
          )}

          {sections.length > 0 ? (
            <div className="mt-5 space-y-3">
              {sections.map((section, index) => {
                const open = openIndex === index;
                return (
                  <article
                    key={`${section.question}-${index}`}
                    className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${open ? "border-emerald-200 shadow-md" : "border-slate-200"}`}
                  >
                    <button
                      onClick={() => setOpenIndex(open ? -1 : index)}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-slate-50"
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${open ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-600"}`}
                      >
                        {index + 1}
                      </span>
                      <span className="flex-1 font-bold text-slate-800">
                        {section.question}
                      </span>
                      {open ? (
                        <ChevronUp size={17} className="text-emerald-600" />
                      ) : (
                        <ChevronDown size={17} className="text-slate-400" />
                      )}
                    </button>
                    {open && (
                      <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-5 pl-[4.25rem] text-[15px] leading-7 text-slate-600">
                        <MarkdownContent
                          content={section.answer || "No answer available."}
                        />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-[15px] leading-7 text-slate-700 shadow-sm">
              <MarkdownContent content={data.content} />
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
