import Link from "next/link";

export default function CaseStudyPage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <Link href="/" className="text-sm text-ink-muted">← Home</Link>

      <section className="mt-10 space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">Case study</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">AI Ops Console v0.2</h1>
        <p className="text-lg leading-8 text-ink-muted">
          A small operational triage console that classifies messy business notices,
          preserves a human review layer, and records an audit trail.
        </p>

        <div className="grid gap-4">
          {[
            ["Problem", "Important operational signals hide inside routine vendor, billing, support, and compliance messages."],
            ["System", "Classify the request, expose the rationale through suggested action, route to review, and record human decisions."],
            ["Constraint", "The model output is not the product. The product is the review loop."],
            ["Next", "Add explicit override fields for corrected category, risk, urgency, owner, and follow-up date."],
          ].map(([title, body]) => (
            <article key={title} className="border-[1.5px] border-ink bg-paper-2 p-5">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-ink-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
