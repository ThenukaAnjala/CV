"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { OverflowNotice } from "./OverflowNotice";
import { PreviewControls, type PreviewZoom } from "./PreviewControls";
import { ResumePage } from "./ResumePage";
import type { ResumeData } from "@/types/resume";
import { getResumePaperSize, type ResumePaperSizeKey } from "@/constants/paper";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const CSS_PIXELS_PER_MM = 96 / 25.4;

export function ResumePreview({
  data,
  paperSizeKey,
  onPaperSizeChange
}: {
  data: ResumeData;
  paperSizeKey: ResumePaperSizeKey;
  onPaperSizeChange: (paperSize: ResumePaperSizeKey) => void;
}) {
  const previewFrameRef = useRef<HTMLDivElement | null>(null);
  const contentFlowRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState<PreviewZoom>("fit");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [showBoundary, setShowBoundary] = useState(true);
  const [fitScale, setFitScale] = useState(0.72);
  const scale = zoom === "fit" ? fitScale : Number(zoom);
  const isMobileLayout = useMediaQuery("(max-width: 1279px)");
  const paperSize = getResumePaperSize(paperSizeKey);
  const currentPage = Math.min(page, pageCount);

  const updateFitScale = useCallback(() => {
    const frameWidth = previewFrameRef.current?.clientWidth ?? window.innerWidth;
    const availableWidth = Math.max(280, frameWidth - 16);
    const paperWidthPx = paperSize.widthMm * CSS_PIXELS_PER_MM;

    setFitScale(Math.min(1, Math.max(0.35, availableWidth / paperWidthPx)));
  }, [paperSize.widthMm]);

  const updatePageCount = useCallback(() => {
    if (isMobileLayout) {
      setPageCount(1);
      setPage(1);
      return;
    }

    const flow = contentFlowRef.current;
    if (!flow) return;

    const columnGap = Number.parseFloat(window.getComputedStyle(flow).columnGap) || 0;
    const pageAdvance = flow.clientWidth + columnGap;
    if (pageAdvance <= 0) return;

    const nextPageCount = Math.max(1, Math.ceil((flow.scrollWidth - 1) / pageAdvance));
    setPageCount(nextPageCount);
    setPage((current) => Math.min(Math.max(1, current), nextPageCount));
  }, [isMobileLayout]);

  useEffect(() => {
    updateFitScale();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateFitScale);
      return () => window.removeEventListener("resize", updateFitScale);
    }

    const observer = new ResizeObserver(updateFitScale);
    if (previewFrameRef.current) observer.observe(previewFrameRef.current);
    return () => observer.disconnect();
  }, [updateFitScale]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(updatePageCount);
    return () => window.cancelAnimationFrame(frame);
  }, [data, paperSizeKey, updatePageCount]);

  useEffect(() => {
    if (typeof ResizeObserver === "undefined" || !contentFlowRef.current) return;

    const observer = new ResizeObserver(updatePageCount);
    observer.observe(contentFlowRef.current);
    return () => observer.disconnect();
  }, [updatePageCount]);

  function handlePaperSizeChange(nextPaperSize: ResumePaperSizeKey) {
    onPaperSizeChange(nextPaperSize);
    setPage(1);
  }

  return (
    <section className="space-y-3" aria-label="Resume preview">
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <PreviewControls
          displayMode={isMobileLayout ? "mobile" : "document"}
          onBoundaryChange={setShowBoundary}
          onPageChange={(nextPage) => setPage(Math.min(pageCount, Math.max(1, nextPage)))}
          onPaperSizeChange={handlePaperSizeChange}
          onZoomChange={setZoom}
          page={currentPage}
          pageCount={pageCount}
          paperSize={paperSizeKey}
          showBoundary={showBoundary}
          zoom={zoom}
        />
      </div>
      <OverflowNotice pageCount={pageCount} />
      <div
        ref={previewFrameRef}
        className="max-h-[calc(100svh-8rem)] overflow-auto rounded-lg border border-slate-300 bg-slate-300 p-2 shadow-inner sm:max-h-[calc(100vh-13rem)] sm:p-4"
      >
        {isMobileLayout ? (
          <div
            aria-label="Mobile resume preview"
            className="mx-auto w-full max-w-[430px] overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-slate-300"
            role="region"
          >
            <ResumePage data={data} displayMode="mobile" />
          </div>
        ) : (
          <div
            className="mx-auto origin-top"
            style={{
              height: `${paperSize.heightMm}mm`,
              width: `${paperSize.widthMm}mm`,
              transform: `scale(${scale})`,
              transformOrigin: "top center",
              marginBottom: `calc((${paperSize.heightMm}mm * ${scale}) - ${paperSize.heightMm}mm)`
            }}
          >
            <div className={showBoundary ? "shadow-xl ring-1 ring-slate-300" : ""}>
              <ResumePage
                contentFlowRef={contentFlowRef}
                data={data}
                displayMode="document"
                page={currentPage}
                paginated
                paperSizeKey={paperSizeKey}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
