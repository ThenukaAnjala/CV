import { joinNonEmpty } from "@/lib/resume/format";

export function EntryHeader({
  primary,
  secondary,
  meta,
  subline,
  date
}: {
  primary: string;
  secondary?: string;
  meta?: string;
  subline?: string;
  date?: string;
}) {
  const left = joinNonEmpty([primary, secondary ?? "", meta ?? ""], ", ");
  if (!left && !subline && !date) return null;
  const layoutClass = date
    ? "grid grid-cols-[minmax(0,1fr)_auto] gap-4 text-[10.5pt] leading-snug"
    : "grid grid-cols-1 gap-0.5 text-[10.5pt] leading-snug";

  return (
    <div className={layoutClass}>
      <div className="min-w-0">
        {left ? (
          <p className="break-words">
            <strong>{left}</strong>
          </p>
        ) : null}
        {subline ? <p className="break-words text-[10pt] leading-snug">{subline}</p> : null}
      </div>
      {date ? <p className="justify-self-end whitespace-nowrap text-right">{date}</p> : null}
    </div>
  );
}
