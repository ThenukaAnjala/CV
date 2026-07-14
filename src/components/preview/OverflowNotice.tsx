export function OverflowNotice({ pageCount }: { pageCount: number }) {
  if (pageCount <= 1) return null;

  return (
    <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
      Preview spans {pageCount} pages. Use the page controls to review each page.
    </p>
  );
}
