import { Eye, EyeOff, MoveDown, MoveUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { moveItem } from "@/lib/resume/arrayActions";
import type { SectionSetting } from "@/types/resume";

export function SectionOrderControls({
  settings,
  onSettingsChange
}: {
  settings: SectionSetting[];
  onSettingsChange: (settings: SectionSetting[]) => void;
}) {
  return (
    <div className="mt-3 space-y-2">
      {settings.map((section, index) => (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-2" key={section.key}>
          <p className="break-words text-sm font-semibold text-slate-900">{section.title}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            <Button
              icon={section.visible ? <EyeOff aria-hidden size={14} /> : <Eye aria-hidden size={14} />}
              onClick={() =>
                onSettingsChange(
                  settings.map((item) =>
                    item.key === section.key ? { ...item, visible: !item.visible } : item
                  )
                )
              }
              size="sm"
              variant="ghost"
            >
              {section.visible ? "Hide" : "Show"}
            </Button>
            <Button
              disabled={index === 0}
              icon={<MoveUp aria-hidden size={14} />}
              onClick={() => onSettingsChange(moveItem(settings, index, -1))}
              size="sm"
              variant="ghost"
            >
              Up
            </Button>
            <Button
              disabled={index === settings.length - 1}
              icon={<MoveDown aria-hidden size={14} />}
              onClick={() => onSettingsChange(moveItem(settings, index, 1))}
              size="sm"
              variant="ghost"
            >
              Down
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
