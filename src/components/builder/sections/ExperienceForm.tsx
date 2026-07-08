import { Plus } from "lucide-react";
import { useFormContext, type Path } from "react-hook-form";
import { RepeatedItemControls } from "@/components/builder/RepeatedItemControls";
import { SectionCard } from "@/components/builder/SectionCard";
import { BulletFields } from "@/components/builder/fields/BulletFields";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { cloneExperience, moveItem } from "@/lib/resume/arrayActions";
import { createBlankBullet, createBlankExperience } from "@/lib/resume/defaults";
import { getFieldError } from "@/lib/forms/getFieldError";
import type { ExperienceEntry, ResumeData } from "@/types/resume";

export function ExperienceForm() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ResumeData>();
  const items = watch("experience") ?? [];
  const setItems = (next: ExperienceEntry[]) => setValue("experience", next, { shouldDirty: true, shouldValidate: true });

  return (
    <SectionCard actions={<Button icon={<Plus aria-hidden size={16} />} onClick={() => setItems([...items, createBlankExperience()])} size="sm">Add experience</Button>} description="Describe roles with concise achievement bullets." title="Experience">
      {items.length === 0 ? <EmptyState title="No experience added" description="Add work experience or use projects to show relevant evidence." /> : null}
      {items.map((item, index) => (
        <SectionCard actions={<RepeatedItemControls disableMoveDown={index === items.length - 1} disableMoveUp={index === 0} hidden={item.hidden} itemLabel={`Experience ${index + 1}`} onDelete={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))} onDuplicate={() => setItems([...items.slice(0, index + 1), cloneExperience(item), ...items.slice(index + 1)])} onMoveDown={() => setItems(moveItem(items, index, 1))} onMoveUp={() => setItems(moveItem(items, index, -1))} onToggleHidden={() => setItems(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, hidden: !entry.hidden } : entry))} />} key={item.id} title={`Experience ${index + 1}`}>
          <div className="grid gap-4 sm:grid-cols-2">
            {renderField(`experience.${index}.position`, "Position", "Role title")}
            {renderField(`experience.${index}.company`, "Company", "Company Name")}
            {renderField(`experience.${index}.location`, "Location", "City, State")}
            {renderField(`experience.${index}.startDate`, "Start date", "Jan 2025")}
            {renderField(`experience.${index}.endDate`, "End date", "Present or Dec 2025")}
            <label className="flex min-h-11 items-center gap-3 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm">
              <input className="h-4 w-4 rounded border-slate-300 text-sky-700 focus:ring-sky-700" type="checkbox" {...register(`experience.${index}.isCurrent` as Path<ResumeData>)} />
              Current position
            </label>
          </div>
          <BulletFields bullets={item.bullets} fieldPrefix={`experience.${index}.bullets`} label="Achievement bullets" onAdd={() => setItems(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, bullets: [...entry.bullets, createBlankBullet()] } : entry))} onDelete={(bulletIndex) => setItems(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, bullets: entry.bullets.filter((_, i) => i !== bulletIndex) } : entry))} onMove={(bulletIndex, direction) => setItems(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, bullets: moveItem(entry.bullets, bulletIndex, direction) } : entry))} />
        </SectionCard>
      ))}
    </SectionCard>
  );

  function renderField(name: string, label: string, placeholder: string) {
    const path = name as Path<ResumeData>;
    return <Input error={getFieldError(errors, path)} label={label} placeholder={placeholder} {...register(path)} />;
  }
}
