"use client";

import { useMemo, useState } from "react";
import { KeywordList } from "./KeywordList";
import { Textarea } from "@/components/ui/Textarea";
import { matchJobDescription } from "@/lib/ats/keywordMatcher";
import type { ResumeData } from "@/types/resume";

export function JobDescriptionMatcher({ data }: { data: ResumeData }) {
  const [description, setDescription] = useState("");
  const result = useMemo(() => matchJobDescription(data, description), [data, description]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Job Description Keyword Match</h2>
      <p className="mt-1 text-sm text-slate-600">
        This local text comparison does not understand recruiter intent perfectly and is not an official ATS match.
      </p>
      <div className="mt-4">
        <Textarea
          label="Paste job description"
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Paste a job description here. Processing stays in this browser."
          rows={8}
          value={description}
        />
      </div>
      <div className="mt-4 rounded-md bg-slate-100 p-3">
        <p className="text-sm font-semibold text-slate-950">Match estimate: {result.matchScore}%</p>
        <p className="mt-1 text-sm text-slate-700">
          Only add a missing keyword when it truthfully represents your experience, education, project work, or skills.
        </p>
      </div>
      <div className="mt-4 space-y-5">
        <KeywordList emptyLabel="No matched keywords yet." keywords={result.matched} title="Matched keywords" />
        <KeywordList emptyLabel="Paste a job description to see potentially missing keywords." keywords={result.missing} title="Potentially missing keywords" />
        <KeywordList emptyLabel="No resume keywords found yet." keywords={result.resumeKeywords.slice(0, 20)} title="Resume keyword frequency" />
        <KeywordList emptyLabel="No job description keywords found yet." keywords={result.jobKeywords.slice(0, 20)} title="Job description keyword frequency" />
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Limitations: keyword matching is local text comparison, a match is not proof of qualification, and different ATS
        products may parse documents differently.
      </p>
    </section>
  );
}
