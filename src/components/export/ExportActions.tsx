"use client";

import { useState } from "react";
import { DocxDownloadButton } from "./DocxDownloadButton";
import { PdfDownloadButton } from "./PdfDownloadButton";
import type { ResumeData } from "@/types/resume";

export function ExportActions({
  data,
  onStatus
}: {
  data: ResumeData;
  onStatus: (message: string, tone: "neutral" | "success" | "error") => void;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex flex-wrap gap-2">
      <PdfDownloadButton busy={busy} data={data} onStatus={onStatus} setBusy={setBusy} />
      <DocxDownloadButton busy={busy} data={data} onStatus={onStatus} setBusy={setBusy} />
    </div>
  );
}
