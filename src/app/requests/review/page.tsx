import Link from "next/link";
import { RequestCard } from "@/components/RequestCard";
import { getRequests, getAuditLog } from "@/lib/data/store";
import type { OpsRequest } from "@/lib/data/types";

function priorityScore(request: OpsRequest) {
  const statusWeight = request.status === "new" ? 100 : 0;
  const riskWeight =
    request.riskLevel === "high" ? 30 : request.riskLevel === "medium" ? 15 : 5;

  return statusWeight + riskWeight + request.urgency;
}

function priorityLabel(request: OpsRequest) {
  if (request.status !== "new") return "Closed";
  if (request.riskLevel === "high" || request.urgency >= 8) return "Escalate first";
  if (request.riskLevel === "medium" || request.urgency >= 5) return "Review next";
  return "Triage when clear";
}

function SummaryTile({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-zinc-100">{value}</p>
      <p className="mt-2 text-sm text-zinc-500">{detail}</p>
    </article>
  );
}

export default async function ReviewQueuePage() {
  const [requests, auditLog] = await Promise.all([getRequests(), getAuditLog()]);

  const pending = requests.filter((request) => request.status === "new");
  const completed = requests.filter((request) => request.status !== "new");
  const highRiskPending = pending.filter((request) => request.riskLevel === "high");
  const orderedRequests = [...requests].sort(
    (a, b) => priorityScore(b) - priorityScore(a)
  );
  const nextRequest = orderedRequests.find((request) => request.status === "new");

  return (
    <main className="mx-auto max-w-6xl p-8">
      <Link href="/" className="text-sm text-zinc-500">
        ← Home
      </Link>

      <section className="mt-10 space-y-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              Review queue
            </p>
            <h1 className="mt-3 text-5xl font-semibold tracking-tight">
              Operator review loop.
            </h1>
            <p className="mt-3 max-w-3xl text-zinc-400">
              Review the highest-priority item first, confirm or override the
              classification, and leave enough rationale for the audit trail to
              explain the decision later.
            </p>
          </div>

          <Link
            href="/requests/new"
            className="ml-auto rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950"
          >
            New request
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <SummaryTile
            label="Pending"
            value={pending.length}
            detail="Items still waiting on a human decision."
          />
          <SummaryTile
            label="High risk"
            value={highRiskPending.length}
            detail="Pending requests that should be handled first."
          />
          <SummaryTile
            label="Completed"
            value={completed.length}
            detail="Reviewed, approved, or rejected requests."
          />
          <SummaryTile
            label="Next action"
            value={nextRequest ? priorityLabel(nextRequest) : "Clear"}
            detail={
              nextRequest
                ? `${nextRequest.category} · urgency ${nextRequest.urgency}/10`
                : "No pending operator work."
            }
          />
        </div>

        {nextRequest && (
          <section className="rounded-2xl border border-zinc-700 bg-zinc-950/70 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Recommended first pass
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold">{priorityLabel(nextRequest)}</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Start with this request because it has the highest open
                  priority score in the queue.
                </p>
              </div>
              <div className="rounded-full border border-zinc-700 px-3 py-1 text-sm text-zinc-300">
                {nextRequest.riskLevel} risk · urgency {nextRequest.urgency}/10
              </div>
            </div>
          </section>
        )}

        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Requests</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Sorted by pending status, risk, and urgency.
            </p>
          </div>

          <div className="grid gap-4">
            {orderedRequests.length ? (
              orderedRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))
            ) : (
              <div className="rounded-2xl border border-zinc-800 p-6 text-zinc-400">
                No requests yet. Submit one to test the review loop.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Audit trail</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Most recent system and human review events.
              </p>
            </div>
            <span className="text-xs text-zinc-500">
              Showing latest {Math.min(auditLog.length, 8)} of {auditLog.length}
            </span>
          </div>

          <div className="mt-4 grid gap-3">
            {auditLog.slice(0, 8).map((event) => (
              <div key={event.id} className="rounded-xl border border-zinc-800 p-3 text-sm">
                <p className="text-zinc-300">{event.action}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {event.createdAt} · {event.actor}
                </p>
                <p className="mt-2 text-zinc-400">{event.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
