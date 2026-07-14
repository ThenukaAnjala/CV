import { useFormContext } from "react-hook-form";
import { Plus } from "lucide-react";
import { SectionCard } from "@/components/builder/SectionCard";
import { LinkFields } from "@/components/builder/fields/LinkFields";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createBlankLink } from "@/lib/resume/defaults";
import { moveItem } from "@/lib/resume/arrayActions";
import { getFieldError } from "@/lib/forms/getFieldError";
import type { ResumeData } from "@/types/resume";

export function PersonalInfoForm() {
  const {
    register,
    watch,
    setValue,
    formState: { errors }
  } = useFormContext<ResumeData>();
  const links = watch("personal.links") ?? [];

  return (
    <SectionCard
      description="This information appears in the centered resume header."
      title="Personal Information"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input error={getFieldError(errors, "personal.fullName")} label="Full name" placeholder="YOUR NAME" {...register("personal.fullName")} />
        <Input error={getFieldError(errors, "personal.headline")} label="Target headline" placeholder="TARGET JOB TITLE" {...register("personal.headline")} />
        <Input error={getFieldError(errors, "personal.email")} label="Email" placeholder="name@example.com" type="email" {...register("personal.email")} />
        <Input error={getFieldError(errors, "personal.phone")} label="Phone" placeholder="+94 70 123 4567" type="tel" {...register("personal.phone")} />
        <Input error={getFieldError(errors, "personal.location")} label="Location" placeholder="City, State" {...register("personal.location")} />
      </div>
      <LinkFields
        fieldPrefix="personal.links"
        label="Contact links"
        links={links}
        onAdd={() => setValue("personal.links", [...links, createBlankLink()], { shouldDirty: true, shouldValidate: true })}
        onDelete={(index) => setValue("personal.links", links.filter((_, itemIndex) => itemIndex !== index), { shouldDirty: true, shouldValidate: true })}
        onMove={(index, direction) => setValue("personal.links", moveItem(links, index, direction), { shouldDirty: true, shouldValidate: true })}
      />
      {links.length === 0 ? (
        <Button icon={<Plus aria-hidden size={16} />} onClick={() => setValue("personal.links", [createBlankLink()], { shouldDirty: true })} size="sm" variant="ghost">
          Add optional profile link
        </Button>
      ) : null}
    </SectionCard>
  );
}
