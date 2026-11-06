import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ChevronsDownUp,
  ChevronsUpDown,
  Clock,
  FolderTree,
  Grid2X2,
  List,
  LoaderCircle,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAccessToken } from "../../../shared/api";
import { ROUTES } from "../../../shared/constants/routes";
import { useDriveContent, useDriveTree } from "../hooks/use-drive";
import type { DriveAudioFile, DriveImageFile } from "../types/drive.types";
import { DriveTreeSidebar } from "./drive-tree-sidebar";
import {
  flattenMarkdownFilesWithPath,
  formatLessonName,
} from "./drive.utils";

interface Section {
  question: string;
  answer: string;
}

type TableViewMode = "grid" | "row";

function cleanMarkdownContent(
  raw: string,
  audioFiles: DriveAudioFile[],
  imageFiles: DriveImageFile[],
): string {
  const imageFileByName = new Map(
    imageFiles.map((image) => [image.name.trim().toLocaleLowerCase(), image]),
  );
  const audioFileNames = new Set(
    audioFiles.map((audio) => audio.name.trim().toLocaleLowerCase()),
  );

  return (
    raw
      // Remove HTML <audio ...></audio> tags since audio is rendered in our dedicated player
      .replace(/<audio\b[^>]*>[\s\S]*?<\/audio>/gi, "")
      .replace(/<audio\b[^>]*\/?>/gi, "")
      // Handle Obsidian embeds ![[filename|width]]
      .replace(
        /!\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]/g,
        (embed, name: string, width?: string) => {
          const cleanName = name.replace(/\[\]\(\)/g, "").trim();
          if (
            audioFileNames.has(cleanName.toLocaleLowerCase()) ||
            /\.(wav|mp3|ogg|m4a)$/i.test(cleanName)
          ) {
            return "";
          }

          const image = imageFileByName.get(cleanName.toLocaleLowerCase());
          if (!image) return embed;

          const imageWidth = width?.trim();
          const widthQuery =
            imageWidth && /^\d+$/.test(imageWidth)
              ? `?width=${imageWidth}`
              : "";
          return `![${cleanName}](https://drive-image.local/${encodeURIComponent(image.id)}${widthQuery})`;
        },
      )
      // Remove empty trailing markdown table rows like `|   |   |`
      .replace(/^\s*\|(?:\s*\|)+\s*$/gm, "")
      // Remove horizontal rules that are left stacked at the very top after stripping <audio>
      .replace(/^(?:\s*---\s*\n)+/, "")
      .trim()
  );
}

