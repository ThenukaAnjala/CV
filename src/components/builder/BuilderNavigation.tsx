"use client";

import { Button } from "@/components/ui/Button";
import type { SectionSetting } from "@/types/resume";
import { BUILDER_PANEL_ITEMS, type ActivePanel } from "./builderPanelConfig";
import { SectionOrderControls } from "./SectionOrderControls";

const resumePanels = BUILDER_PANEL_ITEMS.filter((item) => item.group === "resume");
const toolPanels = BUILDER_PANEL_ITEMS.filter((item) => item.group === "tools");

export function BuilderNavigation({
  activePanel,
  settings,
  onActivePanelChange,
  onSettingsChange
}: {
  activePanel: ActivePanel;
  settings: SectionSetting[];
  onActivePanelChange: (panel: ActivePanel) => void;
  onSettingsChange: (settings: SectionSetting[]) => void;
}) {
  return (
    <aside className="space-y-3 xl:sticky xl:top-32 xl:space-y-4">
      <nav aria-label="Builder sections" className="flex gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-white p-2 shadow-sm xl:grid xl:gap-1 xl:overflow-visible">
        {resumePanels.map((item) => (
          <Button
            className="shrink-0 justify-start whitespace-nowrap xl:w-full"
            icon={item.icon}
            key={item.key}
            onClick={() => onActivePanelChange(item.key)}
            variant={activePanel === item.key ? "primary" : "ghost"}
          >
            {item.label}
          </Button>
        ))}
        <div className="h-11 w-px shrink-0 bg-slate-200 xl:my-1 xl:h-px xl:w-auto xl:border-t xl:border-slate-200 xl:bg-transparent" aria-hidden />
        {toolPanels.map((item) => (
          <Button
            className="shrink-0 justify-start whitespace-nowrap xl:w-full"
            icon={item.icon}
            key={item.key}
            onClick={() => onActivePanelChange(item.key)}
            variant={activePanel === item.key ? "primary" : "ghost"}
          >
            {item.label}
          </Button>
        ))}
      </nav>
      <details className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm xl:hidden">
        <summary className="cursor-pointer text-sm font-semibold text-slate-950">Resume section order</summary>
        <SectionOrderControls onSettingsChange={onSettingsChange} settings={settings} />
      </details>
      <section className="hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm xl:block">
        <h2 className="text-sm font-semibold text-slate-950">Resume section order</h2>
        <SectionOrderControls onSettingsChange={onSettingsChange} settings={settings} />
      </section>
    </aside>
  );
}
