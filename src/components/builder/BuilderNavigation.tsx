"use client";

import { BarChart3, Eye, EyeOff, FileSearch, MoveDown, MoveUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SECTION_NAVIGATION } from "@/constants/resume";
import type { SectionSetting } from "@/types/resume";
import type { ActivePanel } from "./ResumeBuilder";
import { moveItem } from "@/lib/resume/arrayActions";

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
    <aside className="space-y-4">
      <nav aria-label="Builder sections" className="grid gap-2">
        {SECTION_NAVIGATION.map((item) => (
          <Button key={item.key} onClick={() => onActivePanelChange(item.key)} variant={activePanel === item.key ? "primary" : "ghost"}>
            {item.label}
          </Button>
        ))}
        <Button icon={<BarChart3 aria-hidden size={16} />} onClick={() => onActivePanelChange("ats")} variant={activePanel === "ats" ? "primary" : "ghost"}>
          ATS
        </Button>
        <Button icon={<FileSearch aria-hidden size={16} />} onClick={() => onActivePanelChange("match")} variant={activePanel === "match" ? "primary" : "ghost"}>
          Match
        </Button>
      </nav>
      <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-950">Resume section order</h2>
        <div className="mt-3 space-y-2">
          {settings.map((section, index) => (
            <div className="rounded-md border border-slate-200 p-2" key={section.key}>
              <p className="text-sm font-medium text-slate-900">{section.title}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                <Button icon={section.visible ? <EyeOff aria-hidden size={14} /> : <Eye aria-hidden size={14} />} onClick={() => onSettingsChange(settings.map((item) => item.key === section.key ? { ...item, visible: !item.visible } : item))} size="sm" variant="ghost">
                  {section.visible ? "Hide" : "Show"}
                </Button>
                <Button disabled={index === 0} icon={<MoveUp aria-hidden size={14} />} onClick={() => onSettingsChange(moveItem(settings, index, -1))} size="sm" variant="ghost">
                  Up
                </Button>
                <Button disabled={index === settings.length - 1} icon={<MoveDown aria-hidden size={14} />} onClick={() => onSettingsChange(moveItem(settings, index, 1))} size="sm" variant="ghost">
                  Down
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
