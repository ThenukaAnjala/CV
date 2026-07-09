import { useController, useFormContext, type Path } from "react-hook-form";
import { MonthYearInput } from "@/components/ui/MonthYearInput";
import type { ResumeData } from "@/types/resume";

type MonthYearFieldProps<TName extends Path<ResumeData>> = {
  name: TName;
  label: string;
  disabled?: boolean;
};

export function MonthYearField<TName extends Path<ResumeData>>({ name, label, disabled }: MonthYearFieldProps<TName>) {
  const { control } = useFormContext<ResumeData>();
  const { field, fieldState } = useController({ control, name });
  const value = typeof field.value === "string" ? field.value : "";

  return (
    <MonthYearInput
      disabled={disabled}
      error={fieldState.error?.message}
      inputRef={field.ref}
      label={label}
      name={field.name}
      onBlur={field.onBlur}
      onValueChange={field.onChange}
      value={value}
    />
  );
}
