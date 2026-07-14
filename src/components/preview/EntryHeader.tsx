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
  const leftClass = date ? "min-w-0 flex-1 pr-4" : "min-w-0 flex-1";

  return (
    <div className="flex w-full items-start text-[10.5pt] leading-snug">
      {left || subline ? (
        <div className={leftClass}>
          {left ? (
            <p className="break-words">
              <strong>{left}</strong>
            </p>
          ) : null}
          {subline ? <p className="break-words text-[10pt] leading-snug">{subline}</p> : null}
        </div>
      ) : null}
      {date ? <p className="ml-auto shrink-0 whitespace-nowrap text-right">{date}</p> : null}
    </div>
  );
}
