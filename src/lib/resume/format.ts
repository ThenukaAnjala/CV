import { SECTION_LABELS } from "@/constants/resume";
import type { ResumeData, SectionKey, SectionSetting } from "@/types/resume";

export function trimText(value: string | undefined | null): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

export function trimMultiline(value: string | undefined | null): string {
  return typeof value === "string"
    ? value
        .split(/\r?\n/)
        .map((line) => trimText(line))
        .filter(Boolean)
        .join("\n")
    : "";
}

export function hasText(value: string | undefined | null): boolean {
  return trimText(value).length > 0;
}

export function joinNonEmpty(values: readonly string[], separator = " | "): string {
  return values.map(trimText).filter(Boolean).join(separator);
}

export function formatDateRange(startDate: string, endDate: string, isCurrent = false): string {
  const start = trimText(startDate);
  const end = isCurrent ? "Present" : trimText(endDate);

  if (start && end) return `${start} - ${end}`;
  return start || end;
}

export function wordCount(value: string): number {
  return trimText(value) ? trimText(value).split(/\s+/).length : 0;
}

export function isValidHttpUrl(value: string): boolean {
  const url = trimText(value);
  if (!url) return true;

  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function getOrderedSections(data: ResumeData): SectionSetting[] {
  const seen = new Set<SectionKey>();
  const valid = data.sectionSettings.filter((section) => {
    if (!(section.key in SECTION_LABELS) || seen.has(section.key)) return false;
    seen.add(section.key);
    return true;
  });

  const missing = (Object.keys(SECTION_LABELS) as SectionKey[])
    .filter((key) => !seen.has(key))
    .map((key) => ({ key, title: SECTION_LABELS[key], visible: true }));

  return [...valid, ...missing];
}

export function isSectionVisible(data: ResumeData, key: SectionKey): boolean {
  return getOrderedSections(data).find((section) => section.key === key)?.visible ?? true;
}
