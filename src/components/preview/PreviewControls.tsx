import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { RESUME_PAPER_SIZES, type ResumePaperSizeKey } from "@/constants/paper";

export type PreviewZoom = "0.75" | "0.9" | "1" | "fit";
type PreviewDisplayMode = "document" | "mobile";

export function PreviewControls({
  displayMode,
  zoom,
  page,
  pageCount,
  paperSize,
  showBoundary,
  onZoomChange,
  onBoundaryChange,
  onPaperSizeChange,
  onPageChange
}: {
  displayMode: PreviewDisplayMode;
  zoom: PreviewZoom;
  page: number;
  pageCount: number;
  paperSize: ResumePaperSizeKey;
  showBoundary: boolean;
  onZoomChange: (zoom: PreviewZoom) => void;
  onBoundaryChange: (value: boolean) => void;
  onPaperSizeChange: (paperSize: ResumePaperSizeKey) => void;
  onPageChange: (page: number) => void;
}) {
  const isMobilePreview = displayMode === "mobile";

  return (
    <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-end">
      {isMobilePreview ? (
        <span className="inline-flex min-h-9 items-center rounded-md border border-sky-200 bg-sky-50 px-3 text-sm font-semibold text-sky-900">
          Mobile preview
        </span>
      ) : (
        <>
          <div className="min-w-0 sm:w-44">
            <Select
              label="Paper size"
              onChange={(event) => onPaperSizeChange(event.target.value as ResumePaperSizeKey)}
              value={paperSize}
            >
              {RESUME_PAPER_SIZES.map((paper) => (
                <option key={paper.key} value={paper.key}>
                  {paper.label} ({paper.description})
                </option>
              ))}
            </Select>
          </div>
          <div className="min-w-0 sm:w-36">
            <Select label="Preview zoom" onChange={(event) => onZoomChange(event.target.value as PreviewZoom)} value={zoom}>
              <option value="fit">Fit width</option>
              <option value="0.75">75%</option>
              <option value="0.9">90%</option>
              <option value="1">100%</option>
            </Select>
          </div>
        </>
      )}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:flex sm:flex-wrap">
        <Button className="w-full sm:w-auto" disabled={page <= 1} icon={<ChevronLeft aria-hidden size={16} />} onClick={() => onPageChange(page - 1)} size="sm" variant="secondary">
          Previous
        </Button>
        <span className="min-h-9 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm font-medium text-slate-700">
          Page {page} of {pageCount}
        </span>
        <Button className="w-full sm:w-auto" disabled={page >= pageCount} icon={<ChevronRight aria-hidden size={16} />} onClick={() => onPageChange(page + 1)} size="sm" variant="secondary">
          Next
        </Button>
      </div>
      {isMobilePreview ? null : (
        <label className="flex min-h-9 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700">
          <input checked={showBoundary} onChange={(event) => onBoundaryChange(event.target.checked)} type="checkbox" />
          Page boundary
        </label>
      )}
    </div>
  );
}
