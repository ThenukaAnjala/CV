import { cn } from "@/lib/ui/cn";

export function StatusMessage({
  children,
  className,
  tone = "neutral"
}: {
  children: string;
  className?: string;
  tone?: "neutral" | "success" | "error";
}) {
  return (
    <span
      aria-live="polite"
      className={cn(
        "block min-h-9 max-w-full break-words rounded-md border px-3 py-2 text-left text-xs font-semibold leading-5 shadow-sm",
        tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
        tone === "error" && "border-red-200 bg-red-50 text-red-800",
        tone === "neutral" && "border-sky-200 bg-sky-50 text-sky-900",
        className
      )}
      role="status"
    >
      {children}
    </span>
  );
}
