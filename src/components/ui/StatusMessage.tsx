import { cn } from "@/lib/ui/cn";

export function StatusMessage({ children, tone = "neutral" }: { children: string; tone?: "neutral" | "success" | "error" }) {
  return (
    <span
      aria-live="polite"
      className={cn(
        "inline-flex min-h-8 items-center rounded-md px-3 text-xs font-medium",
        tone === "success" && "bg-emerald-50 text-emerald-800",
        tone === "error" && "bg-red-50 text-red-800",
        tone === "neutral" && "bg-slate-100 text-slate-700"
      )}
      role="status"
    >
      {children}
    </span>
  );
}
