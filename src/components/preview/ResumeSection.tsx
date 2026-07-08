import type { ReactNode } from "react";

export function ResumeSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-3 first:mt-0">
      <h2 className="border-b border-slate-900 pb-0.5 text-[10pt] font-bold uppercase tracking-normal">
        {title}
      </h2>
      <div className="mt-1.5 space-y-2">{children}</div>
    </section>
  );
}
