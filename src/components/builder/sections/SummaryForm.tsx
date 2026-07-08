import { useFormContext } from "react-hook-form";
import { SectionCard } from "@/components/builder/SectionCard";
import { Textarea } from "@/components/ui/Textarea";
import { getFieldError } from "@/lib/forms/getFieldError";
import type { ResumeData } from "@/types/resume";

export function SummaryForm() {
  const {
    register,
    formState: { errors }
  } = useFormContext<ResumeData>();

  return (
    <SectionCard description="Keep this concise and truthful. Aim for roughly 40 to 100 words." title="Professional Summary">
      <Textarea
        error={getFieldError(errors, "summary")}
        label="Summary"
        placeholder="Describe your target role, strongest relevant experience, and key strengths."
        rows={8}
        {...register("summary")}
      />
    </SectionCard>
  );
}
