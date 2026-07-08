import { cn } from "@/lib/ui/cn";

export function StatusMessage({ children, tone = "neutral" }: { children: string; tone?: "neutral" | "success" | "error" }) {
  return (
    <span
      aria-live="polite"
      className={cn(
        "inline-flex min-h-9 max-w-full items-center rounded-md border px-3 text-xs font-semibold shadow-sm",
        tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
        tone === "error" && "border-red-200 bg-red-50 text-red-800",
        tone === "neutral" && "border-sky-200 bg-sky-50 text-sky-900"
      )}
      role="status"
    >
      {children}
    </span>
  );
}
