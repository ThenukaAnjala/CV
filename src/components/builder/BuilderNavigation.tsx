"use client";

import type { SectionSetting } from "@/types/resume";
import { cn } from "@/lib/ui/cn";
import { BUILDER_PANEL_ITEMS, type ActivePanel, type BuilderPanelItem } from "./builderPanelConfig";
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
    <aside className="scroll-area space-y-2 overflow-x-hidden xl:min-h-0 xl:overflow-y-auto xl:pr-1">
      <nav
        aria-label="Builder sections"
        className="scroll-area flex gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-white p-2 shadow-sm xl:grid xl:gap-1.5 xl:overflow-visible"
      >
        {resumePanels.map((item) => (
          <NavigationItem
            active={activePanel === item.key}
            item={item}
            key={item.key}
            onClick={() => onActivePanelChange(item.key)}
          />
        ))}
        <div className="h-9 w-px shrink-0 bg-slate-200 xl:my-1 xl:h-px xl:w-auto xl:border-t xl:border-slate-200 xl:bg-transparent" aria-hidden />
        {toolPanels.map((item) => (
          <NavigationItem
            active={activePanel === item.key}
            item={item}
            key={item.key}
            onClick={() => onActivePanelChange(item.key)}
          />
        ))}
      </nav>
      <details className="group rounded-lg border border-slate-200 bg-white shadow-sm">
        <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 px-3 text-sm font-semibold text-slate-950 marker:hidden">
          <span>Resume section order</span>
          <span className="text-xs font-medium text-slate-500 group-open:hidden">Show</span>
          <span className="hidden text-xs font-medium text-slate-500 group-open:inline">Hide</span>
        </summary>
        <div className="border-t border-slate-100 px-3 pb-3">
          <SectionOrderControls onSettingsChange={onSettingsChange} settings={settings} />
        </div>
      </details>
    </aside>
  );
}

function NavigationItem({
  active,
  item,
  onClick
}: {
  active: boolean;
  item: BuilderPanelItem;
  onClick: () => void;
}) {
  return (
    <button
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative inline-flex min-h-9 shrink-0 items-center gap-2 rounded-md border px-3 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 xl:w-full",
        active
          ? "border-sky-200 bg-sky-50 text-sky-900 shadow-none"
          : "border-transparent bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950"
      )}
      onClick={onClick}
      type="button"
    >
      <span
        className={cn(
          "absolute left-0 top-1.5 hidden h-6 w-1 rounded-r-full xl:block",
          active ? "bg-sky-700" : "bg-transparent"
        )}
      />
      <span className={cn("shrink-0", active ? "text-sky-800" : "text-slate-500 group-hover:text-slate-700")}>
        {item.icon}
      </span>
      <span className="truncate">{item.label}</span>
    </button>
  );
}
