"use client";

import { FileJson, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { ExportActions } from "@/components/export/ExportActions";
import { APP_DEVELOPER } from "@/constants/app";
import type { ResumeData } from "@/types/resume";

export type PrivacyStatus = {
  message: string;
  tone: "neutral" | "success" | "error";
};

export function BuilderHeader({
  data,
  status,
  onStatus,
  onNewResume,
  onReset,
  onExportJson,
  onImportFile
}: {
  data: ResumeData;
  status: PrivacyStatus;
  onStatus: (message: string, tone: "neutral" | "success" | "error") => void;
  onNewResume: () => void;
  onReset: () => void;
  onExportJson: () => void;
  onImportFile: (file: File) => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-950">ATS Resume Builder</h1>
            <p className="mt-1 text-sm text-slate-600">Resume data is held only in memory for this open page. Nothing is autosaved or uploaded.</p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Developed by {APP_DEVELOPER.name} ·{" "}
              <a className="text-blue-700 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-200" href={`mailto:${APP_DEVELOPER.email}`}>
                {APP_DEVELOPER.email}
              </a>
            </p>
          </div>
          <StatusMessage tone={status.tone}>{status.message}</StatusMessage>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button icon={<RotateCcw aria-hidden size={16} />} onClick={onNewResume} variant="secondary">New Resume</Button>
          <label>
            <input accept=".json,application/json" className="sr-only" onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) onImportFile(file);
            }} type="file" />
            <span className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50">
              <Upload aria-hidden size={16} /> Import JSON
            </span>
          </label>
          <Button icon={<FileJson aria-hidden size={16} />} onClick={onExportJson} variant="secondary">Export JSON</Button>
          <Button icon={<RotateCcw aria-hidden size={16} />} onClick={onReset} variant="secondary">Reset Resume</Button>
          <ExportActions data={data} onStatus={onStatus} />
        </div>
      </div>
    </header>
  );
}
