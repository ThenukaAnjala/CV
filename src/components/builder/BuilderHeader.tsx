"use client";

import { FileCheck2, FileJson, Mail, RotateCcw, ShieldCheck, Upload } from "lucide-react";
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
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sky-700 text-white shadow-sm">
                <FileCheck2 aria-hidden size={22} />
              </span>
              <div className="min-w-0">
                <h1 className="text-xl font-semibold text-slate-950">ATS Resume Builder</h1>
                <p className="mt-1 text-sm text-slate-600">
                  Resume data is held only in memory for this open page. Nothing is autosaved or uploaded.
                </p>
              </div>
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-500">
              <span>Developed by {APP_DEVELOPER.name}</span>
              <span aria-hidden>-</span>
              <a
                className="inline-flex items-center gap-1 text-sky-800 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-200"
                href={`mailto:${APP_DEVELOPER.email}`}
              >
                <Mail aria-hidden size={13} />
                {APP_DEVELOPER.email}
              </a>
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            <span className="inline-flex min-h-8 items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-emerald-800">
              <ShieldCheck aria-hidden size={15} />
              In-memory only
            </span>
            <StatusMessage tone={status.tone}>{status.message}</StatusMessage>
          </div>
        </div>
        <div aria-label="Resume actions" className="flex flex-wrap gap-2 border-t border-slate-200 pt-3">
          <Button icon={<RotateCcw aria-hidden size={16} />} onClick={onNewResume} variant="secondary">
            New Resume
          </Button>
          <label>
            <input
              accept=".json,application/json"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) onImportFile(file);
              }}
              type="file"
            />
            <span className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:border-slate-400 hover:bg-slate-50 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-sky-700">
              <Upload aria-hidden size={16} /> Import JSON
            </span>
          </label>
          <Button icon={<FileJson aria-hidden size={16} />} onClick={onExportJson} variant="secondary">
            Export JSON
          </Button>
          <Button icon={<RotateCcw aria-hidden size={16} />} onClick={onReset} variant="secondary">
            Reset Resume
          </Button>
          <ExportActions data={data} onStatus={onStatus} />
        </div>
      </div>
    </header>
  );
}
