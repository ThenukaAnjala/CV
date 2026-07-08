import { resumeDataSchema } from "@/schemas/resumeSchema";
import type { ResumeData } from "@/types/resume";
import { normalizeResumeData } from "./normalizers";

export function validateResumeForExport(data: ResumeData): string | null {
  const normalized = normalizeResumeData(data);
  const parsed = resumeDataSchema.safeParse(normalized);

  if (!parsed.success) {
    return "Fix validation errors before exporting.";
  }

  return null;
}
