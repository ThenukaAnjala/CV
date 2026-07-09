"use client";

import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import type { SectionSetting } from "@/types/resume";
import { BUILDER_PANEL_ITEMS, type ActivePanel } from "./builderPanelConfig";
import { SectionOrderControls } from "./SectionOrderControls";

const resumePanels = BUILDER_PANEL_ITEMS.filter((item) => item.group === "resume");
const toolPanels = BUILDER_PANEL_ITEMS.filter((item) => item.group === "tools");

export function MobileSectionLauncher({
  activePanel,
  settings,
  onOpenPanel,
  onSettingsChange
}: {
  activePanel: ActivePanel;
  settings: SectionSetting[];
  onOpenPanel: (panel: ActivePanel) => void;
  onSettingsChange: (settings: SectionSetting[]) => void;
}) {
  return (
    <div className="space-y-3 xl:hidden">
      <section aria-labelledby="mobile-resume-sections" className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-950" id="mobile-resume-sections">
          Resume sections
        </h2>
        <div className="mt-3 grid gap-2">
          {resumePanels.map((item) => (
            <MobilePanelButton
              active={activePanel === item.key}
              description={item.description}
              icon={item.icon}
              key={item.key}
              label={item.label}
              onClick={() => onOpenPanel(item.key)}
            />
          ))}
        </div>
      </section>
      <section aria-labelledby="mobile-review-tools" className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-950" id="mobile-review-tools">
          Review tools
        </h2>
        <div className="mt-3 grid gap-2">
          {toolPanels.map((item) => (
            <MobilePanelButton
              active={activePanel === item.key}
              description={item.description}
              icon={item.icon}
              key={item.key}
              label={item.label}
              onClick={() => onOpenPanel(item.key)}
            />
          ))}
        </div>
      </section>
      <details className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <summary className="cursor-pointer text-sm font-semibold text-slate-950">Resume section order</summary>
        <SectionOrderControls onSettingsChange={onSettingsChange} settings={settings} />
      </details>
    </div>
  );
}

function MobilePanelButton({
  active,
  description,
  icon,
  label,
  onClick
}: {
  active: boolean;
  description: string;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={`Open ${label}`}
      aria-current={active ? "page" : undefined}
      className="flex min-h-16 w-full items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-left shadow-sm transition hover:border-sky-200 hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
      onClick={onClick}
      type="button"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-slate-200 bg-white text-sky-800">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block break-words text-sm font-semibold text-slate-950">{label}</span>
        <span className="mt-0.5 block text-xs leading-5 text-slate-600">{description}</span>
      </span>
      <ChevronRight aria-hidden className="shrink-0 text-slate-400" size={18} />
    </button>
  );
}
