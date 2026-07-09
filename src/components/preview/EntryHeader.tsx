import { joinNonEmpty } from "@/lib/resume/format";

export function EntryHeader({
  primary,
  secondary,
  meta,
  date
}: {
  primary: string;
  secondary?: string;
  meta?: string;
  date?: string;
}) {
  const left = joinNonEmpty([primary, secondary ?? "", meta ?? ""], ", ");
  if (!left && !date) return null;

  return (
    <div className="grid grid-cols-1 gap-0.5 text-[10.5pt] leading-snug sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4">
      <p className="min-w-0 break-words">
        <strong>{left}</strong>
      </p>
      {date ? <p className="text-left sm:whitespace-nowrap sm:text-right">{date}</p> : null}
    </div>
  );
}
