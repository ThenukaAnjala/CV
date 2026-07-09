import { Plus } from "lucide-react";
import { useFormContext, type Path } from "react-hook-form";
import { MonthYearField } from "@/components/builder/fields/MonthYearField";
import { RepeatedItemControls } from "@/components/builder/RepeatedItemControls";
import { SectionCard } from "@/components/builder/SectionCard";
import { BulletFields } from "@/components/builder/fields/BulletFields";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { cloneActivity, moveItem } from "@/lib/resume/arrayActions";
import { createBlankActivity, createBlankBullet } from "@/lib/resume/defaults";
import { getFieldError } from "@/lib/forms/getFieldError";
import type { ActivityEntry, ResumeData } from "@/types/resume";

export function ActivitiesForm() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ResumeData>();
  const items = watch("activities") ?? [];
  const setItems = (next: ActivityEntry[]) => setValue("activities", next, { shouldDirty: true, shouldValidate: true });

  return (
    <SectionCard actions={<Button icon={<Plus aria-hidden size={16} />} onClick={() => setItems([...items, createBlankActivity()])} size="sm">Add activity</Button>} description="Use this for leadership, volunteering, campus roles, or relevant activities." title="Leadership and Activities">
      {items.length === 0 ? <EmptyState title="No activities added" description="Add activities only when relevant and truthful." /> : null}
      {items.map((item, index) => (
        <SectionCard actions={<RepeatedItemControls disableMoveDown={index === items.length - 1} disableMoveUp={index === 0} hidden={item.hidden} itemLabel={`Activity ${index + 1}`} onDelete={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))} onDuplicate={() => setItems([...items.slice(0, index + 1), cloneActivity(item), ...items.slice(index + 1)])} onMoveDown={() => setItems(moveItem(items, index, 1))} onMoveUp={() => setItems(moveItem(items, index, -1))} onToggleHidden={() => setItems(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, hidden: !entry.hidden } : entry))} />} key={item.id} title={`Activity ${index + 1}`}>
          <div className="grid gap-4 sm:grid-cols-2">
            {renderField(`activities.${index}.role`, "Role", "Role")}
            {renderField(`activities.${index}.organization`, "Organization", "Organization Name")}
            <MonthYearField label="Date" name={`activities.${index}.year`} />
          </div>
          <BulletFields bullets={item.bullets} fieldPrefix={`activities.${index}.bullets`} label="Activity bullets" onAdd={() => setItems(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, bullets: [...entry.bullets, createBlankBullet()] } : entry))} onDelete={(bulletIndex) => setItems(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, bullets: entry.bullets.filter((_, i) => i !== bulletIndex) } : entry))} onMove={(bulletIndex, direction) => setItems(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, bullets: moveItem(entry.bullets, bulletIndex, direction) } : entry))} />
        </SectionCard>
      ))}
    </SectionCard>
  );

  function renderField(name: string, label: string, placeholder: string) {
    const path = name as Path<ResumeData>;
    return <Input error={getFieldError(errors, path)} label={label} placeholder={placeholder} {...register(path)} />;
  }
}
