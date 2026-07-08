import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/ui/cn";
import { FormError } from "./FormError";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  description?: string;
};

export function Input({ label, error, description, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name;
  const errorId = error && inputId ? `${inputId}-error` : undefined;

  return (
    <label className="block text-sm font-semibold text-slate-800" htmlFor={inputId}>
      {label}
      {description ? <span className="mt-1 block text-xs font-normal text-slate-500">{description}</span> : null}
      <input
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        className={cn(
          "mt-1 block min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-sky-700 focus:ring-2 focus:ring-sky-100",
          className
        )}
        id={inputId}
        {...props}
      />
      <FormError id={errorId} message={error} />
    </label>
  );
}
