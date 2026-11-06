import type { DriveItem } from "../types/drive.types";

export interface FlattenedDriveFile {
  item: DriveItem;
  folderPath: string[];
}

export function isMarkdownFile(item: DriveItem): boolean {
  return (
    item.type === "file" &&
    (item.mimeType === "text/markdown" ||
      item.name.toLowerCase().endsWith(".md"))
  );
}

export function formatLessonName(name: string): string {
  return name
    .replace(/\.+md$/i, "")
    .replace(/\.md$/i, "")
    .replace(/_/g, " ")
    .trim();
}

export function flattenMarkdownFilesWithPath(
  item?: DriveItem | null,
  parentPath: string[] = [],
  isRoot = true,
): FlattenedDriveFile[] {
  if (!item) return [];
  if (item.type === "file") {
    return isMarkdownFile(item) ? [{ item, folderPath: parentPath }] : [];
  }
  const nextPath =
    isRoot || !item.name ? parentPath : [...parentPath, item.name];
  return (item.children ?? []).flatMap((child) =>
    flattenMarkdownFilesWithPath(child, nextPath, false),
  );
}

export function pruneTree(item: DriveItem, query = ""): DriveItem | null {
  const needle = query.toLowerCase().trim();

  if (item.type === "file") {
    if (!isMarkdownFile(item)) return null;
    if (!needle) return item;
    const formatted = formatLessonName(item.name).toLowerCase();
    return item.name.toLowerCase().includes(needle) ||
      formatted.includes(needle)
      ? item
      : null;
  }

  const folderMatches =
    Boolean(needle) && item.name.toLowerCase().includes(needle);
  const children = (item.children ?? [])
    .map((child) => pruneTree(child, folderMatches ? "" : needle))
    .filter((child): child is DriveItem => child !== null);

  if (children.length === 0) return null;

  return {
    ...item,
    children,
  };
}

export function countMarkdownFiles(item: DriveItem): number {
  if (item.type === "file") return isMarkdownFile(item) ? 1 : 0;
  return (item.children ?? []).reduce(
    (sum, child) => sum + countMarkdownFiles(child),
    0,
  );
}

