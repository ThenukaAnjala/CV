"use client";

import { useMemo } from "react";
import { AtsIssueItem } from "./AtsIssueItem";
import { analyzeResume } from "@/lib/ats/analyzeResume";
import type { ResumeData } from "@/types/resume";

export function AtsReadinessPanel({ data }: { data: ResumeData }) {
  const analysis = useMemo(() => analyzeResume(data), [data]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">ATS Readiness Estimate</h2>
          <p className="mt-1 text-sm text-slate-600">
            This is a general readiness estimate and not an official score from a specific applicant tracking system.
          </p>
        </div>
        <p className="text-3xl font-bold text-blue-800">{analysis.score}/100</p>
      </div>
      <ul className="mt-4 space-y-3">
        {analysis.issues.length === 0 ? (
          <li className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            No major local readiness issues found. Review the resume manually before applying.
          </li>
        ) : (
          analysis.issues.map((issue) => <AtsIssueItem issue={issue} key={issue.id} />)
        )}
      </ul>
    </section>
  );
}
