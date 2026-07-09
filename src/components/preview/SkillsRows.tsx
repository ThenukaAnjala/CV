import type { SkillGroup } from "@/types/resume";
import { joinNonEmpty } from "@/lib/resume/format";

export function SkillsRows({ groups }: { groups: SkillGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <div className="space-y-1 text-[10pt] leading-snug" role="list">
      {groups.map((group) => (
        <div className="flex items-start justify-between gap-4" key={group.id} role="listitem">
          <strong className="max-w-[42%] flex-none break-words">{group.label}:</strong>
          <span className="min-w-0 flex-1 break-words text-right">{joinNonEmpty(group.values, ", ")}</span>
        </div>
      ))}
    </div>
  );
}
