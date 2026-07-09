"use client";

import { FileJson, Mail, RotateCcw, ShieldCheck, Sparkles, Upload } from "lucide-react";
import { AppLogo } from "@/components/brand/AppLogo";
import { Button } from "@/components/ui/Button";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { ExportActions } from "@/components/export/ExportActions";
import { APP_DEVELOPER, APP_NAME } from "@/constants/app";
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
  onExportJson: () => void | Promise<void>;
  onImportFile: (file: File) => void;
}) {
  return (
    <header className="top-0 z-30 border-b border-slate-200 bg-white/95 px-3 py-3 shadow-sm backdrop-blur sm:sticky sm:px-4">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-3">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex min-w-0 items-center gap-3">
              <AppLogo className="h-12 w-12 shrink-0 rounded-lg shadow-sm ring-1 ring-slate-900/10" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{APP_NAME}</h1>
                  <span className="inline-flex min-h-7 items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2.5 text-xs font-semibold text-sky-800">
                    <Sparkles aria-hidden size={13} />
                    ATS ready
                  </span>
                </div>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                  Private resume builder with live preview, checks, and browser-only downloads.
                </p>
              </div>
            </div>
            <p className="grid min-w-0 gap-2 text-xs font-medium text-slate-600 min-[520px]:flex min-[520px]:flex-wrap min-[520px]:items-center">
              <span className="max-w-full break-words rounded-md border border-slate-200 bg-slate-50 px-2 py-1">Developed by {APP_DEVELOPER.name}</span>
              <a
                className="inline-flex min-h-7 max-w-full min-w-0 items-center gap-1 rounded-md border border-slate-200 bg-white px-2 text-sky-800 underline-offset-2 hover:border-sky-200 hover:bg-sky-50 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-200"
                href={`mailto:${APP_DEVELOPER.email}`}
              >
                <Mail aria-hidden className="shrink-0" size={13} />
                <span className="min-w-0 break-all">{APP_DEVELOPER.email}</span>
              </a>
            </p>
          </div>
          <div className="flex min-w-0 flex-col gap-2 sm:items-end xl:shrink-0">
            <span className="inline-flex min-h-9 items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-emerald-800 shadow-sm">
              <ShieldCheck aria-hidden size={15} />
              In-memory only
            </span>
            <StatusMessage tone={status.tone}>{status.message}</StatusMessage>
          </div>
        </div>
        <div aria-label="Resume actions" className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 sm:flex sm:flex-wrap">
          <Button className="w-full sm:w-auto" icon={<RotateCcw aria-hidden size={16} />} onClick={onNewResume} variant="secondary">
            New Resume
          </Button>
          <label className="min-w-0">
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
            <span className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:border-slate-400 hover:bg-slate-50 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-sky-700 sm:w-auto">
              <Upload aria-hidden size={16} /> Import JSON
            </span>
          </label>
          <Button className="w-full sm:w-auto" icon={<FileJson aria-hidden size={16} />} onClick={onExportJson} variant="secondary">
            Export JSON
          </Button>
          <Button className="w-full sm:w-auto" icon={<RotateCcw aria-hidden size={16} />} onClick={onReset} variant="secondary">
            Reset Resume
          </Button>
          <ExportActions data={data} onStatus={onStatus} />
        </div>
      </div>
    </header>
  );
}
