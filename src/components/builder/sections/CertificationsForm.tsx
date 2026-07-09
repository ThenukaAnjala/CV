import { Plus } from "lucide-react";
import { useFormContext, type Path } from "react-hook-form";
import { MonthYearField } from "@/components/builder/fields/MonthYearField";
import { RepeatedItemControls } from "@/components/builder/RepeatedItemControls";
import { SectionCard } from "@/components/builder/SectionCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { cloneCertification, moveItem } from "@/lib/resume/arrayActions";
import { createBlankCertification } from "@/lib/resume/defaults";
import { getFieldError } from "@/lib/forms/getFieldError";
import type { CertificationEntry, ResumeData } from "@/types/resume";

export function CertificationsForm() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ResumeData>();
  const items = watch("certifications") ?? [];
  const setItems = (next: CertificationEntry[]) => setValue("certifications", next, { shouldDirty: true, shouldValidate: true });

  return (
    <SectionCard actions={<Button icon={<Plus aria-hidden size={16} />} onClick={() => setItems([...items, createBlankCertification()])} size="sm">Add certification</Button>} description="Certification URLs are exported as real links when valid." title="Certifications">
      {items.length === 0 ? <EmptyState title="No certifications added" description="Add certifications only when they truthfully apply." /> : null}
      {items.map((item, index) => (
        <SectionCard actions={<RepeatedItemControls disableMoveDown={index === items.length - 1} disableMoveUp={index === 0} hidden={item.hidden} itemLabel={`Certification ${index + 1}`} onDelete={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))} onDuplicate={() => setItems([...items.slice(0, index + 1), cloneCertification(item), ...items.slice(index + 1)])} onMoveDown={() => setItems(moveItem(items, index, 1))} onMoveUp={() => setItems(moveItem(items, index, -1))} onToggleHidden={() => setItems(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, hidden: !entry.hidden } : entry))} />} key={item.id} title={`Certification ${index + 1}`}>
          <div className="grid gap-4 sm:grid-cols-2">
            {renderField(`certifications.${index}.name`, "Certification name", "Certification Name")}
            {renderField(`certifications.${index}.issuer`, "Issuer", "Issuer Name")}
            <MonthYearField label="Issue date" name={`certifications.${index}.year`} />
            {renderField(`certifications.${index}.credentialUrl`, "Credential URL", "https://example.com", "url")}
          </div>
        </SectionCard>
      ))}
    </SectionCard>
  );

  function renderField(name: string, label: string, placeholder: string, type = "text") {
    const path = name as Path<ResumeData>;
    return <Input error={getFieldError(errors, path)} label={label} placeholder={placeholder} type={type} {...register(path)} />;
  }
}
