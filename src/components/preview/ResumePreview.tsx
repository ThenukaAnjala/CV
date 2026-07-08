"use client";

import { useMemo, useState } from "react";
import { OverflowNotice } from "./OverflowNotice";
import { PreviewControls, type PreviewZoom } from "./PreviewControls";
import { ResumePage } from "./ResumePage";
import type { ResumeData } from "@/types/resume";
import { getResumePlainText } from "@/lib/resume/text";
import { wordCount } from "@/lib/resume/format";

export function ResumePreview({ data }: { data: ResumeData }) {
  const [zoom, setZoom] = useState<PreviewZoom>("fit");
  const [page, setPage] = useState(1);
  const [showBoundary, setShowBoundary] = useState(true);
  const words = useMemo(() => wordCount(getResumePlainText(data)), [data]);
  const pageCount = Math.max(1, Math.ceil(words / 430));
  const scale = zoom === "fit" ? 0.72 : Number(zoom);

  return (
    <section className="space-y-3" aria-label="Resume preview">
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <PreviewControls
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
      <div className="max-h-[calc(100vh-13rem)] overflow-auto rounded-lg border border-slate-300 bg-slate-300 p-4 shadow-inner">
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
            <ResumePage data={data} />
          </div>
        </div>
      </div>
    </section>
  );
}
