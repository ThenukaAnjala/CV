import type { InputHTMLAttributes, Ref } from "react";
import { CalendarDays, X } from "lucide-react";
import { cn } from "@/lib/ui/cn";
import { fromMonthInputValue, toMonthInputValue } from "@/lib/resume/dateValues";
import { FormError } from "./FormError";

type MonthYearInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type" | "value"> & {
  label: string;
  value: string;
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
  onValueChange: (value: string) => void;
};

export function MonthYearInput({
  label,
  value,
  error,
  className,
  id,
  disabled,
  inputRef,
  onValueChange,
  ...props
}: MonthYearInputProps) {
  const inputId = id ?? props.name;
  const errorId = error && inputId ? `${inputId}-error` : undefined;
  const monthValue = toMonthInputValue(value);

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-800" htmlFor={inputId}>
        {label}
      </label>
      <div className="mt-1 flex gap-2">
        <div className="relative min-w-0 flex-1">
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden size={16} />
          <input
            aria-describedby={errorId}
            aria-invalid={Boolean(error)}
            className={cn(
              "block min-h-11 w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm text-slate-950 shadow-sm outline-none transition hover:border-slate-400 focus:border-sky-700 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
              className
            )}
            disabled={disabled}
            id={inputId}
            ref={inputRef}
            max="2100-12"
            min="1900-01"
            onChange={(event) => onValueChange(fromMonthInputValue(event.target.value))}
            type="month"
            value={monthValue}
            {...props}
          />
        </div>
        {monthValue && !disabled ? (
          <button
            aria-label={`Clear ${label}`}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-slate-700 shadow-sm hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            onClick={() => onValueChange("")}
            type="button"
          >
            <X aria-hidden size={16} />
          </button>
        ) : null}
      </div>
      <FormError id={errorId} message={error} />
    </div>
  );
}

export { fromMonthInputValue, toMonthInputValue };