function MarkdownContent({
  content,
  tableViewMode,
  imageFiles,
  audioFiles,
}: {
  content: string;
  tableViewMode: TableViewMode;
  imageFiles: DriveImageFile[];
  audioFiles: DriveAudioFile[];
}) {
  const isGrid = tableViewMode === "grid";

  const markdown = useMemo(
    () => cleanMarkdownContent(content, audioFiles, imageFiles),
    [audioFiles, content, imageFiles],
  );

  return (
    <div className="markdown-content min-w-0 max-w-full text-[15px] leading-7 text-slate-700 sm:text-base sm:leading-7">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 border-b border-slate-200 pb-3 text-xl font-extrabold tracking-tight text-slate-900 sm:mb-5 sm:text-2xl lg:text-3xl">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-7 mb-3.5 flex items-center gap-2.5 border-b border-slate-200/80 pb-2 text-lg font-extrabold text-slate-900 first:mt-0 sm:mt-8 sm:mb-4 sm:text-xl">
              <span className="h-5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span className="min-w-0 break-words">{children}</span>
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-5 mb-2.5 text-base font-bold text-slate-800 sm:mt-6 sm:text-lg">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-4 mb-2 text-sm font-bold text-emerald-800 sm:text-base">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mb-3.5 leading-relaxed break-words last:mb-0 sm:mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-1.5 pl-5 sm:pl-6">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-1.5 pl-5 sm:pl-6">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-1 leading-relaxed break-words">{children}</li>
          ),
          hr: () => <hr className="my-5 border-slate-200/80 sm:my-6" />,
          strong: ({ children }) => (
            <strong className="font-bold text-slate-900">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-slate-600 italic">{children}</em>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              className="font-medium break-all text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-900"
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 rounded-r-xl border-l-4 border-emerald-400 bg-emerald-50/60 px-3.5 py-2.5 text-sm text-slate-700 italic sm:px-4 sm:py-3 sm:text-[15px]">
              {children}
            </blockquote>
          ),
          table: ({ children }) =>
            isGrid ? (
              <table className="my-3 grid grid-cols-1 gap-2.5 border-0 text-left text-sm md:grid-cols-2">
                {children}
              </table>
            ) : (
              <div className="my-4 w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                <table className="min-w-full border-collapse text-left text-sm">
                  {children}
                </table>
              </div>
            ),
          thead: ({ children }) => (
            <thead
              className={
                isGrid
                  ? "hidden"
                  : "border-b border-slate-200 bg-emerald-50/80 text-emerald-950"
              }
            >
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th
              className={
                isGrid
                  ? "hidden"
                  : "px-3.5 py-2.5 text-xs font-bold tracking-wide whitespace-nowrap uppercase sm:px-4 sm:py-3"
              }
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              className={
                isGrid
                  ? "min-w-0 px-3.5 py-1.5 align-top break-words first:pt-3 first:pb-1 first:text-[15px] first:font-bold first:text-slate-900 [&:not(:first-child):not(:last-child)]:py-1 [&:not(:first-child):not(:last-child)]:text-xs [&:not(:first-child):not(:last-child)]:font-semibold [&:not(:first-child):not(:last-child)]:text-emerald-700 last:mx-3.5 last:mt-1 last:mb-3 last:border-l-2 last:border-emerald-300 last:py-0.5 last:pl-2.5 last:text-sm last:leading-relaxed last:text-slate-600 last:italic"
                  : "border-b border-slate-100 px-3.5 py-2.5 align-top leading-relaxed break-words sm:px-4 sm:py-3"
              }
            >
              {children}
            </td>
          ),
          tbody: ({ children }) => (
            <tbody
              className={
                isGrid ? "contents" : "divide-y divide-slate-100 bg-white"
              }
            >
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr
              className={
                isGrid
                  ? "relative flex flex-col justify-start rounded-xl border border-slate-200/90 bg-white shadow-2xs transition hover:border-emerald-300 hover:shadow-sm"
                  : "transition-colors even:bg-slate-50/50 hover:bg-emerald-50/30"
              }
            >
              {children}
            </tr>
          ),
          code: ({ children }) => (
            <code className="rounded-md bg-slate-200/70 px-1.5 py-0.5 text-[0.88em] break-words text-rose-700">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="my-4 overflow-x-auto rounded-xl bg-slate-900 p-3.5 text-xs leading-6 text-slate-100 sm:p-4 sm:text-sm">
              {children}
            </pre>
          ),
          img: ({ src, alt, title }) => {
            const imageId = src?.match(
              /^https:\/\/drive-image\.local\/([^?]+)/,
            )?.[1];
            const image = imageId
              ? imageFiles.find(
                  (file) => file.id === decodeURIComponent(imageId),
                )
              : undefined;
            const width = src?.match(/[?&]width=(\d+)/)?.[1];

            return image ? (
              <DriveImage
                alt={alt ?? image.name}
                image={image}
                title={title}
                width={width ? Number(width) : undefined}
              />
            ) : (
              <img
                src={src}
                alt={alt}
                title={title}
                className="my-3 h-auto max-w-full rounded-xl"
              />
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

function DriveImage({
  image,
  alt,
  title,
  width,
}: {
  image: DriveImageFile;
  alt?: string;
  title?: string;
  width?: number;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let objectUrl: string | null = null;

    async function loadImage() {
      try {
        const baseUrl =
          import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";
        const streamUrl = image.streamUrl || image.imageUrl;
        if (!streamUrl) throw new Error("Drive image has no stream URL.");
        const url = streamUrl.startsWith("http")
          ? streamUrl
          : `${baseUrl}${streamUrl}`;
        const token = getAccessToken();
        const response = await fetch(url, {
          headers: token ? { Authorization: "Bearer " + token } : undefined,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Image request failed: ${response.status}`);
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Unable to load Drive image", error);
          setHasError(true);
        }
      }
    }

    void loadImage();
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [image.id, image.imageUrl, image.streamUrl]);

  if (hasError) {
    return (
      <span className="my-3 block text-xs text-red-500">
        Không thể tải ảnh: {image.name}
      </span>
    );
  }

  if (!imageUrl) {
    return (
      <span className="my-3 block text-xs text-slate-400">Đang tải ảnh...</span>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt ?? image.name}
      title={title}
      width={width}
      className="my-3 h-auto max-w-full rounded-xl shadow-xs"
    />
  );
}

interface ParsedLesson {
  intro: string;
  sections: Section[];
}

function extractInlineAudios(
  markdown: string,
  existingAudios: DriveAudioFile[],
): DriveAudioFile[] {
  const result = [...existingAudios];
  const existingUrls = new Set(existingAudios.map((a) => a.streamUrl));
  const regex = /<audio\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(markdown)) !== null) {
    const src = match[1]?.trim();
    if (src && !existingUrls.has(src)) {
      existingUrls.add(src);
      const fileName =
        decodeURIComponent(src.split("/").pop()?.split("?")[0] ?? "audio.mp3") ||
        "audio.mp3";
      result.push({
        id: `inline-${src}`,
        name: fileName,
        mimeType: src.endsWith(".mp3") ? "audio/mpeg" : "audio/wav",
        streamUrl: src,
      });
    }
  }
  return result;
}

function parseSections(
  markdown: string,
  audioFiles: DriveAudioFile[],
): ParsedLesson {
  // Check if the markdown has top-level `## ` sections (like Writing Part 2 or Dialogue with Vocabulary).
  // If it has `## ` sections, we should NOT split on `### ` because `### ` is a subsection inside one of the `## ` sections.
  const hasH2Sections = /^##\s+.+$/m.test(markdown);
  if (hasH2Sections) {
    return { intro: markdown.trim(), sections: [] };
  }

  const lines = markdown.split(/\r?\n/);
  const audioFileNames = new Set(
    audioFiles.map((audio) => audio.name.trim().toLocaleLowerCase()),
  );
  const sections: Section[] = [];
  let current: Section | null = null;
  const intro: string[] = [];

  for (const line of lines) {
    const attachment = line.match(/^\s*!\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]\s*$/);
    const cleanAttachmentName = attachment?.[1]?.replace(/\[\]\(\)/g, "").trim();
    const isAudioAttachment =
      cleanAttachmentName &&
      (audioFileNames.has(cleanAttachmentName.toLocaleLowerCase()) ||
        /\.(wav|mp3|ogg|m4a)$/i.test(cleanAttachmentName));

    const heading = line.match(/^###\s+(.+)$/);
    if (heading) {
      if (current) sections.push({ ...current, answer: current.answer.trim() });
      // Strip leading numbering like "1. " since we render the index badge
      const cleanQuestion = heading[1].trim().replace(/^\d+[.)]\s*/, "");
      current = { question: cleanQuestion, answer: "" };
    } else if (current && !isAudioAttachment) {
      current.answer += `${line}\n`;
    } else if (!current && !isAudioAttachment) {
      intro.push(line);
    }
  }

  if (current) {
    // Strip trailing `---` from the last section's answer
    const cleanedAnswer = current.answer.replace(/(?:\r?\n---\s*)+$/, "").trim();
    sections.push({ ...current, answer: cleanedAnswer });
  }
  return { intro: intro.join("\n").trim(), sections };
}

function isPublicUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.protocol === "https:" &&
      (parsedUrl.hostname.endsWith(".supabase.co") ||
        !parsedUrl.pathname.startsWith("/api/"))
    );
  } catch {
    return false;
  }
}

function AudioPlayer({
  audio,
  showName,
}: {
  audio: DriveAudioFile;
  showName?: boolean;
}) {
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

        // Public Supabase URLs can be streamed directly by <audio> without blob pre-download
        if (isPublicUrl(url)) {
          setAudioUrl(url);
          setStatus("ready");
          return;
        }

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
    <div className="min-w-0 flex-1">
      {showName && (
        <p className="mb-1 truncate text-xs font-medium text-slate-600">
          {formatLessonName(audio.name.replace(/\.(wav|mp3|ogg|m4a)$/i, ""))}
        </p>
      )}
      {status === "loading" && (
        <div className="flex h-9 items-center gap-2 text-xs text-slate-500">
          <LoaderCircle size={14} className="animate-spin text-emerald-600" />
          <span>Đang tải audio...</span>
        </div>
      )}
      {status === "error" && (
        <span className="text-xs text-red-500">Không thể tải audio</span>
      )}
      {status === "ready" && audioUrl && (
        <audio
          className=" block h-9 w-full max-w-full rounded-lg"
          controls
          preload="metadata"
          src={audioUrl}
        >
          Trình duyệt của bạn không hỗ trợ phát audio.
        </audio>
      )}
    </div>
  );
}

export function DriveLessonPage({ fileId }: { fileId: string }) {
  return <DriveLessonPageInner key={fileId} fileId={fileId} />;
}

function DriveLessonPageInner({ fileId }: { fileId: string }) {
  const { data, isLoading, isError, error } = useDriveContent(fileId);
  const { data: tree } = useDriveTree();
  const [openIndices, setOpenIndices] = useState<Set<number>>(
    () => new Set([0]),
  );
  const [tableViewMode, setTableViewMode] = useState<TableViewMode>("grid");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Scroll to top when switching lessons
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fileId]);

  const mergedAudioFiles = useMemo(
    () => extractInlineAudios(data?.content ?? "", data?.audioFiles ?? []),
    [data?.audioFiles, data?.content],
  );

  const parsedLesson = useMemo(
    () => parseSections(data?.content ?? "", mergedAudioFiles),
    [data?.content, mergedAudioFiles],
  );
  const { intro, sections } = parsedLesson;

  const hasTables = useMemo(
    () => /\|.*\|/.test(data?.content ?? ""),
    [data?.content],
  );

  // Calculate current folder path and Prev / Next lessons
  const { folderPath, prevLesson, nextLesson } = useMemo(() => {
    const allFiles = flattenMarkdownFilesWithPath(tree);
    const idx = allFiles.findIndex((entry) => entry.item.id === fileId);
    if (idx === -1) {
      return { folderPath: [], prevLesson: null, nextLesson: null };
    }
    return {
      folderPath: allFiles[idx].folderPath,
      prevLesson: idx > 0 ? allFiles[idx - 1] : null,
      nextLesson: idx < allFiles.length - 1 ? allFiles[idx + 1] : null,
    };
  }, [tree, fileId]);

  const allExpanded =
    sections.length > 0 && openIndices.size >= sections.length;

  const toggleAllSections = () => {
    if (allExpanded) {
      setOpenIndices(new Set());
    } else {
      setOpenIndices(new Set(sections.map((_, idx) => idx)));
    }
  };

  const toggleSection = (index: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50/60">
        <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-10 lg:py-7">
          <div className="hidden lg:block">
            <DriveTreeSidebar selectedId={fileId} />
          </div>
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-8 text-sm text-slate-500 shadow-2xs">
            <LoaderCircle size={22} className="animate-spin text-emerald-600" />
            <span>Đang tải nội dung bài học...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50/60">
        <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-10 lg:py-7">
          <div className="hidden lg:block">
            <DriveTreeSidebar selectedId={fileId} />
          </div>
          <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-2xs">
            <p className="text-sm font-medium text-red-600">
              {(error as Error)?.message ?? "Không thể tải bài học này."}
            </p>
            <Link
              to={ROUTES.DRIVE}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <ArrowLeft size={15} />
              Quay lại danh sách bài học
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const lessonTitle = formatLessonName(data.name);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/60 pb-10">
      {/* Mobile Slide-over Drawer for Lesson Tree */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <div
            className="relative z-10 flex h-full w-[86vw] max-w-[340px] flex-col bg-slate-50 p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between px-1 py-1">
              <span className="text-sm font-bold text-slate-800">
                Danh sách bài học
              </span>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/70"
                aria-label="Đóng danh sách"
              >
                <X size={18} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <DriveTreeSidebar
                selectedId={fileId}
                onSelect={() => setMobileDrawerOpen(false)}
                className="[&>div]:max-h-[calc(100vh-4.5rem)] [&>div]:border-0 [&>div]:shadow-none"
              />
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-[1500px] gap-5 px-3.5 py-4 sm:px-6 sm:py-6 lg:grid-cols-[280px_1fr] lg:gap-8 lg:px-10 lg:py-7">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <DriveTreeSidebar selectedId={fileId} />
        </div>

        <main className="min-w-0">
          {/* Top Navigation & Breadcrumb Bar */}
          <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 sm:text-sm">
              <Link
                to={ROUTES.DRIVE}
                className="inline-flex shrink-0 items-center gap-1 font-medium text-slate-600 transition hover:text-emerald-600"
              >
                <ArrowLeft size={14} />
                <span>Bài học Drive</span>
              </Link>
              {folderPath.map((folder) => (
                <span
                  key={folder}
                  className="hidden items-center gap-1.5 sm:inline-flex"
                >
                  <span className="text-slate-300">/</span>
                  <span className="font-medium text-slate-500">{folder}</span>
                </span>
              ))}
              <span className="text-slate-300">/</span>
              <span className="truncate font-semibold text-slate-800">
                {lessonTitle}
              </span>
            </div>

            {/* Mobile Toggle Button for Lesson Drawer */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-emerald-300 hover:text-emerald-700 lg:hidden"
            >
              <FolderTree size={14} className="text-amber-500" />
              <span>Đổi bài học</span>
            </button>
          </div>

          {/* Lesson Header Card */}
          <header className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                {folderPath.length > 0 && (
                  <div className="mb-2 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-emerald-700 uppercase">
                      {folderPath.join(" • ")}
                    </span>
                    {sections.length > 0 && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                        {sections.length} câu hỏi
                      </span>
                    )}
                  </div>
                )}
                <h1 className="text-lg font-extrabold tracking-tight leading-snug break-words text-slate-900 sm:text-2xl lg:text-[26px]">
                  {lessonTitle}
                </h1>
              </div>

              {/* Action Controls: Table Mode + Expand/Collapse All */}
              <div className="flex shrink-0 flex-wrap items-center gap-2 self-start">
                {hasTables && (
                  <div
                    className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5"
                    role="group"
                    aria-label="Chế độ xem bảng"
                  >
                    <button
                      type="button"
                      onClick={() => setTableViewMode("grid")}
                      aria-label="Hiển thị dạng thẻ"
                      aria-pressed={tableViewMode === "grid"}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        tableViewMode === "grid"
                          ? "bg-white text-emerald-700 shadow-2xs"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <Grid2X2 size={14} />
                      <span>Thẻ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTableViewMode("row")}
                      aria-label="Hiển thị dạng bảng"
                      aria-pressed={tableViewMode === "row"}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        tableViewMode === "row"
                          ? "bg-white text-emerald-700 shadow-2xs"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <List size={14} />
                      <span>Bảng</span>
                    </button>
                  </div>
                )}

                {sections.length > 1 && (
                  <button
                    type="button"
                    onClick={toggleAllSections}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700"
                  >
                    {allExpanded ? (
                      <>
                        <ChevronsDownUp size={14} />
                        <span>Thu gọn tất cả</span>
                      </>
                    ) : (
                      <>
                        <ChevronsUpDown size={14} />
                        <span>Mở tất cả</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Sticky Audio Player Bar */}
          {mergedAudioFiles.length > 0 && (
            <div className="sticky top-16 z-30 mt-3 rounded-2xl border border-emerald-200/80 bg-white/95 p-3 shadow-sm backdrop-blur-md sm:px-4 sm:py-3">
              <div className="flex flex-col gap-2.5">
                {mergedAudioFiles.map((audio) => (
                  <div key={audio.id} className="flex items-center gap-3">
                    <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:flex">
                      <Volume2 size={18} />
                    </div>
                    <AudioPlayer
                      audio={audio}
                      showName={mergedAudioFiles.length > 1}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lesson Body */}
          {sections.length > 0 ? (
            <div className="mt-4 space-y-3">
              {intro && (
                <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 to-white p-4 shadow-2xs sm:p-6">
                  <MarkdownContent
                    content={intro}
                    tableViewMode={tableViewMode}
                    imageFiles={data.imageFiles}
                    audioFiles={mergedAudioFiles}
                  />
                </div>
              )}

              {sections.map((section, index) => {
                const open = openIndices.has(index);
                return (
                  <article
                    key={`${section.question}-${index}`}
                    className={`overflow-hidden rounded-2xl border bg-white transition-all ${
                      open
                        ? "border-emerald-200/90 shadow-xs"
                        : "border-slate-200/90 hover:border-slate-300"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(index)}
                      aria-expanded={open}
                      className="flex w-full items-start gap-3 px-3.5 py-3.5 text-left transition-colors hover:bg-slate-50/80 sm:items-center sm:px-5 sm:py-4"
                    >
                      <span
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors sm:mt-0 ${
                          open
                            ? "bg-emerald-600 text-white shadow-2xs"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1 text-sm font-bold leading-snug break-words whitespace-normal text-slate-800 sm:text-[15px]">
                        {section.question}
                      </span>
                      <span className="mt-0.5 shrink-0 text-slate-400 sm:mt-0">
                        {open ? (
                          <ChevronUp size={18} className="text-emerald-600" />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </span>
                    </button>

                    {open && (
                      <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3.5 text-sm leading-relaxed text-slate-700 sm:px-5 sm:py-4 sm:pl-14">
                        <MarkdownContent
                          content={section.answer || "Chưa có câu trả lời."}
                          tableViewMode={tableViewMode}
                          imageFiles={data.imageFiles}
                          audioFiles={mergedAudioFiles}
                        />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs sm:p-6 lg:p-8">
              <MarkdownContent
                content={data.content}
                tableViewMode={tableViewMode}
                imageFiles={data.imageFiles}
                audioFiles={mergedAudioFiles}
              />
            </div>
          )}

          {/* Metadata Footer */}
          <div className="mt-5 flex items-center gap-2 px-1 text-xs text-slate-400">
            <Clock size={13} />
            <span>
              {data.modifiedTime
                ? `Cập nhật lần cuối: ${new Date(data.modifiedTime).toLocaleString("vi-VN")}`
                : "Bài học đồng bộ từ Google Drive"}
            </span>
          </div>

          {/* Prev / Next Lesson Navigation */}
          {(prevLesson || nextLesson) && (
            <nav
              aria-label="Điều hướng bài học"
              className="mt-6 grid grid-cols-1 gap-3 border-t border-slate-200/80 pt-5 sm:grid-cols-2"
            >
              {prevLesson ? (
                <Link
                  to="/drive/$fileId"
                  params={{ fileId: prevLesson.item.id }}
                  className="group flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs transition hover:border-emerald-300 hover:shadow-sm sm:p-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-emerald-50 group-hover:text-emerald-600">
                    <ArrowLeft size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                      Bài trước
                    </p>
                    <p className="truncate text-sm font-bold text-slate-800 group-hover:text-emerald-700">
                      {formatLessonName(prevLesson.item.name)}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="hidden sm:block" />
              )}

              {nextLesson && (
                <Link
                  to="/drive/$fileId"
                  params={{ fileId: nextLesson.item.id }}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 text-right shadow-2xs transition hover:border-emerald-300 hover:shadow-sm sm:p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                      Bài tiếp theo
                    </p>
                    <p className="truncate text-sm font-bold text-slate-800 group-hover:text-emerald-700">
                      {formatLessonName(nextLesson.item.name)}
                    </p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-emerald-50 group-hover:text-emerald-600">
                    <ArrowRight size={16} />
                  </span>
                </Link>
              )}
            </nav>
          )}
        </main>
      </div>
    </div>
  );
}
