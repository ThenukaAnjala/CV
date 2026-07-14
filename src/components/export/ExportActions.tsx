"use client";

import { useState } from "react";
import { DocxDownloadButton } from "./DocxDownloadButton";
import { PdfDownloadButton } from "./PdfDownloadButton";
import type { ResumePaperSizeKey } from "@/constants/paper";
import type { ResumeData } from "@/types/resume";

export function ExportActions({
  data,
  onStatus,
  paperSizeKey
}: {
  data: ResumeData;
  onStatus: (message: string, tone: "neutral" | "success" | "error") => void;
  paperSizeKey: ResumePaperSizeKey;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <div className="contents sm:flex sm:flex-wrap sm:gap-2">
      <PdfDownloadButton busy={busy} data={data} onStatus={onStatus} paperSizeKey={paperSizeKey} setBusy={setBusy} />
      <DocxDownloadButton busy={busy} data={data} onStatus={onStatus} paperSizeKey={paperSizeKey} setBusy={setBusy} />
    </div>
  );
}
