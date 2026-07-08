import type { ReactNode } from "react";

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm">
      <p className="font-medium text-slate-900">{title}</p>
      <p className="mt-1 text-slate-600">{description}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
