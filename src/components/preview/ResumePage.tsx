import type { CSSProperties, Ref } from "react";
import { ResumeContent, resumeHasContent } from "./ResumeContent";
import type { ResumeData } from "@/types/resume";
import {
  DEFAULT_RESUME_PAPER_SIZE_KEY,
  RESUME_PAGE_COLUMN_GAP_MM,
  RESUME_PAGE_MARGIN_MM,
  getResumePaperSize,
  type ResumePaperSize,
  type ResumePaperSizeKey
} from "@/constants/paper";
import { normalizeResumeData } from "@/lib/resume/normalizers";
import { cn } from "@/lib/ui/cn";

export function ResumePage({
  data,
  contentFlowRef,
  displayMode = "document",
  page = 1,
  paginated = false,
  paperSizeKey = DEFAULT_RESUME_PAPER_SIZE_KEY
}: {
  data: ResumeData;
  contentFlowRef?: Ref<HTMLDivElement>;
  displayMode?: "document" | "mobile";
  page?: number;
  paginated?: boolean;
  paperSizeKey?: ResumePaperSizeKey;
}) {
  const resume = normalizeResumeData(data);
  const paperSize = getResumePaperSize(paperSizeKey);
  const hasContent = resumeHasContent(resume);
  const articleStyle = displayMode === "document" ? getArticleStyle(paperSize, paginated) : undefined;
  const emptyStateStyle = displayMode === "document" ? { minHeight: 0 } : undefined;
  const content = !hasContent ? (
    <div
      className={cn(
        "text-center text-sm text-slate-500",
        displayMode === "mobile" ? "flex min-h-[60svh] items-center justify-center" : "pt-24"
      )}
      style={emptyStateStyle}
    >
      Start with personal information to build your resume preview.
    </div>
  ) : (
    <ResumeContent resume={resume} />
  );

  return (
    <article
      className={cn(
        "bg-white text-slate-950",
        displayMode === "mobile" ? "min-h-[calc(100svh-14rem)] w-full px-4 py-5" : "",
        paginated ? "overflow-hidden" : ""
      )}
      style={articleStyle}
    >
      {paginated && displayMode === "document" ? (
        <div ref={contentFlowRef} style={getPaginatedContentStyle(paperSize, page)}>
          {content}
        </div>
      ) : (
        content
      )}
    </article>
  );
}

function getArticleStyle(paperSize: ResumePaperSize, paginated: boolean): CSSProperties {
  return {
    height: paginated ? `${paperSize.heightMm}mm` : undefined,
    minHeight: `${paperSize.heightMm}mm`,
    padding: `${RESUME_PAGE_MARGIN_MM.vertical}mm ${RESUME_PAGE_MARGIN_MM.horizontal}mm`,
    width: `${paperSize.widthMm}mm`
  };
}

function getContentHeightMm(paperSize: ResumePaperSize): number {
  return paperSize.heightMm - RESUME_PAGE_MARGIN_MM.vertical * 2;
}

function getContentWidthMm(paperSize: ResumePaperSize): number {
  return paperSize.widthMm - RESUME_PAGE_MARGIN_MM.horizontal * 2;
}

function getPaginatedContentStyle(paperSize: ResumePaperSize, page: number): CSSProperties {
  const contentWidthMm = getContentWidthMm(paperSize);
  const pageOffsetMm = (Math.max(1, page) - 1) * (contentWidthMm + RESUME_PAGE_COLUMN_GAP_MM);

  return {
    columnFill: "auto",
    columnGap: `${RESUME_PAGE_COLUMN_GAP_MM}mm`,
    columnWidth: `${contentWidthMm}mm`,
    height: `${getContentHeightMm(paperSize)}mm`,
    transform: `translateX(-${pageOffsetMm}mm)`,
    width: `${contentWidthMm}mm`
  };
}
