import { Eye, EyeOff, MoveDown, MoveUp } from "lucide-react";
import type { ReactNode } from "react";
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
    <div className="mt-2 space-y-1.5">
      {settings.map((section, index) => (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5" key={section.key}>
          <p className="truncate text-sm font-semibold text-slate-900">{section.title}</p>
          <div className="flex items-center gap-1">
            <IconButton
              label={section.visible ? `Hide ${section.title}` : `Show ${section.title}`}
              onClick={() =>
                onSettingsChange(
                  settings.map((item) =>
                    item.key === section.key ? { ...item, visible: !item.visible } : item
                  )
                )
              }
            >
              {section.visible ? <EyeOff aria-hidden size={14} /> : <Eye aria-hidden size={14} />}
            </IconButton>
            <IconButton
              disabled={index === 0}
              label={`Move ${section.title} up`}
              onClick={() => onSettingsChange(moveItem(settings, index, -1))}
            >
              <MoveUp aria-hidden size={14} />
            </IconButton>
            <IconButton
              disabled={index === settings.length - 1}
              label={`Move ${section.title} down`}
              onClick={() => onSettingsChange(moveItem(settings, index, 1))}
            >
              <MoveDown aria-hidden size={14} />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
}

function IconButton({
  children,
  disabled,
  label,
  onClick
}: {
  children: ReactNode;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-slate-600 transition hover:border-slate-200 hover:bg-white hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}
