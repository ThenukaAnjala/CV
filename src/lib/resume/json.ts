import { resumeDataSchema, resumeImportSchema } from "@/schemas/resumeSchema";
import type { ResumeData } from "@/types/resume";
import { normalizeResumeData } from "./normalizers";

export type JsonParseResult =
  | { ok: true; data: ResumeData }
  | { ok: false; message: string };

export function parseResumeJson(text: string): JsonParseResult {
  if (!text.trim()) {
    return { ok: false, message: "This JSON file is empty." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, message: "This file does not contain valid JSON." };
  }

  const imported = resumeImportSchema.safeParse(parsed);
  if (!imported.success) {
    return { ok: false, message: "This JSON file is not a valid resume export." };
  }

  const normalized = normalizeResumeData(imported.data);
  const valid = resumeDataSchema.safeParse(normalized);
  if (!valid.success) {
    return { ok: false, message: "This JSON file uses an unsupported resume structure." };
  }

  return { ok: true, data: valid.data };
}

export function serializeResumeJson(data: ResumeData): string {
  return JSON.stringify(normalizeResumeData(data), null, 2);
}
