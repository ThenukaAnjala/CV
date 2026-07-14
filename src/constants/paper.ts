export const RESUME_PAPER_SIZES = [
  { key: "a4", label: "A4", description: "210 x 297 mm", widthMm: 210, heightMm: 297 },
  { key: "letter", label: "US Letter", description: "8.5 x 11 in", widthMm: 215.9, heightMm: 279.4 },
  { key: "legal", label: "US Legal", description: "8.5 x 14 in", widthMm: 215.9, heightMm: 355.6 }
] as const;

export type ResumePaperSize = (typeof RESUME_PAPER_SIZES)[number];
export type ResumePaperSizeKey = ResumePaperSize["key"];

export const DEFAULT_RESUME_PAPER_SIZE_KEY: ResumePaperSizeKey = "a4";
export const RESUME_PAGE_MARGIN_MM = { vertical: 15, horizontal: 17 } as const;
export const RESUME_PAGE_COLUMN_GAP_MM = 18;

export function getResumePaperSize(key: ResumePaperSizeKey): ResumePaperSize {
  return RESUME_PAPER_SIZES.find((paper) => paper.key === key) ?? RESUME_PAPER_SIZES[0];
}
