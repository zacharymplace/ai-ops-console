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
    <article className="border-[1.5px] border-ink bg-paper-2 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-ink">{value}</p>
      <p className="mt-2 text-sm text-ink-muted">{detail}</p>
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
      <Link href="/" className="text-sm text-ink-muted">
        ← Home
      </Link>

      <section className="mt-10 space-y-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">
              Review queue
            </p>
            <h1 className="mt-3 text-5xl font-semibold tracking-tight">
              Operator review loop.
            </h1>
            <p className="mt-3 max-w-3xl text-ink-muted">
              Review the highest-priority item first, confirm or override the
              classification, and leave enough rationale for the audit trail to
              explain the decision later.
            </p>
          </div>

          <Link
            href="/requests/new"
            className="ml-auto bg-spot px-4 py-2 text-sm font-semibold text-paper"
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
          <section className="border-[1.5px] border-ink bg-paper-2 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">
              Recommended first pass
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold">{priorityLabel(nextRequest)}</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Start with this request because it has the highest open
                  priority score in the queue.
                </p>
              </div>
              <div className="border-[1.5px] border-ink px-3 py-1 text-sm text-ink-2">
                {nextRequest.riskLevel} risk · urgency {nextRequest.urgency}/10
              </div>
            </div>
          </section>
        )}

        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Requests</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Sorted by pending status, risk, and urgency.
            </p>
          </div>

          <div className="grid gap-4">
            {orderedRequests.length ? (
              orderedRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))
            ) : (
              <div className="border-[1.5px] border-ink p-6 text-ink-muted">
                No requests yet. Submit one to test the review loop.
              </div>
            )}
          </div>
        </section>

        <section className="border-[1.5px] border-ink bg-paper-2 p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Audit trail</h2>
              <p className="mt-1 text-sm text-ink-muted">
                Most recent system and human review events, grouped for quick operator reading.
              </p>
            </div>
            <span className="text-xs text-ink-muted">
              Showing latest {Math.min(auditLog.length, 8)} of {auditLog.length}
            </span>
          </div>

          <div className="mt-4 grid gap-3">
            {auditLog.slice(0, 8).map((event) => (
              <div key={event.id} className="border-[1.5px] border-ink p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-ink-2">{event.action}</p>
                  <span className="border-[1.5px] border-ink px-2 py-1 text-xs text-ink-muted">
                    {event.actor}
                  </span>
                </div>

                <p className="mt-1 text-xs text-ink-muted">{event.createdAt}</p>

                <div className="mt-3 border-[1.5px] border-ink bg-paper-2 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">
                    Decision evidence
                  </p>
                  <p className="mt-2 text-ink-muted">{event.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
