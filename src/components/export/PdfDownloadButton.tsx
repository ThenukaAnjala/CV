"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { downloadBlob } from "@/lib/download";
import { getResumeExportFilename } from "@/lib/resume/filename";
import { validateResumeForExport } from "@/lib/resume/validation";
import type { ResumePaperSizeKey } from "@/constants/paper";
import type { ResumeData } from "@/types/resume";

export function PdfDownloadButton({
  data,
  busy,
  setBusy,
  onStatus,
  paperSizeKey
}: {
  data: ResumeData;
  busy: boolean;
  setBusy: (value: boolean) => void;
  onStatus: (message: string, tone: "neutral" | "success" | "error") => void;
  paperSizeKey: ResumePaperSizeKey;
}) {
  async function handleDownload() {
    const validationError = validateResumeForExport(data);
    if (validationError) {
      onStatus(validationError, "error");
      return;
    }

    setBusy(true);
    onStatus("Preparing PDF...", "neutral");
    try {
      const { createResumePdfBlob } = await import("@/lib/export/createPdf");
      const blob = await createResumePdfBlob(data, paperSizeKey);
      downloadBlob(blob, getResumeExportFilename(data, "pdf"));
      onStatus("PDF ready", "success");
    } catch {
      onStatus("PDF generation failed. Your current edits remain only on this page.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button className="w-full sm:w-auto" disabled={busy} icon={<Download aria-hidden size={15} />} onClick={handleDownload} size="sm" variant="primary">
      Download PDF
    </Button>
  );
}
