import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <section className="space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
          AI Systems Lab
        </p>

        <h1 className="text-5xl font-semibold tracking-tight">
          AI Ops Console
        </h1>

        <p className="max-w-2xl text-lg text-zinc-600">
          A portfolio-grade prototype for AI-assisted request triage,
          human review, auditability, and operational decision support.
        </p>

        <div className="flex gap-3">
          <Link
            href="/requests/new"
            className="rounded-lg bg-zinc-950 px-4 py-2 text-white"
          >
            Submit request
          </Link>

          <Link
            href="/requests/review"
            className="rounded-lg border px-4 py-2"
          >
            Review queue
          </Link>

          <Link
            href="/dashboard"
            className="rounded-lg border px-4 py-2"
          >
            Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
