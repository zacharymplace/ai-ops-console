import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <section className="space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">
          AI Systems Lab
        </p>

        <h1 className="text-5xl font-semibold tracking-tight">
          AI Ops Console
        </h1>

        <p className="max-w-2xl text-lg text-ink-muted">
          A portfolio-grade prototype for AI-assisted request triage,
          human review, auditability, and operational decision support.
        </p>

        <div className="flex gap-3">
          <Link
            href="/requests/new"
            className="bg-ink px-4 py-2 text-paper"
          >
            Submit request
          </Link>

          <Link
            href="/requests/review"
            className="border-[1.5px] px-4 py-2"
          >
            Review queue
          </Link>

          <Link
            href="/dashboard"
            className="border-[1.5px] px-4 py-2"
          >
            Dashboard
          </Link>

          <Link
            href="/case-study"
            className="border-[1.5px] px-4 py-2"
          >
            Case study
          </Link>
        </div>
      </section>
    </main>
  );
}
