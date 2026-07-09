"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { OverflowNotice } from "./OverflowNotice";
import { PreviewControls, type PreviewZoom } from "./PreviewControls";
import { ResumePage } from "./ResumePage";
import type { ResumeData } from "@/types/resume";
import { getResumePlainText } from "@/lib/resume/text";
import { wordCount } from "@/lib/resume/format";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const A4_PAGE_WIDTH_PX = 794;

export function ResumePreview({ data }: { data: ResumeData }) {
  const previewFrameRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState<PreviewZoom>("fit");
  const [page, setPage] = useState(1);
  const [showBoundary, setShowBoundary] = useState(true);
  const [fitScale, setFitScale] = useState(0.72);
  const words = useMemo(() => wordCount(getResumePlainText(data)), [data]);
  const pageCount = Math.max(1, Math.ceil(words / 430));
  const scale = zoom === "fit" ? fitScale : Number(zoom);
  const isMobileLayout = useMediaQuery("(max-width: 1279px)");

  useEffect(() => {
    function updateFitScale() {
      const frameWidth = previewFrameRef.current?.clientWidth ?? window.innerWidth;
      const availableWidth = Math.max(280, frameWidth - 16);
      setFitScale(Math.min(1, Math.max(0.35, availableWidth / A4_PAGE_WIDTH_PX)));
    }

    updateFitScale();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateFitScale);
      return () => window.removeEventListener("resize", updateFitScale);
    }

    const observer = new ResizeObserver(updateFitScale);
    if (previewFrameRef.current) observer.observe(previewFrameRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="space-y-3" aria-label="Resume preview">
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <PreviewControls
          displayMode={isMobileLayout ? "mobile" : "document"}
          onBoundaryChange={setShowBoundary}
          onPageChange={(nextPage) => setPage(Math.min(pageCount, Math.max(1, nextPage)))}
          onZoomChange={setZoom}
          page={Math.min(page, pageCount)}
          pageCount={pageCount}
          showBoundary={showBoundary}
          zoom={zoom}
        />
      </div>
      <OverflowNotice show={pageCount > 1} />
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
              width: "210mm",
              transform: `scale(${scale})`,
              transformOrigin: "top center",
              marginBottom: `calc((297mm * ${scale}) - 297mm)`
            }}
          >
            <div className={showBoundary ? "shadow-xl ring-1 ring-slate-300" : ""}>
              <ResumePage data={data} displayMode="document" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
