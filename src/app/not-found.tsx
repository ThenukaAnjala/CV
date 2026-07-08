import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-950">Page not found</h1>
        <p className="mt-2 text-sm text-slate-700">Return to the resume builder to continue editing.</p>
        <Link className="mt-5 inline-flex text-sm font-medium text-blue-700 underline" href="/">
          Open builder
        </Link>
      </section>
    </main>
  );
}
