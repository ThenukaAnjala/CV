import { get, type FieldErrors, type FieldValues, type Path } from "react-hook-form";

export function getFieldError<T extends FieldValues>(errors: FieldErrors<T>, path: Path<T>): string | undefined {
  const field = get(errors, path);
  return typeof field?.message === "string" ? field.message : undefined;
}
