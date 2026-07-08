import type { ResumeData } from "@/types/resume";
import { trimText } from "./format";

const ILLEGAL_FILENAME_CHARACTERS = /[<>:"/\\|?*\u0000-\u001f]/g;

export function sanitizeFileBaseName(input: string, fallback: string, maxLength = 80): string {
  const cleaned = trimText(input)
    .normalize("NFKC")
    .replace(ILLEGAL_FILENAME_CHARACTERS, " ")
    .replace(/[. ]+$/g, "")
    .replace(/\s+/g, "_")
    .toUpperCase()
    .slice(0, maxLength)
    .replace(/[._ ]+$/g, "");

  return cleaned || fallback;
}

export function getResumeExportFilename(data: ResumeData, extension: "pdf" | "docx"): string {
  const base = sanitizeFileBaseName(data.personal.fullName, "");
  return `${base ? `${base}_` : ""}ATS_RESUME.${extension}`;
}

export function getJsonExportFilename(data: ResumeData): string {
  const base = sanitizeFileBaseName(data.personal.fullName, "");
  return `${base ? `${base}_` : ""}RESUME_DATA.json`;
}
