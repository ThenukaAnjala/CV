import { MoveDown, MoveUp, Plus, Trash2 } from "lucide-react";
import { useFormContext, type Path } from "react-hook-form";
import { RepeatedItemControls } from "@/components/builder/RepeatedItemControls";
import { SectionCard } from "@/components/builder/SectionCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { cloneSkillGroup, moveItem } from "@/lib/resume/arrayActions";
import { createBlankSkillGroup } from "@/lib/resume/defaults";
import { getFieldError } from "@/lib/forms/getFieldError";
import type { ResumeData, SkillGroup } from "@/types/resume";

export function SkillsForm() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ResumeData>();
  const groups = watch("skillGroups") ?? [];
  const setGroups = (next: SkillGroup[]) => setValue("skillGroups", next, { shouldDirty: true, shouldValidate: true });

  return (
    <SectionCard actions={<Button icon={<Plus aria-hidden size={16} />} onClick={() => setGroups([...groups, createBlankSkillGroup()])} size="sm">Add skill group</Button>} description="Skill groups export as plain text rows, not badges or progress bars." title="Technical Skills">
      {groups.length === 0 ? <EmptyState title="No skill groups added" description="Add truthful skill groups relevant to the target role." /> : null}
      {groups.map((group, index) => (
        <SectionCard actions={<RepeatedItemControls disableMoveDown={index === groups.length - 1} disableMoveUp={index === 0} hidden={group.hidden} itemLabel={`Skill group ${index + 1}`} onDelete={() => setGroups(groups.filter((_, itemIndex) => itemIndex !== index))} onDuplicate={() => setGroups([...groups.slice(0, index + 1), cloneSkillGroup(group), ...groups.slice(index + 1)])} onMoveDown={() => setGroups(moveItem(groups, index, 1))} onMoveUp={() => setGroups(moveItem(groups, index, -1))} onToggleHidden={() => setGroups(groups.map((entry, itemIndex) => itemIndex === index ? { ...entry, hidden: !entry.hidden } : entry))} />} key={group.id} title={group.label || `Skill group ${index + 1}`}>
          <Input error={getFieldError(errors, `skillGroups.${index}.label` as Path<ResumeData>)} label="Group label" placeholder="Core Skills" {...register(`skillGroups.${index}.label` as Path<ResumeData>)} />
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-900">Skills</h3>
              <Button icon={<Plus aria-hidden size={16} />} onClick={() => setGroups(groups.map((entry, itemIndex) => itemIndex === index ? { ...entry, values: [...entry.values, ""] } : entry))} size="sm" variant="secondary">
                Add skill
              </Button>
            </div>
            {group.values.map((_, valueIndex) => {
              const path = `skillGroups.${index}.values.${valueIndex}` as Path<ResumeData>;
              return (
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]" key={`${group.id}-${valueIndex}`}>
                  <Input error={getFieldError(errors, path)} label={`Skill ${valueIndex + 1}`} placeholder="Skill One" {...register(path)} />
                  <div className="flex items-end gap-2">
                    <Button disabled={valueIndex === 0} icon={<MoveUp aria-hidden size={16} />} onClick={() => setGroups(groups.map((entry, itemIndex) => itemIndex === index ? { ...entry, values: moveItem(entry.values, valueIndex, -1) } : entry))} size="sm" variant="ghost">Up</Button>
                    <Button disabled={valueIndex === group.values.length - 1} icon={<MoveDown aria-hidden size={16} />} onClick={() => setGroups(groups.map((entry, itemIndex) => itemIndex === index ? { ...entry, values: moveItem(entry.values, valueIndex, 1) } : entry))} size="sm" variant="ghost">Down</Button>
                    <Button icon={<Trash2 aria-hidden size={16} />} onClick={() => setGroups(groups.map((entry, itemIndex) => itemIndex === index ? { ...entry, values: entry.values.filter((__, i) => i !== valueIndex) } : entry))} size="sm" variant="ghost">Delete</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      ))}
    </SectionCard>
  );
}
