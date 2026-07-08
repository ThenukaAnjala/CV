"use client";

import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { downloadBlob } from "@/lib/download";
import { getResumeExportFilename } from "@/lib/resume/filename";
import { validateResumeForExport } from "@/lib/resume/validation";
import type { ResumeData } from "@/types/resume";

export function DocxDownloadButton({
  data,
  busy,
  setBusy,
  onStatus
}: {
  data: ResumeData;
  busy: boolean;
  setBusy: (value: boolean) => void;
  onStatus: (message: string, tone: "neutral" | "success" | "error") => void;
}) {
  async function handleDownload() {
    const validationError = validateResumeForExport(data);
    if (validationError) {
      onStatus(validationError, "error");
      return;
    }

    setBusy(true);
    onStatus("Preparing Word document...", "neutral");
    try {
      const { createResumeDocxBlob } = await import("@/lib/export/createDocx");
      const blob = await createResumeDocxBlob(data);
      downloadBlob(blob, getResumeExportFilename(data, "docx"));
      onStatus("Word document ready", "success");
    } catch {
      onStatus("DOCX generation failed. Your current edits remain only on this page.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button disabled={busy} icon={<FileDown aria-hidden size={16} />} onClick={handleDownload} variant="secondary">
      Download Word
    </Button>
  );
}
