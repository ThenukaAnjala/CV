import { Plus } from "lucide-react";
import { useFormContext, type Path } from "react-hook-form";
import { RepeatedItemControls } from "@/components/builder/RepeatedItemControls";
import { SectionCard } from "@/components/builder/SectionCard";
import { BulletFields } from "@/components/builder/fields/BulletFields";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { cloneEducation, moveItem } from "@/lib/resume/arrayActions";
import { createBlankBullet, createBlankEducation } from "@/lib/resume/defaults";
import { getFieldError } from "@/lib/forms/getFieldError";
import type { EducationEntry, ResumeData } from "@/types/resume";

export function EducationForm() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ResumeData>();
  const items = watch("education") ?? [];
  const setItems = (next: EducationEntry[]) => setValue("education", next, { shouldDirty: true, shouldValidate: true });

  return (
    <SectionCard
      actions={<Button icon={<Plus aria-hidden size={16} />} onClick={() => setItems([...items, createBlankEducation()])} size="sm">Add education</Button>}
      description="Add schools, degrees, coursework, or relevant academic details."
      title="Education"
    >
      {items.length === 0 ? <EmptyState title="No education added" description="Add an education record or hide this resume section." /> : null}
      {items.map((item, index) => (
        <SectionCard
          actions={<RepeatedItemControls disableMoveDown={index === items.length - 1} disableMoveUp={index === 0} hidden={item.hidden} itemLabel={`Education ${index + 1}`} onDelete={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))} onDuplicate={() => setItems([...items.slice(0, index + 1), cloneEducation(item), ...items.slice(index + 1)])} onMoveDown={() => setItems(moveItem(items, index, 1))} onMoveUp={() => setItems(moveItem(items, index, -1))} onToggleHidden={() => setItems(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, hidden: !entry.hidden } : entry))} />}
          key={item.id}
          title={`Education ${index + 1}`}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {renderField(`education.${index}.qualification`, "Qualification", "Degree or qualification")}
            {renderField(`education.${index}.institution`, "Institution", "Institution Name")}
            {renderField(`education.${index}.location`, "Location", "City, State")}
            {renderField(`education.${index}.startDate`, "Start date", "Jan 2025")}
            {renderField(`education.${index}.endDate`, "End date", "Dec 2025")}
          </div>
          <BulletFields
            bullets={item.details}
            fieldPrefix={`education.${index}.details`}
            label="Optional details"
            onAdd={() => setItems(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, details: [...entry.details, createBlankBullet()] } : entry))}
            onDelete={(bulletIndex) => setItems(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, details: entry.details.filter((_, i) => i !== bulletIndex) } : entry))}
            onMove={(bulletIndex, direction) => setItems(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, details: moveItem(entry.details, bulletIndex, direction) } : entry))}
          />
        </SectionCard>
      ))}
    </SectionCard>
  );

  function renderField(name: string, label: string, placeholder: string) {
    const path = name as Path<ResumeData>;
    return <Input error={getFieldError(errors, path)} label={label} placeholder={placeholder} {...register(path)} />;
  }
}
