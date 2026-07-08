import type { KeywordStat } from "@/types/resume";

export function KeywordList({ title, keywords, emptyLabel }: { title: string; keywords: KeywordStat[]; emptyLabel: string }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      {keywords.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">{emptyLabel}</p>
      ) : (
        <ul className="mt-2 flex flex-wrap gap-2">
          {keywords.slice(0, 30).map((keyword) => (
            <li className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-800 shadow-sm" key={keyword.term}>
              {keyword.term} <span className="text-slate-500">x{keyword.count}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
