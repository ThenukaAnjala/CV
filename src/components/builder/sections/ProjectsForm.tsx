import { Plus } from "lucide-react";
import { useFormContext, type Path } from "react-hook-form";
import { RepeatedItemControls } from "@/components/builder/RepeatedItemControls";
import { SectionCard } from "@/components/builder/SectionCard";
import { BulletFields } from "@/components/builder/fields/BulletFields";
import { LinkFields } from "@/components/builder/fields/LinkFields";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { cloneProject, moveItem } from "@/lib/resume/arrayActions";
import { createBlankBullet, createBlankLink, createBlankProject } from "@/lib/resume/defaults";
import { getFieldError } from "@/lib/forms/getFieldError";
import type { ProjectEntry, ResumeData } from "@/types/resume";

export function ProjectsForm() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ResumeData>();
  const items = watch("projects") ?? [];
  const setItems = (next: ProjectEntry[]) => setValue("projects", next, { shouldDirty: true, shouldValidate: true });

  return (
    <SectionCard actions={<Button icon={<Plus aria-hidden size={16} />} onClick={() => setItems([...items, createBlankProject()])} size="sm">Add project</Button>} description="Use projects for portfolio, academic, independent, or open-ended work." title="Projects">
      {items.length === 0 ? <EmptyState title="No projects added" description="Add a project if it truthfully supports the target role." /> : null}
      {items.map((item, index) => (
        <SectionCard actions={<RepeatedItemControls disableMoveDown={index === items.length - 1} disableMoveUp={index === 0} hidden={item.hidden} itemLabel={`Project ${index + 1}`} onDelete={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))} onDuplicate={() => setItems([...items.slice(0, index + 1), cloneProject(item), ...items.slice(index + 1)])} onMoveDown={() => setItems(moveItem(items, index, 1))} onMoveUp={() => setItems(moveItem(items, index, -1))} onToggleHidden={() => setItems(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, hidden: !entry.hidden } : entry))} />} key={item.id} title={`Project ${index + 1}`}>
          <div className="grid gap-4 sm:grid-cols-2">
            {renderField(`projects.${index}.name`, "Project name", "Project Name")}
            {renderField(`projects.${index}.role`, "Role or context", "Role or team context")}
            {renderField(`projects.${index}.startDate`, "Start date", "Jan 2025")}
            {renderField(`projects.${index}.endDate`, "End date", "Mar 2025")}
          </div>
          <Textarea error={getFieldError(errors, `projects.${index}.description` as Path<ResumeData>)} label="Description" placeholder="Briefly describe the project purpose, scope, and outcome." rows={3} {...register(`projects.${index}.description` as Path<ResumeData>)} />
          <LinkFields links={item.links} fieldPrefix={`projects.${index}.links`} label="Project links" onAdd={() => setItems(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, links: [...entry.links, createBlankLink()] } : entry))} onDelete={(linkIndex) => setItems(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, links: entry.links.filter((_, i) => i !== linkIndex) } : entry))} onMove={(linkIndex, direction) => setItems(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, links: moveItem(entry.links, linkIndex, direction) } : entry))} />
          <BulletFields bullets={item.bullets} fieldPrefix={`projects.${index}.bullets`} label="Project bullets" onAdd={() => setItems(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, bullets: [...entry.bullets, createBlankBullet()] } : entry))} onDelete={(bulletIndex) => setItems(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, bullets: entry.bullets.filter((_, i) => i !== bulletIndex) } : entry))} onMove={(bulletIndex, direction) => setItems(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, bullets: moveItem(entry.bullets, bulletIndex, direction) } : entry))} />
        </SectionCard>
      ))}
    </SectionCard>
  );

  function renderField(name: string, label: string, placeholder: string) {
    const path = name as Path<ResumeData>;
    return <Input error={getFieldError(errors, path)} label={label} placeholder={placeholder} {...register(path)} />;
  }
}
