import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

export type PreviewZoom = "0.75" | "0.9" | "1" | "fit";

export function PreviewControls({
  zoom,
  page,
  pageCount,
  showBoundary,
  onZoomChange,
  onBoundaryChange,
  onPageChange
}: {
  zoom: PreviewZoom;
  page: number;
  pageCount: number;
  showBoundary: boolean;
  onZoomChange: (zoom: PreviewZoom) => void;
  onBoundaryChange: (value: boolean) => void;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="w-36">
        <Select label="Preview zoom" onChange={(event) => onZoomChange(event.target.value as PreviewZoom)} value={zoom}>
          <option value="fit">Fit width</option>
          <option value="0.75">75%</option>
          <option value="0.9">90%</option>
          <option value="1">100%</option>
        </Select>
      </div>
      <Button disabled={page <= 1} icon={<ChevronLeft aria-hidden size={16} />} onClick={() => onPageChange(page - 1)} size="sm" variant="secondary">
        Previous
      </Button>
      <span className="min-h-9 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">
        Page {page} of {pageCount}
      </span>
      <Button disabled={page >= pageCount} icon={<ChevronRight aria-hidden size={16} />} onClick={() => onPageChange(page + 1)} size="sm" variant="secondary">
        Next
      </Button>
      <label className="flex min-h-9 items-center gap-2 rounded-md bg-slate-100 px-3 text-sm text-slate-700">
        <input checked={showBoundary} onChange={(event) => onBoundaryChange(event.target.checked)} type="checkbox" />
        Page boundary
      </label>
    </div>
  );
}
