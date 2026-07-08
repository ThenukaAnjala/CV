import type { SkillGroup } from "@/types/resume";
import { joinNonEmpty } from "@/lib/resume/format";

export function SkillsRows({ groups }: { groups: SkillGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <div className="space-y-1 text-[10pt] leading-snug">
      {groups.map((group) => (
        <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3" key={group.id}>
          <strong className="break-words">{group.label}:</strong>
          <span className="break-words">{joinNonEmpty(group.values, ", ")}</span>
        </div>
      ))}
    </div>
  );
}
