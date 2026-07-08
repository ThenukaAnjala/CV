"use client";

import type { ReactNode } from "react";
import {
  AlignLeft,
  Award,
  BarChart3,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  FileSearch,
  FolderKanban,
  GraduationCap,
  Handshake,
  MoveDown,
  MoveUp,
  Sparkles,
  UserRound
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SECTION_NAVIGATION } from "@/constants/resume";
import type { SectionSetting } from "@/types/resume";
import type { ActivePanel } from "./ResumeBuilder";
import { moveItem } from "@/lib/resume/arrayActions";

const sectionIcons: Record<string, ReactNode> = {
  personal: <UserRound aria-hidden size={16} />,
  summary: <AlignLeft aria-hidden size={16} />,
  education: <GraduationCap aria-hidden size={16} />,
  experience: <BriefcaseBusiness aria-hidden size={16} />,
  projects: <FolderKanban aria-hidden size={16} />,
  skills: <Sparkles aria-hidden size={16} />,
  certifications: <Award aria-hidden size={16} />,
  activities: <Handshake aria-hidden size={16} />
};

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
    <aside className="space-y-4 xl:sticky xl:top-32">
      <nav aria-label="Builder sections" className="grid gap-1 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
        {SECTION_NAVIGATION.map((item) => (
          <Button
            className="w-full justify-start"
            icon={sectionIcons[item.key]}
            key={item.key}
            onClick={() => onActivePanelChange(item.key)}
            variant={activePanel === item.key ? "primary" : "ghost"}
          >
            {item.label}
          </Button>
        ))}
        <div className="my-1 border-t border-slate-200" aria-hidden />
        <Button className="w-full justify-start" icon={<BarChart3 aria-hidden size={16} />} onClick={() => onActivePanelChange("ats")} variant={activePanel === "ats" ? "primary" : "ghost"}>
          ATS
        </Button>
        <Button className="w-full justify-start" icon={<FileSearch aria-hidden size={16} />} onClick={() => onActivePanelChange("match")} variant={activePanel === "match" ? "primary" : "ghost"}>
          Match
        </Button>
      </nav>
      <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-950">Resume section order</h2>
        <div className="mt-3 space-y-2">
          {settings.map((section, index) => (
            <div className="rounded-md border border-slate-200 bg-slate-50 p-2" key={section.key}>
              <p className="break-words text-sm font-semibold text-slate-900">{section.title}</p>
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
