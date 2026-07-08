import type { AtsIssue } from "@/types/resume";
import { cn } from "@/lib/ui/cn";

export function AtsIssueItem({ issue }: { issue: AtsIssue }) {
  return (
    <li className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "rounded px-2 py-0.5 text-xs font-semibold uppercase",
            issue.severity === "error" && "bg-red-50 text-red-700",
            issue.severity === "warning" && "bg-amber-50 text-amber-800",
            issue.severity === "info" && "bg-sky-50 text-sky-700"
          )}
        >
          {issue.severity}
        </span>
        {issue.section ? <span className="text-xs text-slate-500">{issue.section}</span> : null}
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-950">{issue.title}</p>
      <p className="mt-1 text-sm text-slate-700">{issue.description}</p>
    </li>
  );
}
