import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/ui/cn";
import { FormError } from "./FormError";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
};

export function Select({ label, error, className, id, children, ...props }: SelectProps) {
  const inputId = id ?? props.name;
  const errorId = error && inputId ? `${inputId}-error` : undefined;

  return (
    <label className="block text-sm font-medium text-slate-800" htmlFor={inputId}>
      {label}
      <select
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        className={cn(
          "mt-1 block min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100",
          className
        )}
        id={inputId}
        {...props}
      >
        {children}
      </select>
      <FormError id={errorId} message={error} />
    </label>
  );
}
