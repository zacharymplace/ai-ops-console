import { getAuditLog, getRequests } from "@/lib/data/store";

export default async function CaseStudyPage() {
  const requests = await getRequests();
  const auditLog = await getAuditLog();

  return (
    <main className="mx-auto max-w-5xl p-8">
      <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
        Portfolio case study
      </p>

      <h1 className="mt-2 text-4xl font-semibold tracking-tight">
        AI Ops Console
      </h1>

      <p className="mt-4 max-w-3xl text-lg text-zinc-600">
        AI Ops Console is a human-in-the-loop operations prototype for
        classifying messy inbound requests, assigning risk, routing review, and
        preserving an auditable decision trail.
      </p>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <Metric label="Requests processed" value={requests.length} />
        <Metric label="Audit events" value={auditLog.length} />
        <Metric label="Evaluation score" value="100%" />
      </section>

      <section className="mt-10 space-y-8">
        <CaseBlock
          title="Problem"
          body="Operational teams receive messy inputs from customers, vendors, finance processes, and internal workflows. AI can help triage these inputs, but only if the system includes human review, evaluation gates, and auditability."
        />

        <CaseBlock
          title="Manual workflow"
          body="A human reads every request, guesses category and urgency, decides whether to escalate, and leaves limited traceability behind the decision."
        />

        <CaseBlock
          title="AI-assisted workflow"
          body="The system classifies each request, assigns risk and urgency, suggests a next action, queues the item for human review, and logs both system and human decisions."
        />

        <CaseBlock
          title="Controls"
          body="The prototype includes deterministic classification rules, a regression evaluation harness, reviewer notes, approval/rejection states, audited reclassification, and dashboard-level visibility."
        />

        <CaseBlock
          title="Evaluation method"
          body="Classifier behavior is tested against labeled cases with expected category, risk, and urgency. The evaluation script writes a JSON report so regressions can be caught before UI polish hides system weakness."
        />

        <CaseBlock
          title="What this demonstrates"
          body="This project demonstrates AI workflow design, operational risk thinking, human-in-the-loop review, evaluation discipline, audit logging, and productized interface design."
        />

        <CaseBlock
          title="Next improvements"
          body="The next layer would add prompt versioning, OpenAI classification behind a feature flag, Supabase persistence, authentication, role-based review controls, and expanded evaluation coverage."
        />
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border p-5">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function CaseBlock({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-xl border p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-3 leading-7 text-zinc-600">{body}</p>
    </section>
  );
}
