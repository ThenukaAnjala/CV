export function OverflowNotice({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
      Your resume may continue onto a second page.
    </p>
  );
}
